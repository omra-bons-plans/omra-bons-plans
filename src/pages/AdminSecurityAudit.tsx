import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Eye from 'lucide-react/dist/esm/icons/eye';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import UserMenu from '@/components/ui/UserMenu';

interface RoleAuditLog {
  action_timestamp: string;
  admin_email: string;
  target_email: string;
  old_role: string;
  new_role: string;
  ip_address: string | null;
}

const AdminSecurityAudit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<RoleAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchAuditLogs();
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_recent_role_changes', {
        limit_count: 100
      });

      if (error) throw error;

      setAuditLogs((data as RoleAuditLog[]) || []);
    } catch (error) {
      console.error('Erreur lors du chargement des logs d\'audit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les logs d'audit de sécurité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getRoleChangeColor = (oldRole: string, newRole: string) => {
    if (oldRole === 'user' && newRole === 'admin') return 'destructive'; // Élévation critique
    if (oldRole === 'admin' && newRole === 'user') return 'default'; // Démotion
    return 'secondary';
  };

  if (adminLoading || loading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Chargement des logs de sécurité...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/admin')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Retour Admin
                </Button>
                <span className="text-lg md:text-2xl font-normal text-foreground tracking-tight">
                  Audit de Sécurité
                </span>
                <Badge variant="outline" className="text-xs md:text-sm">
                  <Shield className="w-3 h-3 mr-1" />
                  Sécurisé
                </Badge>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="space-y-6 md:space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Audit des Changements de Rôles
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Journal de sécurité de toutes les modifications de rôles administrateurs
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{auditLogs.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Élévations Admin</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {auditLogs.filter(log => log.old_role === 'user' && log.new_role === 'admin').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Révocations</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {auditLogs.filter(log => log.old_role === 'admin' && log.new_role === 'user').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dernière Action</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">
                    {auditLogs.length > 0 ? formatDate(auditLogs[0].action_timestamp) : 'Aucune'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Journal d'Audit Détaillé</CardTitle>
                <CardDescription>
                  Historique complet des changements de rôles avec traçabilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold text-foreground">Aucun changement</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Aucune modification de rôle n'a été enregistrée
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date/Heure</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead>Utilisateur Modifié</TableHead>
                          <TableHead>Changement</TableHead>
                          <TableHead>Adresse IP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditLogs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">
                              {formatDate(log.action_timestamp)}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{log.admin_email}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{log.target_email}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleChangeColor(log.old_role, log.new_role)}>
                                {log.old_role} → {log.new_role}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {log.ip_address || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminSecurityAudit;