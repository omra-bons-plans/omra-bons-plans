import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
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

  // Cache sécurisé pour éviter les requêtes duplicées
  const adminCache = useRef<Map<string, { isAdmin: boolean; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('🔒 AdminContext: No user found');
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    console.log('🔍 AdminContext: Checking admin status for user:', user.id);

    // Vérifier le cache d'abord
    const cached = adminCache.current.get(user.id);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('✅ AdminContext: Using cached admin status:', cached.isAdmin);
      setIsAdmin(cached.isAdmin);
      setLoading(false);
      return;
    }

    try {
      // Vérification sécurisée - aucune information sensible exposée
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      console.log('📊 AdminContext: Query result -', { data, error: error?.message });

      if (error) {
        console.error('❌ AdminContext: Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        const isAdminUser = !!data;
        console.log('✅ AdminContext: Is admin?', isAdminUser);
        
        // Mise en cache sécurisée
        adminCache.current.set(user.id, {
          isAdmin: isAdminUser,
          timestamp: Date.now()
        });
        
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
      console.error('❌ AdminContext: Exception:', error);
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