import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StickyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export interface FilterState {
  priceRange: [number, number];
  departureCity: string;
  month: string;
  formulaType: string;
  minNights?: number;
  maxNights?: number;
}

const CITIES = ['Toutes', 'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'];
const MONTHS = ['Tous', 'Ramadan', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const FORMULAS = ['Toutes', 'Essentiel', 'Confort'];

export const StickyFilters = ({ onFilterChange, initialFilters }: StickyFiltersProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || [0, 10000],
    departureCity: initialFilters?.departureCity || 'Toutes',
    month: initialFilters?.month || 'Tous',
    formulaType: initialFilters?.formulaType || 'Toutes',
    minNights: initialFilters?.minNights,
    maxNights: initialFilters?.maxNights,
  });

  // Detect scroll pour sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 10000],
      departureCity: 'Toutes',
      month: 'Tous',
      formulaType: 'Toutes',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') return value[0] !== 0 || value[1] !== 10000;
    if (key === 'departureCity') return value !== 'Toutes';
    if (key === 'month') return value !== 'Tous';
    if (key === 'formulaType') return value !== 'Toutes';
    return false;
  }).length;

  return (
    <>
      {/* Barre sticky mobile */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300
          ${isSticky ? 'translate-y-0 shadow-lg' : '-translate-y-full'}
          md:hidden
        `}
      >
        <Card className="rounded-none border-0 border-b">
          <div className="flex items-center justify-between p-3 bg-background">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs"
              >
                <X className="w-4 h-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Filtres expandables */}
          {isExpanded && (
            <div className="p-4 space-y-4 bg-background border-t animate-fade-in">
              {/* Prix */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Budget: {filters.priceRange[0]}€ - {filters.priceRange[1]}€
                </label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                  className="w-full"
                />
              </div>

              {/* Ville départ */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville de départ</label>
                <Select
                  value={filters.departureCity}
                  onValueChange={(value) => updateFilter('departureCity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mois */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select
                  value={filters.month}
                  onValueChange={(value) => updateFilter('month', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Formule */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Formule</label>
                <Select
                  value={filters.formulaType}
                  onValueChange={(value) => updateFilter('formulaType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMULAS.map(formula => (
                      <SelectItem key={formula} value={formula}>{formula}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Spacer pour éviter le contenu caché */}
      {isSticky && isExpanded && (
        <div className="h-[420px] md:hidden" />
      )}
    </>
  );
};
