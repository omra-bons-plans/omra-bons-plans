import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead, seoConfig } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { OrganizationSchema } from '@/components/SEO/OrganizationSchema';
import { Helmet } from "react-helmet-async";
import CanonicalUrl from '@/components/SEO/CanonicalUrl';

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    mail: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.mail || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        console.error('Error sending contact email:', error);
        throw error;
      }
      
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        mail: '',
        message: ''
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Contact - Omra Bons Plans | Contactez-nous</title>
        <meta name="description" content="Contactez l'équipe Omra Bons Plans. Posez vos questions, obtenez de l'aide ou partagez vos suggestions. Support client réactif pour tous vos besoins." />
        <meta name="keywords" content="contact omra bons plans, support client, aide pèlerinage, questions omra hajj" />
        <link rel="canonical" href="https://omrabonsplans.fr/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact - Omra Bons Plans | Contactez-nous" />
        <meta property="og:description" content="Contactez l'équipe Omra Bons Plans. Posez vos questions, obtenez de l'aide ou partagez vos suggestions." />
        <meta property="og:url" content="https://omrabonsplans.fr/contact" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact - Omra Bons Plans | Contactez-nous" />
        <meta name="twitter:description" content="Contactez l'équipe Omra Bons Plans. Posez vos questions, obtenez de l'aide ou partagez vos suggestions." />
        <meta name="twitter:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact - Omra Bons Plans",
            "url": "https://omrabonsplans.fr/contact",
            "description": "Contactez l'équipe Omra Bons Plans pour toute question sur les services Omra et Hajj"
          })}
        </script>
      </Helmet>
      <SEOHead {...seoConfig.contact} />
      <OrganizationSchema />
      <SEOBreadcrumb className="container mx-auto px-6 pt-4" />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Retour
            </Button>
          </div>

          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold text-center mb-4">Contactez-nous</h1>
              <h2 className="text-xl text-muted-foreground text-center mb-2">
                Une question sur votre Omra ou Hajj ? Besoin d'aide pour vos réservations ?
              </h2>
              <p className="text-muted-foreground text-center">
                Vous avez une question ou souhaitez nous faire part de vos commentaires ? 
                N'hésitez pas à nous contacter !
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail">Email *</Label>
                  <Input
                    id="mail"
                    name="mail"
                    type="email"
                    value={formData.mail}
                    onChange={handleInputChange}
                    placeholder="votre.email@exemple.com"
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
                    placeholder="Écrivez votre message ici..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Contact;