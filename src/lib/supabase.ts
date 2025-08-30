import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.MODE !== 'test') {
    throw new Error('Missing Supabase environment variables');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          phone?: string;
          created_at: string;
          updated_at: string;
          is_verified: boolean;
          subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
          last_login: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
          is_verified?: boolean;
          subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
          last_login?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
          is_verified?: boolean;
          subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
          last_login?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method: string;
          description: string;
          created_at: string;
          updated_at: string;
          template_id?: string;
          subscription_id?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method: string;
          description: string;
          created_at?: string;
          updated_at?: string;
          template_id?: string;
          subscription_id?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          template_id?: string;
          subscription_id?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          html_content: string;
          css_content: string;
          js_content?: string;
          thumbnail_url: string;
          category: string;
          tags: string[];
          price: number;
          is_public: boolean;
          downloads: number;
          rating: number;
          created_at: string;
          updated_at: string;
          status: 'draft' | 'published' | 'archived';
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          html_content: string;
          css_content: string;
          js_content?: string;
          thumbnail_url: string;
          category: string;
          tags?: string[];
          price: number;
          is_public?: boolean;
          downloads?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'published' | 'archived';
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          html_content?: string;
          css_content?: string;
          js_content?: string;
          thumbnail_url?: string;
          category?: string;
          tags?: string[];
          price?: number;
          is_public?: boolean;
          downloads?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'published' | 'archived';
        };
      };
      user_projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          template_id?: string;
          customizations: Record<string, any>;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
          published_url?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          template_id?: string;
          customizations?: Record<string, any>;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
          published_url?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          template_id?: string;
          customizations?: Record<string, any>;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
          published_url?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
