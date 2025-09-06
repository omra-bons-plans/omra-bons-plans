import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const ChatWindow = () => {
  const { messages, loading, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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

  return (
    <div className="flex flex-col h-[600px] bg-background/95 backdrop-blur-sm border border-border/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/20 bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Discussions</h3>
            <p className="text-sm text-muted-foreground">
              Discussion publique - {messages.length} message{messages.length !== 1 ? 's' : ''}
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
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.user_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 shadow-soft ${
                      message.user_id === user?.id
                        ? 'bg-gradient-primary text-primary-foreground ml-auto'
                        : 'bg-card text-card-foreground'
                    }`}
                  >
                    {message.user_id !== user?.id && (
                      <p className="text-xs font-medium text-primary mb-1">
                        {message.user_name}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed break-words">
                      {message.message}
                    </p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.user_id === user?.id ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border/20 bg-card p-4">
        {user ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
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

export default ChatWindow;