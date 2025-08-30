-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    html_content TEXT NOT NULL,
    css_content TEXT NOT NULL,
    js_content TEXT,
    thumbnail_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_public BOOLEAN DEFAULT FALSE,
    downloads INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    subscription_id VARCHAR(255)
);

-- Create user_projects table
CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    customizations JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_url TEXT
);

-- Create template_reviews table
CREATE TABLE IF NOT EXISTS public.template_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, user_id)
);

-- Create template_downloads table for tracking
CREATE TABLE IF NOT EXISTS public.template_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Templates table policies
CREATE POLICY "Templates are viewable by everyone if public" ON public.templates
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own templates" ON public.templates
    FOR ALL USING (auth.uid() = user_id);

-- Transactions table policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User projects table policies
CREATE POLICY "Users can manage own projects" ON public.user_projects
    FOR ALL USING (auth.uid() = user_id);

-- Template reviews table policies
CREATE POLICY "Reviews are viewable by everyone" ON public.template_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON public.template_reviews
    FOR ALL USING (auth.uid() = user_id);

-- Template downloads table policies
CREATE POLICY "Users can view own downloads" ON public.template_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert downloads" ON public.template_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_status ON public.templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_public ON public.templates(is_public);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_template_reviews_template_id ON public.template_reviews(template_id);
CREATE INDEX IF NOT EXISTS idx_template_downloads_template_id ON public.template_downloads(template_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON public.user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update template rating
CREATE OR REPLACE FUNCTION update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.templates 
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM public.template_reviews 
        WHERE template_id = NEW.template_id
    )
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating template rating
CREATE TRIGGER update_template_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.template_reviews
    FOR EACH ROW EXECUTE FUNCTION update_template_rating();

-- Create function to update template downloads count
CREATE OR REPLACE FUNCTION update_template_downloads_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.templates 
        SET downloads = downloads + 1 
        WHERE id = NEW.template_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.templates 
        SET downloads = downloads - 1 
        WHERE id = OLD.template_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for updating template downloads count
CREATE TRIGGER update_template_downloads_count_trigger 
    AFTER INSERT OR DELETE ON public.template_downloads
    FOR EACH ROW EXECUTE FUNCTION update_template_downloads_count();

-- Insert sample data for testing
INSERT INTO public.users (id, email, full_name, subscription_tier, is_verified) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'demo@bisnisbaik.com', 'Demo User', 'premium', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.templates (id, user_id, name, description, html_content, css_content, thumbnail_url, category, price, is_public, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Restoran Modern', 'Template website restoran dengan desain modern', '<html><body><h1>Restoran Modern</h1></body></html>', 'body { font-family: Arial; }', 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg', 'Restoran', 150000, true, 'published')
ON CONFLICT (id) DO NOTHING;
