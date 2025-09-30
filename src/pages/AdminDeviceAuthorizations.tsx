import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSecureAdminCheck } from "@/hooks/useSecureAdminCheck";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, XCircle, Shield, Clock, AlertTriangle } from "lucide-react";
import UserMenu from "@/components/ui/UserMenu";

interface DeviceAuthorization {
  id: string;
  admin_user_id: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string;
  status: "pending" | "approved" | "rejected" | "revoked";
  authorized_by: string | null;
  authorized_at: string | null;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
  admin_email?: string;
  authorizer_email?: string;
}

export default function AdminDeviceAuthorizations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useSecureAdminCheck();
  const [authorizations, setAuthorizations] = useState<DeviceAuthorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Accès refusé");
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchAuthorizations = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_device_authorizations")
        .select(`
          *,
          admin_user:admin_user_id (email),
          authorizer:authorized_by (email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        ...item,
        admin_email: item.admin_user?.email,
        authorizer_email: item.authorizer?.email,
      })) || [];

      setAuthorizations(formattedData);
    } catch (error: any) {
      console.error("Error fetching authorizations:", error);
      toast.error("Erreur lors du chargement des autorisations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAuthorizations();
      const interval = setInterval(fetchAuthorizations, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    setProcessingId(requestId);
    try {
      const { data, error } = await supabase.functions.invoke("authorize-admin-device", {
        body: {
          request_id: requestId,
          action,
          notes: notes[requestId] || null,
          expiry_days: 90,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(
          action === "approve"
            ? "✅ Appareil autorisé avec succès"
            : "❌ Appareil refusé"
        );
        await fetchAuthorizations();
        setNotes({ ...notes, [requestId]: "" });
      } else {
        throw new Error(data?.error || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error("Error processing authorization:", error);
      toast.error(error.message || "Erreur lors du traitement");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "outline" as const, icon: Clock, text: "En attente" },
      approved: { variant: "default" as const, icon: CheckCircle, text: "Approuvé" },
      rejected: { variant: "destructive" as const, icon: XCircle, text: "Refusé" },
      revoked: { variant: "secondary" as const, icon: AlertTriangle, text: "Révoqué" },
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingAuthorizations = authorizations.filter((a) => a.status === "pending");
  const processedAuthorizations = authorizations.filter((a) => a.status !== "pending");

  return (
    <ResponsiveLayout>
      <SEOHead 
        title="Autorisations d'Appareils Admin"
        description="Gérer les demandes d'autorisation d'appareils pour l'accès administrateur"
      />

      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-lg font-semibold">MRA Omra</h1>
            <Badge variant="destructive" className="hidden md:flex">
              <Shield className="w-3 h-3 mr-1" />
              Super Admin
            </Badge>
          </div>
          <UserMenu />
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Autorisations d'Appareils</h2>
            <p className="text-muted-foreground">
              Gérer les demandes d'accès admin depuis de nouveaux appareils
            </p>
          </div>
          {pendingAuthorizations.length > 0 && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              {pendingAuthorizations.length} en attente
            </Badge>
          )}
        </div>

        {pendingAuthorizations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Demandes en attente
            </h3>
            {pendingAuthorizations.map((auth) => (
              <Card key={auth.id} className="border-yellow-500 border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{auth.admin_email}</CardTitle>
                      <CardDescription>
                        Demandé le {new Date(auth.created_at).toLocaleString("fr-FR")}
                      </CardDescription>
                    </div>
                    {getStatusBadge(auth.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">IP</p>
                      <p className="text-muted-foreground">{auth.ip_address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">User Agent</p>
                      <p className="text-muted-foreground truncate" title={auth.user_agent}>
                        {auth.user_agent || "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-semibold">Device Fingerprint</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {auth.device_fingerprint}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Note (optionnelle)</label>
                    <Textarea
                      placeholder="Ajouter une note sur cette autorisation..."
                      value={notes[auth.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [auth.id]: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAction(auth.id, "approve")}
                      disabled={processingId === auth.id}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver (90 jours)
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction(auth.id, "reject")}
                      disabled={processingId === auth.id}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Refuser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {processedAuthorizations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Historique</h3>
            {processedAuthorizations.map((auth) => (
              <Card key={auth.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{auth.admin_email}</CardTitle>
                      <CardDescription>
                        Traité le {auth.authorized_at ? new Date(auth.authorized_at).toLocaleString("fr-FR") : "N/A"}
                        {auth.authorizer_email && ` par ${auth.authorizer_email}`}
                      </CardDescription>
                    </div>
                    {getStatusBadge(auth.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">IP</p>
                      <p className="text-muted-foreground">{auth.ip_address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Expire le</p>
                      <p className="text-muted-foreground">
                        {auth.expires_at ? new Date(auth.expires_at).toLocaleDateString("fr-FR") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Device</p>
                      <p className="text-muted-foreground font-mono text-xs truncate">
                        {auth.device_fingerprint}
                      </p>
                    </div>
                  </div>
                  {auth.notes && (
                    <div className="mt-4">
                      <p className="font-semibold text-sm">Note</p>
                      <p className="text-muted-foreground text-sm">{auth.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {authorizations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Aucune demande d'autorisation</p>
              <p className="text-muted-foreground text-center mt-2">
                Les demandes d'autorisation d'appareils apparaîtront ici
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
}
