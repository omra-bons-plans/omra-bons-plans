import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    <div className="max-w-2xl mx-auto px-4">
      <Card className="border rounded-2xl shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground mb-4">
            {title}
          </CardTitle>
          <p className="text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mail">Email *</Label>
              <Input
                id="mail"
                name="mail"
                type="email"
                value={formData.mail}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={`Décrivez votre ${type} et pourquoi vous souhaitez apparaître sur notre site...`}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAssociationForm;