import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const checkAdminStatus = async () => {
    console.log('🔍 Checking admin status for user:', user?.id);
    if (!user) {
      console.log('❌ No user found, setting isAdmin to false');
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Querying user_roles for user:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      console.log('📊 Query result - data:', data, 'error:', error);

      if (error) {
        console.error('❌ Erreur lors de la vérification du rôle admin:', error);
        setIsAdmin(false);
      } else {
        const isAdminUser = !!data;
        console.log('✅ Setting isAdmin to:', isAdminUser);
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
      console.error('💥 Erreur lors de la vérification du rôle admin:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};