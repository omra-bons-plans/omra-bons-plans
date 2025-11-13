import React from "react";
import { MessageCircle, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TopicsList from "@/components/ui/TopicsList";
import ThreadedChatWindow from "@/components/ui/ThreadedChatWindow";

interface ForumSectionProps {
  topics: any[];
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string | null) => void;
}

export const ForumSection = ({ topics, selectedTopicId, onTopicSelect }: ForumSectionProps) => {
  const selectedTopic = selectedTopicId ? topics.find(t => t.id === selectedTopicId) : null;

  if (topics.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" />
        <Badge variant="outline" className="text-lg px-4 py-2">
          Forum communautaire
        </Badge>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-sm">
        {!selectedTopicId ? (
          <TopicsList 
            selectedTopicId={selectedTopicId}
            onTopicSelect={onTopicSelect}
          />
        ) : (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTopicSelect(null)}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour aux discussions
            </Button>
            <ThreadedChatWindow
              topicId={selectedTopicId}
              topicTitle={selectedTopic?.title || ''}
            />
          </div>
        )}
      </div>
    </section>
  );
};
