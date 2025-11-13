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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthContext: Initializing...');
    
    // Check for recovery mode IMMEDIATELY when component mounts
    const urlHash = window.location.hash;
    if (urlHash.includes('type=recovery')) {
      console.log('🔐 Recovery mode detected, redirecting to /auth');
      sessionStorage.setItem('password_reset_mode', 'true');
      window.location.href = '/auth';
      return;
    }

    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          console.log('🔐 AuthContext: Component unmounted, ignoring auth event');
          return;
        }
        
        console.log('🔐 Auth event:', event, 'User:', session?.user?.email || 'none');
        
        // Check if we're in password reset mode
        const isPasswordResetMode = sessionStorage.getItem('password_reset_mode') === 'true';
        
        // If we're in password reset mode and this is a SIGNED_IN event from recovery
        if (isPasswordResetMode && event === 'SIGNED_IN') {
          console.log('🔐 Password reset mode: keeping session but not setting user');
          setSession(session);
          setUser(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) {
          console.log('🔐 AuthContext: Component unmounted, ignoring session check');
          return;
        }
        
        if (error) {
          console.error('🔐 Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('🔐 Initial session check:', session?.user?.email || 'no user');
        
        const isPasswordResetMode = sessionStorage.getItem('password_reset_mode') === 'true';
        
        if (isPasswordResetMode && session) {
          console.log('🔐 Password reset mode: initial session found');
          setSession(session);
          setUser(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('🔐 Fatal error in getSession:', error);
        setLoading(false);
      });

    return () => {
      console.log('🔐 AuthContext: Cleanup - unsubscribing');
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