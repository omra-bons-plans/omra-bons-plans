import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Upload, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminOmra = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch offers
  const { data: offers, isLoading } = useQuery({
    queryKey: ['admin-omra-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omra_offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch scraper logs
  const { data: logs } = useQuery({
    queryKey: ['scraper-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omra_scraper_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Manual refresh mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('omra-scraper');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Scraping lancé",
        description: "Le scraping des offres a été lancé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-omra-offers'] });
      queryClient.invalidateQueries({ queryKey: ['scraper-logs'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // CSV export
  const handleExportCSV = () => {
    if (!offers) return;

    const headers = [
      'ID', 'Agence', 'Titre', 'Prix EUR', 'Mois', 'Ville départ', 
      'Formule', 'Nuits', 'Vol inclus', 'Visa inclus', 'Status'
    ];

    const rows = offers.map(offer => [
      offer.id,
      offer.agency_name,
      offer.offer_title,
      offer.price_eur,
      offer.month_departure,
      offer.departure_city,
      offer.formula_type,
      offer.duration_nights,
      offer.flights_included ? 'Oui' : 'Non',
      offer.visa_included ? 'Oui' : 'Non',
      offer.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `omra-offers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const filteredOffers = offers?.filter(offer =>
    offer.offer_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.agency_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Admin - Comparateur Omra | Omra Bons Plans</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Administration - Comparateur Omra</h1>
          
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              Rafraîchir maintenant
            </Button>
            
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>

            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importer CSV
            </Button>
          </div>
        </div>

        {/* Recent Scraper Logs */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Derniers scraping</h2>
          <div className="space-y-2">
            {logs?.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <p className="font-medium">{log.agency_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(log.started_at), 'PPpp')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                    {log.status}
                  </Badge>
                  <div className="text-sm text-right">
                    <p>Ajoutées: {log.offers_added}</p>
                    <p>Erreurs: {log.offers_errors}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Offers Table */}
        <Card className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre ou agence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agence</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Mois</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Formule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scraping</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers?.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.agency_name}</TableCell>
                      <TableCell className="max-w-xs truncate">{offer.offer_title}</TableCell>
                      <TableCell>{offer.price_eur}€</TableCell>
                      <TableCell>{offer.month_departure}</TableCell>
                      <TableCell>{offer.departure_city}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{offer.formula_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={offer.status === 'active' ? 'default' : 'outline'}>
                          {offer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(offer.scraped_at), 'dd/MM/yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminOmra;