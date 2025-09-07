import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, Eye, User } from 'lucide-react';
import { toast } from 'sonner';

interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  professional_phone?: string;
  phone_country?: string;
  whatsapp_country?: string;
  professional_phone_country?: string;
}

interface ContactModalProps {
  contactInfo: ContactInfo;
  showOptions: {
    show_email: boolean;
    show_phone: boolean;
    show_whatsapp: boolean;
    show_professional_phone: boolean;
  };
  ownerName: string;
  isAuthenticated: boolean;
}

export function ContactModal({ contactInfo, showOptions, ownerName, isAuthenticated }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper functions for phone formatting
  const formatPhoneForCall = (phone: string, countryCode: string) => {
    if (!phone || !countryCode) return '';
    const cleanPhone = phone.startsWith('0') && countryCode === '+33' 
      ? phone.slice(1) 
      : phone;
    return `${countryCode}${cleanPhone}`;
  };

  const formatPhoneForWhatsApp = (phone: string, countryCode: string) => {
    if (!phone || !countryCode) return '';
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const phoneWithoutZero = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
    const cleanCountryCode = countryCode.replace('+', '');
    return `${cleanCountryCode}${phoneWithoutZero}`;
  };

  if (!isAuthenticated) {
    return (
      <Button 
        className="w-full" 
        variant="default"
        onClick={() => {
          toast.info('Connectez-vous pour voir les coordonnées');
          // You can redirect to login page here if needed
          // navigate('/auth');
        }}
      >
        <Eye className="w-4 h-4 mr-2" />
        Se connecter pour voir le contact
      </Button>
    );
  }

  const hasAnyContact = (
    (showOptions.show_email && contactInfo.email) ||
    (showOptions.show_phone && contactInfo.phone) ||
    (showOptions.show_whatsapp && contactInfo.whatsapp) ||
    (showOptions.show_professional_phone && contactInfo.professional_phone)
  );

  if (!hasAnyContact) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Aucun contact partagé
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Eye className="w-4 h-4 mr-2" />
          Voir contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Contact de {ownerName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {showOptions.show_email && contactInfo.email && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      window.open(`mailto:${contactInfo.email}`, '_blank');
                    }}
                  >
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showOptions.show_phone && contactInfo.phone && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPhoneForCall(contactInfo.phone, contactInfo.phone_country || '+33')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const phoneNumber = formatPhoneForCall(contactInfo.phone!, contactInfo.phone_country || '+33');
                      window.location.href = `tel:${phoneNumber}`;
                    }}
                  >
                    Appeler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showOptions.show_whatsapp && contactInfo.whatsapp && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.whatsapp_country || '+33'} {contactInfo.whatsapp}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      const whatsappNumber = formatPhoneForWhatsApp(contactInfo.whatsapp!, contactInfo.whatsapp_country || '+33');
                      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
                    }}
                  >
                    Ouvrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showOptions.show_professional_phone && contactInfo.professional_phone && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Téléphone professionnel</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPhoneForCall(contactInfo.professional_phone, contactInfo.professional_phone_country || '+33')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const phoneNumber = formatPhoneForCall(contactInfo.professional_phone!, contactInfo.professional_phone_country || '+33');
                      window.location.href = `tel:${phoneNumber}`;
                    }}
                  >
                    Appeler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}