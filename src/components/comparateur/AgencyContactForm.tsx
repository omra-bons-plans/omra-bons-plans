import { useState, lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Mail from 'lucide-react/dist/esm/icons/mail';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Send from 'lucide-react/dist/esm/icons/send';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const Textarea = lazy(() => import('@/components/ui/textarea').then(m => ({ default: m.Textarea })));

const schema = z.object({
  agencyName: z.string().trim().min(2).max(100),
  contactName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
  message: z.string().trim().min(10).max(1000),
});

const EMPTY = { agencyName: '', contactName: '', email: '', phone: '', message: '' };

export function AgencyContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = schema.parse(form);
      const nameParts = data.contactName.trim().split(' ');
      const prenom = nameParts[0] || '';
      const nom = nameParts.slice(1).join(' ') || nameParts[0];
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          nom,
          prenom,
          mail: data.email,
          message: `Demande d'apparition dans le comparateur\n\nAgence: ${data.agencyName}\nContact: ${data.contactName}\nTéléphone: ${data.phone}\n\nMessage:\n${data.message}`,
        },
      });
      if (error) throw error;
      toast.success('Votre demande a été envoyée avec succès !');
      setForm(EMPTY);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error("Erreur lors de l'envoi du message");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            <Mail className="h-4 w-4" />
            <span>Agences de voyage</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Vous souhaitez apparaître sur notre comparateur ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Écrivez-nous et faites découvrir vos offres à des milliers de pèlerins
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="agencyName" className="text-sm font-medium">
                Nom de l'agence <span className="text-destructive">*</span>
              </label>
              <Input id="agencyName" placeholder="Votre agence" value={form.agencyName} onChange={set('agencyName')} required maxLength={100} />
            </div>

            <div className="space-y-2">
              <label htmlFor="contactName" className="text-sm font-medium">
                Votre nom <span className="text-destructive">*</span>
              </label>
              <Input id="contactName" placeholder="Prénom Nom" value={form.contactName} onChange={set('contactName')} required maxLength={100} />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input id="email" type="email" placeholder="contact@votre-agence.fr" value={form.email} onChange={set('email')} required maxLength={255} />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Téléphone <span className="text-destructive">*</span>
              </label>
              <Input id="phone" type="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={set('phone')} required maxLength={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Votre message <span className="text-destructive">*</span>
            </label>
            <Suspense fallback={<textarea id="message" rows={6} className="w-full border rounded-md p-2 resize-none" placeholder="Votre message..." value={form.message} onChange={set('message')} required maxLength={1000} />}>
              <Textarea
                id="message"
                placeholder="Parlez-nous de votre agence, de vos offres et pourquoi vous souhaitez rejoindre notre comparateur..."
                value={form.message}
                onChange={set('message')}
                required
                maxLength={1000}
                rows={6}
                className="resize-none"
              />
            </Suspense>
            <p className="text-xs text-muted-foreground text-right">{form.message.length}/1000 caractères</p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Envoyer ma demande
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
