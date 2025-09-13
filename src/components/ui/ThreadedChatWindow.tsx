import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Trash2, Reply, AtSign, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useThreadedChat } from '@/hooks/useThreadedChat';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { useAdmin } from '@/contexts/AdminContext';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface ThreadedChatWindowProps {
  topicId?: string;
  topicTitle?: string;
  topicColor?: string;
}

const ThreadedChatWindow: React.FC<ThreadedChatWindowProps> = ({ 
  topicId, 
  topicTitle = "Discussion générale",
  topicColor = "#3B82F6"
}) => {
  const { messages, loading, sendMessage, deleteMessage } = useThreadedChat(topicId);
  const { user } = useAuth();
  const { isComplete: profileComplete } = useProfileCompletion();
  const { isAdmin } = useAdmin();
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [mentionFilter, setMentionFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Extract mentions from message (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions = Array.from(newMessage.matchAll(mentionRegex))
      .map(match => match[1])
      .filter((mention, index, arr) => arr.indexOf(mention) === index);

    const success = await sendMessage(newMessage, replyingTo || undefined, mentions);
    
    if (success) {
      setNewMessage('');
      setReplyingTo(null);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUserDisplayInfo = (message: any) => {
    const parts = [];
    
    if (message.kuniya) {
      parts.push(message.kuniya);
    }
    
    if (message.user_name && message.user_name !== message.kuniya) {
      parts.push(message.user_name);
    }
    
    if (message.is_professional && message.company_name) {
      parts.push(`(${message.company_name})`);
    }
    
    return parts.join(' - ') || 'Utilisateur';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long' 
      });
    }
  };

  const renderMessage = (message: any, isReply = false) => (
    <div
      key={message.id}
      className={`flex gap-3 ${
        message.user_id === user?.id ? 'justify-end' : 'justify-start'
      } ${isReply ? 'ml-8 mt-2' : ''}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 shadow-soft relative group ${
          message.user_id === user?.id
            ? 'bg-gradient-primary text-primary-foreground ml-auto'
            : 'bg-card text-card-foreground'
        }`}
      >
        {message.user_id !== user?.id && user && (
          <p className="text-xs font-medium text-primary mb-1">
            {getUserDisplayInfo(message)}
          </p>
        )}
        
        <div className="text-sm leading-relaxed break-words">
          {/* Highlight mentions */}
          {message.message.split(/(@\w+)/g).map((part: string, index: number) => {
            if (part.startsWith('@')) {
              return (
                <Badge key={index} variant="secondary" className="text-xs mx-1">
                  {part}
                </Badge>
              );
            }
            return part;
          })}
        </div>

        {/* Show mentions */}
        {message.mentions && message.mentions.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <AtSign className="w-3 h-3 opacity-60" />
            <div className="flex flex-wrap gap-1">
              {message.mentions.map((mention: string) => (
                <Badge key={mention} variant="outline" className="text-xs">
                  @{mention}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className={`flex items-center justify-between mt-2 ${
          message.user_id === user?.id ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <div className="flex items-center gap-2">
            <p className="text-xs opacity-70">
              {formatTime(message.created_at)}
            </p>
            
            {/* Reply button */}
            {user && profileComplete && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(message.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
              >
                <Reply className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Delete button for admin */}
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le message</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMessage(message.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();
  const totalMessages = messages.reduce((total, msg) => 
    total + 1 + (msg.replies?.length || 0), 0
  );

  return (
    <div className="flex flex-col h-[600px] bg-background/95 backdrop-blur-sm border border-border/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/20 bg-card">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: topicColor }}
          >
            {topicId ? (
              <Hash className="w-5 h-5 text-white" />
            ) : (
              <MessageCircle className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{topicTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {totalMessages} message{totalMessages !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-subtle">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50" />
            <div>
              <p className="text-muted-foreground font-medium">Aucun message pour le moment</p>
              <p className="text-sm text-muted-foreground/80">
                Soyez le premier à démarrer la conversation !
              </p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date} className="space-y-3">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                  {formatDate(dayMessages[0].created_at)}
                </div>
              </div>
              
              {/* Messages for this date */}
              {dayMessages.map((message) => (
                <div key={message.id}>
                  {renderMessage(message)}
                  {/* Replies */}
                  {message.replies && message.replies.map((reply) => 
                    renderMessage(reply, true)
                  )}
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Reply className="w-4 h-4" />
            <span>Réponse en cours...</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(null)}
            className="h-6 px-2 text-xs"
          >
            Annuler
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-border/20 bg-card p-4">
        {user ? (
          profileComplete ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={replyingTo ? "Tapez votre réponse... (utilisez @nom pour mentionner)" : "Tapez votre message... (utilisez @nom pour mentionner)"}
                className="flex-1 border-border/30 focus-visible:ring-primary/50"
                maxLength={500}
              />
              <Button 
                type="submit" 
                size="icon"
                className="btn-modern text-primary-foreground"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Complétez votre profil pour participer à la discussion
              </p>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="w-full">
                  Compléter mon profil
                </Button>
              </Link>
            </div>
          )
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Connectez-vous pour participer à la discussion
            </p>
            <Link to="/auth">
              <Button variant="outline" size="sm" className="w-full">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadedChatWindow;