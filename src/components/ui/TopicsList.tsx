import { useState } from 'react';
import { MessageCircle, Plus, Pin, Trash2, Users, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTopics } from '@/hooks/useTopics';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import CreateTopicModal from './CreateTopicModal';

interface TopicsListProps {
  selectedTopicId?: string;
  onTopicSelect: (topicId: string | null) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({ selectedTopicId, onTopicSelect }) => {
  const { topics, loading, deleteTopic, togglePinTopic } = useTopics();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'Aucun message';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Hier';
    } else if (diffInDays < 7) {
      return `${diffInDays}j`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const themes = ['tous', ...new Set(topics.map(t => t.theme))];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'tous' || topic.theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const handleDeleteTopic = async (topicId: string) => {
    await deleteTopic(topicId);
  };

  const handleTogglePin = async (topicId: string, isPinned: boolean) => {
    await togglePinTopic(topicId, isPinned);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-card-foreground">Discussions</h2>
        {user && (
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="btn-modern"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau sujet
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Theme filters */}
        <div className="flex flex-wrap gap-2">
          {themes.map(theme => (
            <Button
              key={theme}
              variant={selectedTheme === theme ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTheme(theme)}
              className="capitalize"
            >
              {theme}
            </Button>
          ))}
        </div>
      </div>

      {/* General discussion (no topic) */}
      <div
        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
          !selectedTopicId 
            ? 'bg-primary/10 border-primary shadow-md' 
            : 'bg-card hover:bg-card/80 border-border/20'
        }`}
        onClick={() => onTopicSelect(null)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">Discussion générale</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Discussions ouvertes sur tous les sujets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics list */}
      <div className="space-y-2">
        {filteredTopics.map(topic => (
          <div
            key={topic.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${
              selectedTopicId === topic.id 
                ? 'bg-primary/10 border-primary shadow-md' 
                : 'bg-card hover:bg-card/80 border-border/20'
            }`}
            onClick={() => onTopicSelect(topic.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: topic.color }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-card-foreground truncate">
                      {topic.title}
                    </h3>
                    {topic.is_pinned && (
                      <Pin className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  {topic.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {topic.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{topic.message_count} message{topic.message_count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(topic.last_message_at)}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {topic.theme}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions for admin */}
              {isAdmin && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePin(topic.id, topic.is_pinned);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Pin className={`w-4 h-4 ${topic.is_pinned ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le sujet</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce sujet ? Tous les messages associés seront également supprimés. Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun sujet trouvé</p>
          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Create Topic Modal */}
      <CreateTopicModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default TopicsList;