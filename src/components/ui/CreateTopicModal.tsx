import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTopics } from '@/hooks/useTopics';

interface CreateTopicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ open, onOpenChange }) => {
  const { createTopic } = useTopics();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);

  const themeOptions = [
    { value: 'général', label: 'Général', color: '#3B82F6' },
    { value: 'omra', label: 'Omra', color: '#10B981' },
    { value: 'hébergement', label: 'Hébergement', color: '#F59E0B' },
    { value: 'transport', label: 'Transport', color: '#EF4444' },
    { value: 'pratique', label: 'Questions pratiques', color: '#8B5CF6' },
    { value: 'guides', label: 'Guides', color: '#06B6D4' },
    { value: 'shopping', label: 'Shopping', color: '#EC4899' },
    { value: 'culture', label: 'Culture & Religion', color: '#84CC16' },
    { value: 'communauté', label: 'Communauté', color: '#F97316' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.theme) return;

    setLoading(true);
    const success = await createTopic(formData);
    
    if (success) {
      setFormData({
        title: '',
        description: '',
        theme: '',
        color: '#3B82F6'
      });
      onOpenChange(false);
    }
    setLoading(false);
  };

  const handleThemeChange = (theme: string) => {
    const selectedTheme = themeOptions.find(t => t.value === theme);
    setFormData(prev => ({
      ...prev,
      theme,
      color: selectedTheme?.color || '#3B82F6'
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau sujet</DialogTitle>
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
            <Select value={formData.theme} onValueChange={handleThemeChange} required>
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

          {formData.theme && (
            <div className="p-3 rounded-lg border border-border/20 bg-card/50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  <span className="text-white text-sm font-semibold">
                    {formData.title.charAt(0).toUpperCase() || 'T'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{formData.title || 'Titre du sujet'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.description || 'Description du sujet'}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              {loading ? 'Création...' : 'Créer le sujet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicModal;