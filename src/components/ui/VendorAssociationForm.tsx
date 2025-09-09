import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface VendorAssociationFormData {
  prenom: string;
  nom: string;
  mail: string;
  message: string;
}

interface VendorAssociationFormProps {
  type: 'vendeur' | 'association';
}

const VendorAssociationForm = ({ type }: VendorAssociationFormProps) => {
  const [formData, setFormData] = useState<VendorAssociationFormData>({
    prenom: '',
    nom: '',
    mail: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.nom || !formData.mail || !formData.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          message: `${type === 'vendeur' ? 'Demande vendeur' : 'Demande association'}: ${formData.message}`
        }
      });

      if (error) throw error;

      toast.success('Votre message a été envoyé avec succès !');
      setFormData({ prenom: '', nom: '', mail: '', message: '' });
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = type === 'vendeur' ? 'Devenir Vendeur Partenaire' : 'Devenir Association Partenaire';
  const description = type === 'vendeur' 
    ? 'Vous souhaitez apparaître sur notre site en tant que vendeur ? Contactez-nous !'
    : 'Vous souhaitez apparaître sur notre site en tant qu\'association ? Contactez-nous !';

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="border-dashed border rounded-2xl shadow-sm bg-muted/20 overflow-hidden">
          <CollapsibleTrigger asChild>
            <CardHeader className="text-center pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-center gap-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Vous souhaitez apparaître sur notre site ?
                </CardTitle>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Envoyez-nous un message pour rejoindre notre réseau de {type === 'vendeur' ? 'vendeurs' : 'associations'} de confiance
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="prenom" className="text-xs">Prénom *</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      type="text"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Votre prénom"
                      className="h-9"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="nom" className="text-xs">Nom *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="h-9"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mail" className="text-xs">Email *</Label>
                    <Input
                      id="mail"
                      name="mail"
                      type="email"
                      value={formData.mail}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      className="h-9"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="message" className="text-xs">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={`Décrivez votre ${type} et pourquoi vous souhaitez apparaître sur notre site...`}
                    className="min-h-[80px] resize-none"
                    required
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    className="w-full max-w-md h-9 text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default VendorAssociationForm;