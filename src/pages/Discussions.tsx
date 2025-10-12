import { useState } from 'react';
import { MessageCircle, Hash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopics } from '@/hooks/useTopics';
import TopicsList from '@/components/ui/TopicsList';
import ThreadedChatWindow from '@/components/ui/ThreadedChatWindow';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';

const Discussions = () => {
  const { topics } = useTopics();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [showChat, setShowChat] = useState(false);
  
  const selectedTopic = selectedTopicId ? topics.find(t => t.id === selectedTopicId) : null;

  const handleTopicSelect = (topicId: string | null) => {
    setSelectedTopicId(topicId);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToTopics = () => {
    setShowChat(false);
    setSelectedTopicId(null);
  };

  return (
    <ResponsiveLayout>
      <SEOHead 
        title="Discussions - OmraBonsPlans.fr"
        description="Rejoignez notre communauté de pèlerins. Discutez, partagez vos expériences et posez vos questions sur l'Omra et le Hajj."
        keywords="discussions omra, communauté pèlerins, forum hajj, questions omra, conseils pèlerinage"
        canonical="https://omrabonsplans.fr/discussions"
      />
      <SEOBreadcrumb className="container mx-auto px-6 pt-4" />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-primary text-primary-foreground py-12 px-6">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Forum de Discussion Omra & Hajj</h1>
            </div>
            <h2 className="text-2xl text-primary-foreground mb-3 font-semibold">
              Communauté francophone de pèlerins : conseils, témoignages et entraide pour votre voyage spirituel
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Rejoignez notre communauté de pèlerins. Partagez vos expériences, posez vos questions et échangez des conseils précieux pour votre voyage spirituel.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Mobile View */}
          {isMobile ? (
            <div className="space-y-6">
              {!showChat ? (
                <TopicsList 
                  selectedTopicId={selectedTopicId} 
                  onTopicSelect={handleTopicSelect} 
                />
              ) : (
                <div className="space-y-4">
                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    onClick={handleBackToTopics}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux sujets
                  </Button>
                  
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: selectedTopic?.color || '#3B82F6' }}
                    >
                      {selectedTopicId ? (
                        <Hash className="w-5 h-5 text-white" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-card-foreground">
                        {selectedTopic?.title || 'Discussion générale'}
                      </h2>
                      {selectedTopic?.description && (
                        <p className="text-sm text-muted-foreground">
                          {selectedTopic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Chat Window */}
                  <ThreadedChatWindow
                    topicId={selectedTopicId}
                    topicTitle={selectedTopic?.title}
                    topicColor={selectedTopic?.color}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Desktop View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <TopicsList 
                    selectedTopicId={selectedTopicId} 
                    onTopicSelect={setSelectedTopicId} 
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Desktop Chat Header */}
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/20">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: selectedTopic?.color || '#3B82F6' }}
                    >
                      {selectedTopicId ? (
                        <Hash className="w-6 h-6 text-white" />
                      ) : (
                        <MessageCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-card-foreground">
                        {selectedTopic?.title || 'Discussion générale'}
                      </h2>
                      {selectedTopic?.description && (
                        <p className="text-muted-foreground">
                          {selectedTopic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Desktop Chat Window */}
                  <ThreadedChatWindow
                    topicId={selectedTopicId}
                    topicTitle={selectedTopic?.title}
                    topicColor={selectedTopic?.color}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Guidelines */}
        <div className="bg-card/50 py-12 px-6 mt-12">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold text-center mb-8">Règles de la communauté</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Respect mutuel</h4>
                    <p className="text-sm text-muted-foreground">
                      Traitez tous les membres avec respect et bienveillance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Contenu approprié</h4>
                    <p className="text-sm text-muted-foreground">
                      Partagez du contenu pertinent et constructif.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Pas de spam</h4>
                    <p className="text-sm text-muted-foreground">
                      Évitez les messages répétitifs ou promotionnels excessifs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Entraide</h4>
                    <p className="text-sm text-muted-foreground">
                      Aidez-vous mutuellement et partagez vos connaissances.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="container mx-auto px-6 mt-8 mb-8">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Ressources utiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/category/sejours" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">Séjours Omra</h3>
                  <p className="text-sm text-muted-foreground">Découvrez nos packages complets pour l'Omra</p>
                </a>
                <a href="/agences-liste" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">Agences Omra</h3>
                  <p className="text-sm text-muted-foreground">Comparez les meilleures agences de voyage Omra</p>
                </a>
                <a href="/blog" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">Blog</h3>
                  <p className="text-sm text-muted-foreground">Conseils et guides pour votre pèlerinage</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Discussions;