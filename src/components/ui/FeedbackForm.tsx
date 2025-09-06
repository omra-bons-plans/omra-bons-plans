import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const FeedbackForm = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
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
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-feedback-email', {
        body: formData
      });

      if (error) {
        console.error('Error sending feedback:', error);
        toast.error("Erreur lors de l'envoi du message");
        return;
      }

      toast.success("Merci pour votre message ! Nous vous répondrons bientôt.");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-primary-foreground">
          Partagez vos idées avec nous
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                name="firstName"
                placeholder="Prénom *"
                value={formData.firstName}
                onChange={handleInputChange}
                className="glass text-foreground border-0 py-3 px-4 rounded-xl"
                required
              />
            </div>
            <div>
              <Input
                name="lastName"
                placeholder="Nom *"
                value={formData.lastName}
                onChange={handleInputChange}
                className="glass text-foreground border-0 py-3 px-4 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Votre email *"
              value={formData.email}
              onChange={handleInputChange}
              className="glass text-foreground border-0 py-3 px-4 rounded-xl"
              required
            />
          </div>

          <div>
            <Textarea
              name="message"
              placeholder="Votre message, idées et conseils *"
              value={formData.message}
              onChange={handleInputChange}
              className="glass text-foreground border-0 py-3 px-4 rounded-xl min-h-[120px] resize-none"
              required
            />
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary hover:bg-secondary-dark text-secondary-foreground py-4 text-lg font-semibold rounded-xl shadow-large"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer mon message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;