import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCompletionStatus {
  isComplete: boolean;
  loading: boolean;
  missingFields: string[];
}

const PERSONAL_REQUIRED_FIELDS = ['first_name', 'kuniya', 'gender', 'email', 'phone', 'whatsapp'] as const;
const PROFESSIONAL_REQUIRED_FIELDS = ['company_name', 'company_address', 'professional_email', 'professional_phone'] as const;

export const useProfileCompletion = (): ProfileCompletionStatus => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ProfileCompletionStatus>({
    isComplete: false,
    loading: true,
    missingFields: []
  });

  useEffect(() => {
    if (!user) {
      setStatus({ isComplete: false, loading: false, missingFields: [] });
      return;
    }

    const checkProfileCompletion = async (retryCount = 0) => {
      try {
        console.log('🔍 Checking profile completion for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, kuniya, gender, email, phone, whatsapp, is_professional, company_name, company_address, professional_email, professional_phone')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile completion:', error);
          
          // Si c'est une erreur réseau et qu'on a encore des tentatives
          if (retryCount < 2 && (error.message?.includes('Failed to fetch') || error.message?.includes('fetch'))) {
            console.log(`🔄 Retrying profile completion check (attempt ${retryCount + 1}/2)`);
            setTimeout(() => checkProfileCompletion(retryCount + 1), 1000);
            return;
          }
          
          // Après les tentatives, on considère le profil comme potentiellement incomplet
          setStatus({ isComplete: false, loading: false, missingFields: [...PERSONAL_REQUIRED_FIELDS] });
          return;
        }

        console.log('✅ Profile data retrieved:', data);

        const missingFields: string[] = [];
        
        if (data) {
          // Determine required fields based on professional status
          const requiredFields = data.is_professional ? PROFESSIONAL_REQUIRED_FIELDS : PERSONAL_REQUIRED_FIELDS;
          
          requiredFields.forEach(field => {
            const value = (data as any)[field];
            if (!value || value.toString().trim() === '') {
              missingFields.push(field);
            }
          });
        } else {
          // Profile doesn't exist, assume personal account and all personal fields are missing
          missingFields.push(...PERSONAL_REQUIRED_FIELDS);
        }

        console.log('📊 Profile completion status:', {
          isComplete: missingFields.length === 0,
          missingFields
        });

        setStatus({
          isComplete: missingFields.length === 0,
          loading: false,
          missingFields
        });

      } catch (error) {
        console.error('Unexpected error checking profile:', error);
        
        // Retry logic pour les erreurs inattendues aussi
        if (retryCount < 2) {
          console.log(`🔄 Retrying after unexpected error (attempt ${retryCount + 1}/2)`);
          setTimeout(() => checkProfileCompletion(retryCount + 1), 1000);
          return;
        }
        
        setStatus({ isComplete: false, loading: false, missingFields: [...PERSONAL_REQUIRED_FIELDS] });
      }
    };

    checkProfileCompletion();
  }, [user]);

  return status;
};