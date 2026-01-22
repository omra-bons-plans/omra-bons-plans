import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trash2, Edit, Search, Filter, Plus, Check, ChevronsUpDown } from "lucide-react";
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

const DEPARTURE_CITIES = [
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
  'Bruxelles',
  'Genève'
];

const PACKAGE_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'shifting', label: 'Shifting' },
  { value: 'luxury', label: 'Luxury' }
];

const ACCOMMODATION_ZONES = [
  { value: 'A', label: 'Zone A - Proche Haram' },
  { value: 'M', label: 'Zone M - Moyenne distance' },
  { value: 'C', label: 'Zone C - Éloignée' }
];

const CAMP_MINA_OPTIONS = [
  { value: 'Mouassim', label: 'Mouassim' },
  { value: 'Majar Al Kabsh', label: 'Majar Al Kabsh' }
];

interface HajjOffer {
  id: string;
  agency_name: string;
  agency_url: string;
  price_quad_eur: number;
  departure_date: string;
  return_date: string;
  departure_cities: string[];
  package_type: string;
  accommodation_zone: string;
  camp_mina: string | null;
  duration_nights: number | null;
  hotel_makkah: string;
  hotel_makkah_stars: number | null;
  hotel_medina: string;
  hotel_medina_stars: number | null;
  airline: string;
  half_board: boolean;
  offer_url: string;
  nusuk_code: string | null;
  status: string;
  is_recommended: boolean;
}

export default function AdminHajjManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<HajjOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<HajjOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<HajjOffer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Popovers state
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
  const [selectedPackageType, setSelectedPackageType] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Données pour les filtres
  const [agencies, setAgencies] = useState<string[]>([]);

  // Nouvelle offre
  const [newOffer, setNewOffer] = useState<Partial<HajjOffer>>({
    agency_name: '',
    agency_url: '',
    price_quad_eur: 0,
    departure_date: '',
    return_date: '',
    departure_cities: [],
    package_type: 'standard',
    accommodation_zone: 'A',
    camp_mina: null,
    hotel_makkah: '',
    hotel_makkah_stars: 4,
    hotel_medina: '',
    hotel_medina_stars: 4,
    airline: '',
    half_board: false,
    offer_url: '',
    nusuk_code: null,
    status: 'active',
    is_recommended: false
  });

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [offers, searchTerm, selectedAgency, selectedPackageType, minPrice, maxPrice]);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("hajj_offers")
        .select("*")
        .order("departure_date", { ascending: true });

      if (error) throw error;

      setOffers(data || []);
      
      // Extraire les agences uniques
      const uniqueAgencies = [...new Set(data?.map(o => o.agency_name) || [])];
      setAgencies(uniqueAgencies.sort());

    } catch (err: any) {
      console.error("Erreur de chargement:", err);
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les offres Hajj",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...offers];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.agency_name.toLowerCase().includes(term) ||
          o.hotel_makkah?.toLowerCase().includes(term) ||
          o.hotel_medina?.toLowerCase().includes(term) ||
          o.departure_cities?.some(city => city.toLowerCase().includes(term))
      );
    }

    // Filtre par agence
    if (selectedAgency !== "all") {
      filtered = filtered.filter((o) => o.agency_name === selectedAgency);
    }

    // Filtre par type de package
    if (selectedPackageType !== "all") {
      filtered = filtered.filter((o) => o.package_type === selectedPackageType);
    }

    // Filtre par prix
    if (minPrice) {
      filtered = filtered.filter((o) => o.price_quad_eur >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((o) => o.price_quad_eur <= parseFloat(maxPrice));
    }

    setFilteredOffers(filtered);
  };

  const handleDelete = async () => {
    if (!selectedOffer) return;

    try {
      const { error } = await supabase
        .from("hajj_offers")
        .delete()
        .eq("id", selectedOffer.id);

      if (error) throw error;

      toast({
        title: "✅ Suppression réussie",
        description: "L'offre Hajj a été supprimée",
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
      // Calculer la durée automatiquement
      let duration = selectedOffer.duration_nights;
      if (selectedOffer.departure_date && selectedOffer.return_date) {
        const start = new Date(selectedOffer.departure_date);
        const end = new Date(selectedOffer.return_date);
        duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }

      const { error } = await supabase
        .from("hajj_offers")
        .update({
          agency_name: selectedOffer.agency_name,
          agency_url: selectedOffer.agency_url,
          price_quad_eur: selectedOffer.price_quad_eur,
          departure_date: selectedOffer.departure_date,
          return_date: selectedOffer.return_date,
          departure_cities: selectedOffer.departure_cities,
          package_type: selectedOffer.package_type,
          accommodation_zone: selectedOffer.accommodation_zone,
          camp_mina: selectedOffer.camp_mina,
          duration_nights: duration,
          hotel_makkah: selectedOffer.hotel_makkah,
          hotel_makkah_stars: selectedOffer.hotel_makkah_stars,
          hotel_medina: selectedOffer.hotel_medina,
          hotel_medina_stars: selectedOffer.hotel_medina_stars,
          airline: selectedOffer.airline,
          half_board: selectedOffer.half_board,
          offer_url: selectedOffer.offer_url,
          nusuk_code: selectedOffer.nusuk_code,
          status: selectedOffer.status,
          is_recommended: selectedOffer.is_recommended,
        })
        .eq("id", selectedOffer.id);

      if (error) throw error;

      toast({
        title: "✅ Modification réussie",
        description: "L'offre Hajj a été mise à jour",
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

  const handleAdd = async () => {
    try {
      // Calculer la durée automatiquement
      let duration = null;
      if (newOffer.departure_date && newOffer.return_date) {
        const start = new Date(newOffer.departure_date);
        const end = new Date(newOffer.return_date);
        duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }

      const { error } = await supabase
        .from("hajj_offers")
        .insert({
          agency_name: newOffer.agency_name,
          agency_url: newOffer.agency_url,
          price_quad_eur: newOffer.price_quad_eur,
          departure_date: newOffer.departure_date,
          return_date: newOffer.return_date,
          departure_cities: newOffer.departure_cities || [],
          package_type: newOffer.package_type || 'standard',
          accommodation_zone: newOffer.accommodation_zone || 'A',
          camp_mina: newOffer.camp_mina,
          duration_nights: duration,
          hotel_makkah: newOffer.hotel_makkah,
          hotel_makkah_stars: newOffer.hotel_makkah_stars || 4,
          hotel_medina: newOffer.hotel_medina,
          hotel_medina_stars: newOffer.hotel_medina_stars || 4,
          airline: newOffer.airline,
          half_board: newOffer.half_board || false,
          offer_url: newOffer.offer_url,
          nusuk_code: newOffer.nusuk_code,
          status: 'active',
          is_recommended: newOffer.is_recommended || false,
        });

      if (error) throw error;

      toast({
        title: "✅ Offre ajoutée",
        description: "L'offre Hajj a été créée avec succès",
      });

      setIsAddDialogOpen(false);
      setNewOffer({
        agency_name: '',
        agency_url: '',
        price_quad_eur: 0,
        departure_date: '',
        return_date: '',
        departure_cities: [],
        package_type: 'standard',
        accommodation_zone: 'A',
        camp_mina: null,
        hotel_makkah: '',
        hotel_makkah_stars: 4,
        hotel_medina: '',
        hotel_medina_stars: 4,
        airline: '',
        half_board: false,
        offer_url: '',
        nusuk_code: null,
        status: 'active',
        is_recommended: false
      });
      loadOffers();
    } catch (err: any) {
      console.error("Erreur d'ajout:", err);
      toast({
        title: "❌ Erreur",
        description: err.message || "Impossible d'ajouter l'offre",
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAgency("all");
    setSelectedPackageType("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const toggleDepartureCity = (offer: HajjOffer | Partial<HajjOffer>, city: string, isNew: boolean = false) => {
    const currentCities = offer.departure_cities || [];
    const newCities = currentCities.includes(city)
      ? currentCities.filter(c => c !== city)
      : [...currentCities, city];
    
    if (isNew) {
      setNewOffer({ ...newOffer, departure_cities: newCities });
    } else if (selectedOffer) {
      setSelectedOffer({ ...selectedOffer, departure_cities: newCities });
    }
  };

  // Composant réutilisable pour le formulaire d'offre
  const OfferFormFields = ({ offer, setOffer, isNew = false }: { 
    offer: HajjOffer | Partial<HajjOffer>, 
    setOffer: (offer: any) => void,
    isNew?: boolean 
  }) => (
    <div className="grid gap-4 py-4">
      {/* Agence et URL */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nom de l'agence</Label>
          <Input
            value={offer.agency_name || ''}
            onChange={(e) => setOffer({ ...offer, agency_name: e.target.value })}
            placeholder="Ex: Haramain Voyages"
          />
        </div>
        <div>
          <Label>URL de l'agence</Label>
          <Input
            value={offer.agency_url || ''}
            onChange={(e) => setOffer({ ...offer, agency_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Prix et URL de l'offre */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prix base quad (€)</Label>
          <Input
            type="number"
            value={offer.price_quad_eur || ''}
            onChange={(e) => setOffer({ ...offer, price_quad_eur: parseFloat(e.target.value) || 0 })}
            placeholder="9898"
          />
        </div>
        <div>
          <Label>URL de l'offre</Label>
          <Input
            value={offer.offer_url || ''}
            onChange={(e) => setOffer({ ...offer, offer_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date de départ</Label>
          <Input
            type="date"
            value={offer.departure_date || ''}
            onChange={(e) => setOffer({ ...offer, departure_date: e.target.value })}
          />
        </div>
        <div>
          <Label>Date de retour</Label>
          <Input
            type="date"
            value={offer.return_date || ''}
            onChange={(e) => setOffer({ ...offer, return_date: e.target.value })}
          />
        </div>
      </div>

      {/* Type de package et Zone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type de package</Label>
          <Select
            value={offer.package_type || 'standard'}
            onValueChange={(value) => setOffer({ ...offer, package_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PACKAGE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Zone d'hébergement</Label>
          <Select
            value={offer.accommodation_zone || 'A'}
            onValueChange={(value) => setOffer({ ...offer, accommodation_zone: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOMMODATION_ZONES.map((zone) => (
                <SelectItem key={zone.value} value={zone.value}>
                  {zone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Camp Mina et Code Nusuk */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Camp Mina</Label>
          <Select
            value={offer.camp_mina || 'none'}
            onValueChange={(value) => setOffer({ ...offer, camp_mina: value === 'none' ? null : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Non spécifié</SelectItem>
              {CAMP_MINA_OPTIONS.map((camp) => (
                <SelectItem key={camp.value} value={camp.value}>
                  {camp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Code Nusuk</Label>
          <Input
            value={offer.nusuk_code || ''}
            onChange={(e) => setOffer({ ...offer, nusuk_code: e.target.value || null })}
            placeholder="Code optionnel"
          />
        </div>
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
                className="w-full justify-between"
              >
                {offer.hotel_makkah || "Sélectionner..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un hôtel..." />
                <CommandEmpty>
                  <Input
                    placeholder="Nouvel hôtel..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget.value;
                        setOffer({ ...offer, hotel_makkah: input });
                        setOpenMakkahHotelPopover(false);
                      }
                    }}
                  />
                </CommandEmpty>
                <CommandGroup>
                  {makkahHotels.map((hotel) => (
                    <CommandItem
                      key={hotel.id}
                      value={hotel.hotel_name}
                      onSelect={() => {
                        setOffer({ ...offer, hotel_makkah: hotel.hotel_name, hotel_makkah_stars: hotel.stars || offer.hotel_makkah_stars });
                        setOpenMakkahHotelPopover(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          offer.hotel_makkah === hotel.hotel_name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {hotel.hotel_name} ({hotel.stars}⭐)
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Étoiles Makkah</Label>
          <Select
            value={(offer.hotel_makkah_stars || 4).toString()}
            onValueChange={(value) => setOffer({ ...offer, hotel_makkah_stars: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ⭐</SelectItem>
              <SelectItem value="2">2 ⭐⭐</SelectItem>
              <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
              <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
              <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Hôtel Médina</Label>
          <Popover open={openMedinaHotelPopover} onOpenChange={setOpenMedinaHotelPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {offer.hotel_medina || "Sélectionner..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un hôtel..." />
                <CommandEmpty>
                  <Input
                    placeholder="Nouvel hôtel..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget.value;
                        setOffer({ ...offer, hotel_medina: input });
                        setOpenMedinaHotelPopover(false);
                      }
                    }}
                  />
                </CommandEmpty>
                <CommandGroup>
                  {medinaHotels.map((hotel) => (
                    <CommandItem
                      key={hotel.id}
                      value={hotel.hotel_name}
                      onSelect={() => {
                        setOffer({ ...offer, hotel_medina: hotel.hotel_name, hotel_medina_stars: hotel.stars || offer.hotel_medina_stars });
                        setOpenMedinaHotelPopover(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          offer.hotel_medina === hotel.hotel_name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {hotel.hotel_name} ({hotel.stars}⭐)
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Étoiles Médina</Label>
          <Select
            value={(offer.hotel_medina_stars || 4).toString()}
            onValueChange={(value) => setOffer({ ...offer, hotel_medina_stars: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ⭐</SelectItem>
              <SelectItem value="2">2 ⭐⭐</SelectItem>
              <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
              <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
              <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
            </SelectContent>
          </Select>
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
              className="w-full justify-between"
            >
              {offer.airline || "Sélectionner..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher..." />
              <CommandEmpty>
                <Input
                  placeholder="Nouvelle compagnie..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setOffer({ ...offer, airline: e.currentTarget.value });
                      setOpenAirlinePopover(false);
                    }
                  }}
                />
              </CommandEmpty>
              <CommandGroup>
                {airlinePresets.map((airline) => (
                  <CommandItem
                    key={airline.id}
                    value={airline.airline_name}
                    onSelect={() => {
                      setOffer({ ...offer, airline: airline.airline_name });
                      setOpenAirlinePopover(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        offer.airline === airline.airline_name ? "opacity-100" : "opacity-0"
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

      {/* Villes de départ */}
      <div>
        <Label>Villes de départ</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {DEPARTURE_CITIES.map((city) => (
            <Badge
              key={city}
              variant={offer.departure_cities?.includes(city) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDepartureCity(offer, city, isNew)}
            >
              {city}
            </Badge>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="half-board"
            checked={offer.half_board || false}
            onCheckedChange={(checked) => setOffer({ ...offer, half_board: !!checked })}
          />
          <Label htmlFor="half-board">Demi-pension</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is-recommended"
            checked={offer.is_recommended || false}
            onCheckedChange={(checked) => setOffer({ ...offer, is_recommended: !!checked })}
          />
          <Label htmlFor="is-recommended">Recommandé</Label>
        </div>
      </div>

      {/* Statut (seulement pour l'édition) */}
      {!isNew && (
        <div>
          <Label>Statut</Label>
          <Select
            value={(offer as HajjOffer).status || 'active'}
            onValueChange={(value) => setOffer({ ...offer, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="sold_out">Complet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

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
          <h1 className="text-3xl font-bold">🕋 Gestion des Offres Hajj</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle offre
          </Button>
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
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Agence, hôtel, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

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

            <div>
              <Label htmlFor="package">Type de package</Label>
              <Select value={selectedPackageType} onValueChange={setSelectedPackageType}>
                <SelectTrigger id="package">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {PACKAGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                    <TableHead>Prix quad</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Villes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucune offre Hajj trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOffers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.agency_name}</TableCell>
                        <TableCell>{offer.price_quad_eur}€</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {offer.package_type}
                          </Badge>
                        </TableCell>
                        <TableCell>Zone {offer.accommodation_zone}</TableCell>
                        <TableCell>
                          {offer.departure_date && offer.return_date ? (
                            <>
                              Du {new Date(offer.departure_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.return_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                            </>
                          ) : (
                            <span className="text-muted-foreground">Non défini</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {offer.departure_cities?.slice(0, 2).map((city) => (
                              <Badge key={city} variant="secondary" className="text-xs">
                                {city}
                              </Badge>
                            ))}
                            {offer.departure_cities?.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{offer.departure_cities.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
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
            <DialogTitle>Modifier l'offre Hajj</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <OfferFormFields 
              offer={selectedOffer} 
              setOffer={setSelectedOffer}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une offre Hajj</DialogTitle>
          </DialogHeader>
          <OfferFormFields 
            offer={newOffer} 
            setOffer={setNewOffer}
            isNew
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAdd}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer l'offre de <strong>{selectedOffer?.agency_name}</strong> ?
          </p>
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
