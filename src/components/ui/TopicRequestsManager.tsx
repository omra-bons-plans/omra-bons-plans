import { useState } from 'react';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Clock from 'lucide-react/dist/esm/icons/clock';
import User from 'lucide-react/dist/esm/icons/user';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Eye from 'lucide-react/dist/esm/icons/eye';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTopicRequests } from '@/hooks/useTopicRequests';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TopicRequest {
  id: string;
  title: string;
  description: string;
  theme: string;
  justification: string;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

const TopicRequestsManager = () => {
  const { requests, loading, approveTopicRequest, rejectTopicRequest } = useTopicRequests();
  const [selectedRequest, setSelectedRequest] = useState<TopicRequest | null>(null);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return null;
    }
  };

  const handleApprove = async (request: TopicRequest) => {
    const success = await approveTopicRequest(request.id, request);
    if (success) {
      setSelectedRequest(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const success = await rejectTopicRequest(requestId);
    if (success) {
      setSelectedRequest(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Demandes en attente ({pendingRequests.length})
          </h3>
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{request.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{request.theme}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {request.description && (
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  )}
                  {request.justification && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm"><strong>Justification :</strong> {request.justification}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            <X className="w-4 h-4 mr-2" />
                            Rejeter
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Rejeter la demande</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir rejeter cette demande de sujet ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Rejeter
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="w-4 h-4 mr-2" />
                            Approuver
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approuver et créer le sujet</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir approuver cette demande ? Un nouveau sujet sera créé automatiquement dans les discussions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleApprove(request)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approuver et créer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Demandes traitées ({processedRequests.length})
          </h3>
          <div className="grid gap-3">
            {processedRequests.map((request) => (
              <Card key={request.id} className={`border-l-4 ${
                request.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{request.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{request.theme}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No requests */}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-semibold mb-2">Aucune demande de sujet</h3>
          <p className="text-muted-foreground">Les demandes de nouveaux sujets apparaîtront ici.</p>
        </div>
      )}

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de la demande</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Titre</h4>
                <p>{selectedRequest.title}</p>
              </div>
              {selectedRequest.description && (
                <div>
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold">Thème</h4>
                <Badge variant="outline">{selectedRequest.theme}</Badge>
              </div>
              {selectedRequest.justification && (
                <div>
                  <h4 className="font-semibold">Justification</h4>
                  <p className="text-sm text-muted-foreground">{selectedRequest.justification}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold">Statut</h4>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div>
                <h4 className="font-semibold">Date de demande</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedRequest.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TopicRequestsManager;