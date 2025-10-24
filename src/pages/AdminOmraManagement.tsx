import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trash2, Edit, Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface OmraOffer {
  id: string;
  agency_name: string;
  agency_url: string;
  price_eur: number;
  month_departure: string;
  date_start: string | null;
  date_end: string | null;
  departure_city: string;
  formula_type: string;
  duration_nights: number | null;
  makkah_nights: number | null;
  medina_nights: number | null;
  hotel_makkah: string | null;
  hotel_medinah: string | null;
  distance_to_haram_m: number | null;
  offer_url: string;
  offer_title: string;
  visa_included: boolean;
  flights_included: boolean;
  airline: string | null;
  status: string;
  scraped_at: string;
}

export default function AdminOmraManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<OmraOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<OmraOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OmraOffer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Données pour les filtres
  const [agencies, setAgencies] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [offers, searchTerm, selectedAgency, selectedMonth, minPrice, maxPrice]);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("omra_offers")
        .select("*")
        .order("scraped_at", { ascending: false });

      if (error) throw error;

      setOffers(data || []);
      
      // Extraire les agences et mois uniques
      const uniqueAgencies = [...new Set(data?.map(o => o.agency_name) || [])];
      const uniqueMonths = [...new Set(data?.map(o => o.month_departure) || [])];
      setAgencies(uniqueAgencies.sort());
      setMonths(uniqueMonths.sort());

    } catch (err: any) {
      console.error("Erreur de chargement:", err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les offres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...offers];

    // Filtre par recherche (titre, ville, hôtel)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.offer_title.toLowerCase().includes(term) ||
          o.departure_city.toLowerCase().includes(term) ||
          o.hotel_makkah?.toLowerCase().includes(term) ||
          o.hotel_medinah?.toLowerCase().includes(term)
      );
    }

    // Filtre par agence
    if (selectedAgency !== "all") {
      filtered = filtered.filter((o) => o.agency_name === selectedAgency);
    }

    // Filtre par mois
    if (selectedMonth !== "all") {
      filtered = filtered.filter((o) => o.month_departure === selectedMonth);
    }

    // Filtre par prix
    if (minPrice) {
      filtered = filtered.filter((o) => o.price_eur >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((o) => o.price_eur <= parseFloat(maxPrice));
    }

    setFilteredOffers(filtered);
  };

  const handleDelete = async () => {
    if (!selectedOffer) return;

    try {
      const { error } = await supabase
        .from("omra_offers")
        .delete()
        .eq("id", selectedOffer.id);

      if (error) throw error;

      toast({
        title: "✅ Suppression réussie",
        description: "L'offre a été supprimée",
      });

      setIsDeleteDialogOpen(false);
      setSelectedOffer(null);
      loadOffers();
    } catch (err: any) {
      console.error("Erreur de suppression:", err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer l'offre",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedOffer) return;

    try {
      const { error } = await supabase
        .from("omra_offers")
        .update({
          agency_name: selectedOffer.agency_name,
          price_eur: selectedOffer.price_eur,
          month_departure: selectedOffer.month_departure,
          date_start: selectedOffer.date_start,
          date_end: selectedOffer.date_end,
          departure_city: selectedOffer.departure_city,
          formula_type: selectedOffer.formula_type,
          duration_nights: selectedOffer.duration_nights,
          makkah_nights: selectedOffer.makkah_nights,
          medina_nights: selectedOffer.medina_nights,
          hotel_makkah: selectedOffer.hotel_makkah,
          hotel_medinah: selectedOffer.hotel_medinah,
          distance_to_haram_m: selectedOffer.distance_to_haram_m,
          offer_title: selectedOffer.offer_title,
          visa_included: selectedOffer.visa_included,
          flights_included: selectedOffer.flights_included,
          airline: selectedOffer.airline,
          status: selectedOffer.status,
        })
        .eq("id", selectedOffer.id);

      if (error) throw error;

      toast({
        title: "✅ Modification réussie",
        description: "L'offre a été mise à jour",
      });

      setIsEditDialogOpen(false);
      setSelectedOffer(null);
      loadOffers();
    } catch (err: any) {
      console.error("Erreur de modification:", err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier l'offre",
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAgency("all");
    setSelectedMonth("all");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour Admin
          </Button>
          <h1 className="text-3xl font-bold">Gestion des Offres Omra</h1>
        </div>

        {/* Filtres */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="text-xl font-bold">Filtres</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="ml-auto"
            >
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Titre, ville, hôtel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Agence */}
            <div>
              <Label htmlFor="agency">Agence</Label>
              <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                <SelectTrigger id="agency">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les agences</SelectItem>
                  {agencies.map((agency) => (
                    <SelectItem key={agency} value={agency}>
                      {agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mois */}
            <div>
              <Label htmlFor="month">Mois de départ</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prix */}
            <div>
              <Label>Prix (€)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredOffers.length} offre(s) trouvée(s) sur {offers.length} au total
          </div>
        </Card>

        {/* Tableau des offres */}
        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Chargement...</p>
            </div>
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
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Aucune offre trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOffers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.agency_name}</TableCell>
                        <TableCell className="max-w-xs truncate" title={offer.offer_title}>
                          {offer.offer_title}
                        </TableCell>
                        <TableCell>{offer.price_eur}€</TableCell>
                        <TableCell className="capitalize">{offer.month_departure}</TableCell>
                        <TableCell>{offer.departure_city}</TableCell>
                        <TableCell className="capitalize">{offer.formula_type}</TableCell>
                        <TableCell>{offer.duration_nights}n</TableCell>
                        <TableCell>
                          <Badge variant={offer.status === "active" ? "default" : "secondary"}>
                            {offer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOffer(offer);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedOffer(offer);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'offre</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Titre</Label>
                  <Input
                    id="edit-title"
                    value={selectedOffer.offer_title}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, offer_title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Prix (€)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedOffer.price_eur}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, price_eur: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-month">Mois de départ</Label>
                  <Input
                    id="edit-month"
                    value={selectedOffer.month_departure}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, month_departure: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">Ville de départ</Label>
                  <Input
                    id="edit-city"
                    value={selectedOffer.departure_city}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, departure_city: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-duration">Durée (nuits)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={selectedOffer.duration_nights || ""}
                    onChange={(e) =>
                      setSelectedOffer({
                        ...selectedOffer,
                        duration_nights: parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-makkah">Nuits Makkah</Label>
                  <Input
                    id="edit-makkah"
                    type="number"
                    value={selectedOffer.makkah_nights || ""}
                    onChange={(e) =>
                      setSelectedOffer({
                        ...selectedOffer,
                        makkah_nights: parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-medina">Nuits Médine</Label>
                  <Input
                    id="edit-medina"
                    type="number"
                    value={selectedOffer.medina_nights || ""}
                    onChange={(e) =>
                      setSelectedOffer({
                        ...selectedOffer,
                        medina_nights: parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-hotel-makkah">Hôtel Makkah</Label>
                  <Input
                    id="edit-hotel-makkah"
                    value={selectedOffer.hotel_makkah || ""}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, hotel_makkah: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-hotel-medina">Hôtel Médine</Label>
                  <Input
                    id="edit-hotel-medina"
                    value={selectedOffer.hotel_medinah || ""}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, hotel_medinah: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-formula">Formule</Label>
                  <Select
                    value={selectedOffer.formula_type}
                    onValueChange={(value) =>
                      setSelectedOffer({ ...selectedOffer, formula_type: value })
                    }
                  >
                    <SelectTrigger id="edit-formula">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confort">Confort</SelectItem>
                      <SelectItem value="essentiel">Essentiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-airline">Compagnie aérienne</Label>
                  <Input
                    id="edit-airline"
                    value={selectedOffer.airline || ""}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, airline: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-visa"
                    checked={selectedOffer.visa_included}
                    onCheckedChange={(checked) =>
                      setSelectedOffer({ ...selectedOffer, visa_included: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-visa">Visa inclus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-flights"
                    checked={selectedOffer.flights_included}
                    onCheckedChange={(checked) =>
                      setSelectedOffer({ ...selectedOffer, flights_included: checked as boolean })
                    }
                  />
                  <Label htmlFor="edit-flights">Vols inclus</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
          </p>
          {selectedOffer && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedOffer.offer_title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedOffer.agency_name} - {selectedOffer.price_eur}€
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
