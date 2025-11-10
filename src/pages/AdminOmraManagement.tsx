import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trash2, Edit, Search, Filter, Check, ChevronsUpDown } from "lucide-react";
import { useHotelPresets } from "@/hooks/useHotelPresets";
import { useAirlinePresets } from "@/hooks/useAirlinePresets";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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

const MONTHS = [
  'Ramadan', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DEPARTURE_CITIES = [
  'Toutes les villes',
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Bordeaux',
  'Nice',
  'Nantes',
  'Strasbourg',
  'Lille',
  'Rennes',
  'Montpellier',
  'Bruxelles'
];

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
  is_complet: boolean;
  is_recommended: boolean;
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
  
  // Popovers state
  const [openCityPopover, setOpenCityPopover] = useState(false);
  const [openMakkahHotelPopover, setOpenMakkahHotelPopover] = useState(false);
  const [openMedinaHotelPopover, setOpenMedinaHotelPopover] = useState(false);
  const [openAirlinePopover, setOpenAirlinePopover] = useState(false);
  
  // Hotel and airline presets
  const { hotels: makkahHotels } = useHotelPresets('makkah');
  const { hotels: medinaHotels } = useHotelPresets('medina');
  const { airlines: airlinePresets } = useAirlinePresets();

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
        .order("date_start", { ascending: true, nullsFirst: false });

      if (error) throw error;

      setOffers(data || []);
      
      // Extraire les agences uniques
      const uniqueAgencies = [...new Set(data?.map(o => o.agency_name) || [])];
      setAgencies(uniqueAgencies.sort());
      
      // Utiliser la constante MONTHS pour avoir tous les mois disponibles
      setMonths(MONTHS);

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
          departure_city: selectedOffer.departure_city.trim(), // Nettoyer les espaces
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
          is_complet: selectedOffer.is_complet,
          is_recommended: selectedOffer.is_recommended,
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
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Complet</TableHead>
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
                        <TableCell>
                          {offer.date_start && offer.date_end ? (
                            <>
                              Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                            </>
                          ) : (
                            <span className="text-muted-foreground">Non défini</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={offer.status === "active" ? "default" : "secondary"}>
                            {offer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={offer.is_complet ? "destructive" : "outline"}
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from("omra_offers")
                                  .update({ is_complet: !offer.is_complet })
                                  .eq("id", offer.id);
                                
                                if (error) throw error;
                                
                                toast({
                                  title: offer.is_complet ? "✅ Offre réouverte" : "✅ Offre marquée complète",
                                  description: offer.is_complet 
                                    ? "L'offre est à nouveau disponible" 
                                    : "L'offre est maintenant marquée comme complète",
                                });
                                
                                loadOffers();
                              } catch (err: any) {
                                toast({
                                  title: "❌ Erreur",
                                  description: "Impossible de modifier le statut",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            {offer.is_complet ? "Complet" : "Disponible"}
                          </Button>
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
              {/* Agence et Lien */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-agency">Agence</Label>
                  <Input
                    id="edit-agency"
                    value={selectedOffer.agency_name}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, agency_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-url">Lien de l'offre</Label>
                  <Input
                    id="edit-url"
                    value={selectedOffer.offer_url}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, offer_url: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date-start">Date de départ</Label>
                  <Input
                    id="edit-date-start"
                    type="date"
                    value={selectedOffer.date_start || ""}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, date_start: e.target.value || null })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date-end">Date de retour</Label>
                  <Input
                    id="edit-date-end"
                    type="date"
                    value={selectedOffer.date_end || ""}
                    onChange={(e) =>
                      setSelectedOffer({ ...selectedOffer, date_end: e.target.value || null })
                    }
                  />
                </div>
              </div>

              {/* Nombre de nuitées et Prix */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-duration">Nombre de nuitées</Label>
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

              {/* Type de séjour */}
              <div>
                <Label htmlFor="edit-formula">Type de séjour</Label>
                <Select
                  value={selectedOffer.formula_type}
                  onValueChange={(value) =>
                    setSelectedOffer({ ...selectedOffer, formula_type: value })
                  }
                >
                  <SelectTrigger id="edit-formula">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essentiel">Essentiel</SelectItem>
                    <SelectItem value="confort">Confort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ville de départ */}
              <div>
                <Label>Ville de départ</Label>
                <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCityPopover}
                      className="w-full justify-between"
                    >
                      {selectedOffer.departure_city || "Sélectionner une ville"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher une ville..." />
                      <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                      <CommandGroup>
                        {DEPARTURE_CITIES.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={() => {
                              setSelectedOffer({ ...selectedOffer, departure_city: city });
                              setOpenCityPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedOffer.departure_city === city ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {city}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Hôtels */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hôtel Makkah</Label>
                  <Popover open={openMakkahHotelPopover} onOpenChange={setOpenMakkahHotelPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMakkahHotelPopover}
                        className="w-full justify-between"
                      >
                        {selectedOffer.hotel_makkah || "Sélectionner un hôtel"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un hôtel..." />
                        <CommandEmpty>Aucun hôtel trouvé.</CommandEmpty>
                        <CommandGroup>
                          {makkahHotels.map((hotel) => (
                            <CommandItem
                              key={hotel.id}
                              value={hotel.hotel_name}
                              onSelect={() => {
                                setSelectedOffer({ ...selectedOffer, hotel_makkah: hotel.hotel_name });
                                setOpenMakkahHotelPopover(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedOffer.hotel_makkah === hotel.hotel_name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {hotel.hotel_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Hôtel Médine</Label>
                  <Popover open={openMedinaHotelPopover} onOpenChange={setOpenMedinaHotelPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMedinaHotelPopover}
                        className="w-full justify-between"
                      >
                        {selectedOffer.hotel_medinah || "Sélectionner un hôtel"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un hôtel..." />
                        <CommandEmpty>Aucun hôtel trouvé.</CommandEmpty>
                        <CommandGroup>
                          {medinaHotels.map((hotel) => (
                            <CommandItem
                              key={hotel.id}
                              value={hotel.hotel_name}
                              onSelect={() => {
                                setSelectedOffer({ ...selectedOffer, hotel_medinah: hotel.hotel_name });
                                setOpenMedinaHotelPopover(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedOffer.hotel_medinah === hotel.hotel_name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {hotel.hotel_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Compagnie aérienne */}
              <div>
                <Label>Compagnie aérienne</Label>
                <Popover open={openAirlinePopover} onOpenChange={setOpenAirlinePopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openAirlinePopover}
                      className="w-full justify-between"
                    >
                      {selectedOffer.airline || "Sélectionner une compagnie"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher une compagnie..." />
                      <CommandEmpty>Aucune compagnie trouvée.</CommandEmpty>
                      <CommandGroup>
                        {airlinePresets.map((airline) => (
                          <CommandItem
                            key={airline.id}
                            value={airline.airline_name}
                            onSelect={() => {
                              setSelectedOffer({ ...selectedOffer, airline: airline.airline_name });
                              setOpenAirlinePopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedOffer.airline === airline.airline_name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {airline.airline_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tag Recommandé */}
              <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg border border-primary/20">
                <Checkbox
                  id="edit-recommended"
                  checked={selectedOffer.is_recommended}
                  onCheckedChange={(checked) =>
                    setSelectedOffer({ ...selectedOffer, is_recommended: checked as boolean })
                  }
                />
                <Label
                  htmlFor="edit-recommended"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  ⭐ Marquer comme offre recommandée
                </Label>
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
