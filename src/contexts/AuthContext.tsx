import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  userProfile: Tables<'users'> | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithFacebook: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Tables<'users'>>) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

interface AuthProviderProps { children: React.ReactNode; }

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Tables<'users'> | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await ensureUserProfile(session.user);
      else setUserProfile(null);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await ensureUserProfile(session.user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);

      // Handle redirect after authentication
      if (_event === 'SIGNED_IN' && session) {
        try {
          let redirectPath = '/dashboard'; // Default fallback
          // First try to get the stored redirect path
          const storedRedirect = localStorage.getItem('postAuthRedirect');
          if (storedRedirect) {
            redirectPath = storedRedirect;
            localStorage.removeItem('postAuthRedirect');
            console.log('Using stored redirect path:', redirectPath);
          }else {
            // If no stored redirect, check for pending checkout
            const pendingCheckout = localStorage.getItem('pendingCheckout');
            if (pendingCheckout) {
              const {templateId, optionId} = JSON.parse(pendingCheckout);
              redirectPath = `/checkout?template=${templateId}&option=${optionId}`;
              localStorage.removeItem('pendingCheckout');
              console.log('Using pending checkout:', redirectPath);
            }
          }
          console.log('Redirecting to:', redirectPath);

          // Use window.location.replace for a more reliable redirect
          window.location.replace(redirectPath);
        } catch (e) {
          console.error('Error handling redirect:', e);
          // Fallback to dashboard
          window.location.replace('/dashboard');
        }
      }

    });

    return () => {
      mounted = false;
      try { subscription.unsubscribe(); } catch {}
    };
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

      if (error) {
        console.error('Fetch profile error', error);
        setUserProfile(null);
        return;
      }

      if (!data) {
        const profileData = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          phone: user.user_metadata?.phone || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_verified: false,
          subscription_tier: 'free',
          last_login: new Date().toISOString()
        };
        const { error: upsertError } = await supabase.from('users').insert(profileData);
        if (upsertError) {
          console.error('Upsert profile error', upsertError);
          return;
        }
        const { data: after } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
        setUserProfile(after || null);
      } else {
        await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
        setUserProfile(data as Tables<'users'>);
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      setUserProfile(null);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, phone: phone || '' },
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({

      provider: 'google',

      options: { redirectTo: `${window.location.origin}/auth/callback` },

    });
  };

  const signInWithFacebook = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Tables<'users'>>) => {
    if (!user) return { data: null, error: { message: 'No user logged in' } as AuthError };
    const { data, error } = await supabase.from('users').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', user.id).select().single();
    if (!error && data) {
      setUserProfile(data as Tables<'users'>);
    }
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
