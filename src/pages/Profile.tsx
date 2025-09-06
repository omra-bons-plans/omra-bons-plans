import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MobileLayout from '@/components/mobile/MobileLayout';
import CountrySelect from '@/components/ui/CountrySelect';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

interface Profile {
  id: string;
  first_name: string | null;
  kuniya: string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  phone_country: string | null;
  whatsapp: string | null;
  whatsapp_country: string | null;
  facebook: string | null;
  instagram: string | null;
  is_professional: boolean;
  company_name: string | null;
  company_address: string | null;
  website: string | null;
  professional_phone: string | null;
  professional_phone_country: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    first_name: '',
    kuniya: '',
    gender: '',
    email: '',
    phone: '',
    phone_country: '+33',
    whatsapp: '',
    whatsapp_country: '+33',
    facebook: '',
    instagram: '',
    is_professional: false,
    company_name: '',
    company_address: '',
    website: '',
    professional_phone: '',
    professional_phone_country: '+33',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('Erreur lors du chargement du profil');
        return;
      }

      if (data) {
        setProfile({
          ...data,
          phone_country: (data as any).phone_country || '+33',
          whatsapp_country: (data as any).whatsapp_country || '+33',
          professional_phone_country: (data as any).professional_phone_country || '+33'
        });
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email,
          first_name: '',
          kuniya: '',
          gender: null,
          phone: '',
          phone_country: '+33',
          whatsapp: '',
          whatsapp_country: '+33',
          facebook: '',
          instagram: '',
          is_professional: false,
          company_name: '',
          company_address: '',
          website: '',
          professional_phone: '',
          professional_phone_country: '+33',
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast.error('Erreur lors de la création du profil');
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          id: user.id,
        });

      if (error) {
        console.error('Error saving profile:', error);
        toast.error('Erreur lors de la sauvegarde');
      } else {
        toast.success('Profil sauvegardé avec succès');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Desktop Header - Hidden on mobile */}
        <header className="hidden lg:block glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Accueil
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">Profile</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground mb-4"
              >
                ← Retour
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Profile</CardTitle>
              </CardHeader>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Entrer votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kuniya">Kuniya</Label>
                  <Input
                    id="kuniya"
                    value={profile.kuniya || ''}
                    onChange={(e) => handleInputChange('kuniya', e.target.value)}
                    placeholder="Entrer votre kuniya"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Sexe</Label>
                <Select 
                  value={profile.gender || ''} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="exemple@gmail.com"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <div className="flex space-x-2">
                    <CountrySelect
                      value={profile.phone_country || '+33'}
                      onValueChange={(value) => handleInputChange('phone_country', value)}
                    />
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="555 55 55 55"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                  <div className="flex space-x-2">
                    <CountrySelect
                      value={profile.whatsapp_country || '+33'}
                      onValueChange={(value) => handleInputChange('whatsapp_country', value)}
                    />
                    <Input
                      id="whatsapp"
                      value={profile.whatsapp || ''}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="555 55 55 55"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="Lien facebook"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="Lien instagram"
                  />
                </div>
              </div>

              {/* Professional Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <Switch
                  checked={profile.is_professional}
                  onCheckedChange={(checked) => handleInputChange('is_professional', checked)}
                />
                <div>
                  <Label className="text-base font-medium">Passez à un compte professionnel</Label>
                  <p className="text-sm text-muted-foreground">
                    Vous êtes un professionnel ? Configurez votre entreprise
                  </p>
                </div>
              </div>

              {/* Professional Information */}
              {profile.is_professional && (
                <div className="space-y-6 p-6 bg-muted/20 rounded-lg">
                  <h3 className="text-lg font-semibold">Informations professionnelles</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nom de la société</Label>
                    <Input
                      id="company_name"
                      value={profile.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      placeholder="Entrer le nom de la société"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_address">Adresse</Label>
                    <AddressAutocomplete
                      value={profile.company_address || ''}
                      onChange={(value) => handleInputChange('company_address', value)}
                      placeholder="Entrer l'adresse de la société"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Site web</Label>
                      <Input
                        id="website"
                        value={profile.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://www.exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="professional_phone">Numéro de téléphone</Label>
                      <div className="flex space-x-2">
                        <CountrySelect
                          value={profile.professional_phone_country || '+33'}
                          onValueChange={(value) => handleInputChange('professional_phone_country', value)}
                        />
                        <Input
                          id="professional_phone"
                          value={profile.professional_phone || ''}
                          onChange={(e) => handleInputChange('professional_phone', e.target.value)}
                          placeholder="555 55 55 55"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Profile;