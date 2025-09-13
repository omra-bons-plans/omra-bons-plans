import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTopicRequests } from '@/hooks/useTopicRequests';

interface RequestTopicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestTopicModal: React.FC<RequestTopicModalProps> = ({ open, onOpenChange }) => {
  const { createTopicRequest } = useTopicRequests();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    justification: ''
  });
  const [loading, setLoading] = useState(false);

  const themeOptions = [
    { value: 'général', label: 'Général', color: '#3B82F6' },
    { value: 'omra', label: 'Omra', color: '#10B981' },
    { value: 'hajj', label: 'Hajj', color: '#059669' },
    { value: 'hébergement', label: 'Hébergement', color: '#F59E0B' },
    { value: 'transport', label: 'Transport', color: '#EF4444' },
    { value: 'pratique', label: 'Questions pratiques', color: '#8B5CF6' },
    { value: 'guides', label: 'Guides', color: '#06B6D4' },
    { value: 'shopping', label: 'Shopping', color: '#EC4899' },
    { value: 'culture', label: 'Culture & Religion', color: '#84CC16' },
    { value: 'communauté', label: 'Communauté', color: '#F97316' },
    { value: 'famille', label: 'Famille & Enfants', color: '#14B8A6' },
    { value: 'santé', label: 'Santé & Bien-être', color: '#F59E0B' },
    { value: 'budget', label: 'Budget & Économies', color: '#10B981' },
    { value: 'témoignages', label: 'Témoignages', color: '#8B5CF6' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.theme) return;

    setLoading(true);
    const success = await createTopicRequest(formData);
    
    if (success) {
      setFormData({
        title: '',
        description: '',
        theme: '',
        justification: ''
      });
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Proposer un nouveau sujet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre du sujet *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Conseils pour première Omra"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez brièvement le sujet de discussion..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="theme">Thème *</Label>
            <Select 
              value={formData.theme} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))} 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un thème" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map(theme => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.color }}
                      />
                      {theme.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="justification">Pourquoi ce sujet ? (optionnel)</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Expliquez pourquoi ce sujet serait utile à la communauté..."
              rows={2}
            />
          </div>

          {formData.theme && (
            <div className="p-3 rounded-lg border border-border/20 bg-card/50">
              <p className="text-sm text-muted-foreground mb-2">Aperçu de votre demande :</p>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: themeOptions.find(t => t.value === formData.theme)?.color || '#3B82F6' 
                  }}
                >
                  <span className="text-white text-sm font-semibold">
                    {formData.title.charAt(0).toUpperCase() || 'T'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{formData.title || 'Titre du sujet'}</p>
                  <p className="text-xs text-muted-foreground">
                    Thème: {themeOptions.find(t => t.value === formData.theme)?.label}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Information :</strong> Votre demande sera examinée par les administrateurs. 
              Vous recevrez une notification une fois qu'elle aura été traitée.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.theme || loading}
              className="flex-1 btn-modern"
            >
              {loading ? 'Envoi...' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestTopicModal;