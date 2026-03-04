import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // ⚡ CRITICAL: Start with loading=false for instant render - auth resolves in background
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Check for recovery mode (do NOT redirect, Supabase must parse hash tokens first)
    const urlHash = window.location.hash;
    if (urlHash.includes('type=recovery')) {
      sessionStorage.setItem('password_reset_mode', 'true');
    }

    // ⚡ Get session in background - don't block render

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      const isPasswordResetMode = sessionStorage.getItem('password_reset_mode') === 'true';
      
      if (isPasswordResetMode && session) {
        setSession(session);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
    }).catch((error) => {
      console.error('❌ Auth session error:', error);
    });

    // Set up auth listener - MUST be synchronous only
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 AuthContext: Auth state changed -', event);
        
        const isPasswordResetMode = sessionStorage.getItem('password_reset_mode') === 'true';
        
        if (isPasswordResetMode && event === 'SIGNED_IN') {
          setSession(session);
          setUser(null);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};