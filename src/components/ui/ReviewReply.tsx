import { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Send, X } from 'lucide-react';
import { Button } from './button';
import { Textarea } from './textarea';
import { Card, CardContent } from './card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
import { ReviewReply as ReviewReplyType } from '@/hooks/useReviews';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewReplyProps {
  reply?: ReviewReplyType;
  canReply: boolean;
  onSubmitReply: (replyText: string) => Promise<boolean>;
  onUpdateReply?: (replyId: string, replyText: string) => Promise<boolean>;
  onDeleteReply?: (replyId: string) => Promise<boolean>;
  isOwner: boolean;
}

export const ReviewReply = ({ 
  reply, 
  canReply, 
  onSubmitReply, 
  onUpdateReply, 
  onDeleteReply,
  isOwner 
}: ReviewReplyProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState(reply?.reply_text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      let success = false;
      
      if (isEditing && reply && onUpdateReply) {
        success = await onUpdateReply(reply.id, replyText);
      } else {
        success = await onSubmitReply(replyText);
      }
      
      if (success) {
        setReplyText('');
        setShowReplyForm(false);
        setIsEditing(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReplyText(reply?.reply_text || '');
    setShowReplyForm(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setReplyText(reply?.reply_text || '');
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!reply || !onDeleteReply) return;
    await onDeleteReply(reply.id);
  };

  return (
    <div className="mt-4">
      {/* Existing Reply */}
      {reply && (
        <Card className="ml-8 bg-muted/30 border-l-4 border-l-primary">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {reply.owner_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {formatDistanceToNow(new Date(reply.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </span>
              </div>
              
              {isOwner && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la réponse</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer votre réponse ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
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
            
            {!isEditing ? (
              <p className="text-sm text-foreground">
                {reply.reply_text}
              </p>
            ) : (
              <div className="space-y-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Modifiez votre réponse..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!replyText.trim() || isSubmitting}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    {isSubmitting ? 'Modification...' : 'Modifier'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reply Form */}
      {!reply && canReply && (
        <div className="ml-8">
          {!showReplyForm ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(true)}
              className="text-primary hover:text-primary"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Répondre
            </Button>
          ) : (
            <Card className="bg-muted/30 border-l-4 border-l-primary">
              <CardContent className="p-3">
                <div className="space-y-3">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!replyText.trim() || isSubmitting}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {isSubmitting ? 'Envoi...' : 'Répondre'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
