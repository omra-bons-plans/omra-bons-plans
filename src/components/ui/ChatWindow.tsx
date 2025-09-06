import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat, ChatMessage } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ChatWindow = () => {
  const { messages, loading, sendMessage } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sending) return;

    setSending(true);
    await sendMessage(messageText);
    setMessageText('');
    setSending(false);
  };

  const getDisplayName = (message: ChatMessage) => {
    return message.user_name || 'Utilisateur anonyme';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Discussion publique
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {user ? 'Vous pouvez participer à la discussion' : 'Connectez-vous pour participer à la discussion'}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun message pour le moment. Soyez le premier à écrire !
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(getDisplayName(message))}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {getDisplayName(message)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </span>
                    </div>
                    <p className="text-sm break-words">{message.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {user ? (
          <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
              disabled={sending}
              maxLength={500}
            />
            <Button type="submit" size="sm" disabled={!messageText.trim() || sending}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <div className="mt-4 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Connectez-vous pour participer à la discussion
            </p>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatWindow;