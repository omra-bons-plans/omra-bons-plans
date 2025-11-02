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
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Vérifier le cache d'abord
    const cached = adminCache.current.get(user.id);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
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

      if (error) {
        setIsAdmin(false);
      } else {
        const isAdminUser = !!data;
        
        // Mise en cache sécurisée
        adminCache.current.set(user.id, {
          isAdmin: isAdminUser,
          timestamp: Date.now()
        });
        
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
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