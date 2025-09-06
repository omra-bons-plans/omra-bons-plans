import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCompletionStatus {
  isComplete: boolean;
  loading: boolean;
  missingFields: string[];
}

const REQUIRED_FIELDS = ['first_name', 'gender', 'phone'] as const;

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

    const checkProfileCompletion = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, gender, phone')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking profile completion:', error);
          setStatus({ isComplete: false, loading: false, missingFields: REQUIRED_FIELDS as any });
          return;
        }

        const missingFields: string[] = [];
        
        if (data) {
          REQUIRED_FIELDS.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
              missingFields.push(field);
            }
          });
        } else {
          // Profile doesn't exist, all fields are missing
          missingFields.push(...REQUIRED_FIELDS);
        }

        setStatus({
          isComplete: missingFields.length === 0,
          loading: false,
          missingFields
        });

      } catch (error) {
        console.error('Error:', error);
        setStatus({ isComplete: false, loading: false, missingFields: REQUIRED_FIELDS as any });
      }
    };

    checkProfileCompletion();
  }, [user]);

  return status;
};