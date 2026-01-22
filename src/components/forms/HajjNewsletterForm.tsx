import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Mail from 'lucide-react/dist/esm/icons/mail';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }).max(255)
});

export const HajjNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const validation = emailSchema.safeParse({ email: email.trim() });
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Email invalide",
        description: validation.error.errors[0].message
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('hajj_newsletter_subscriptions')
        .insert({
          email: validation.data.email,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Déjà inscrit",
            description: "Cet email est déjà inscrit à notre newsletter Hajj."
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        setEmail('');
        toast({
          title: "Inscription réussie !",
          description: "Vous serez notifié(e) dès que les offres Hajj 2026 seront disponibles."
        });
      }
    } catch (error) {
      console.error('Error subscribing to Hajj newsletter:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
              Inscription confirmée !
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Vous recevrez un email dès que les offres Hajj 2026 seront disponibles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/50 border border-primary/20 rounded-lg p-6 mt-6">
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Ne ratez rien !
          </h4>
          <p className="text-sm text-muted-foreground">
            Inscrivez-vous pour être informé(e) dès que les offres Hajj 2026 seront disponibles
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-11"
              disabled={isSubmitting}
              maxLength={255}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !email.trim()}
            className="h-11 px-6 whitespace-nowrap"
          >
            {isSubmitting ? 'Inscription...' : "M'inscrire"}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          En vous inscrivant, vous acceptez de recevoir des notifications sur les offres Hajj.
        </p>
      </div>
    </div>
  );
};
