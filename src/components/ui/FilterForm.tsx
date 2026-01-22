import React from "react";
// ⚡ PERFORMANCE: Individual icon imports to reduce bundle size
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';
import Tent from 'lucide-react/dist/esm/icons/tent';
import Building from 'lucide-react/dist/esm/icons/building';
import Package from 'lucide-react/dist/esm/icons/package';

interface FilterFormProps {
  tripType: 'omra' | 'hajj';
  setTripType: (type: 'omra' | 'hajj') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedDuration?: string;
  setSelectedDuration?: (duration: string) => void;
  // Hajj-specific filters
  selectedZone?: string;
  setSelectedZone?: (zone: string) => void;
  selectedCamp?: string;
  setSelectedCamp?: (camp: string) => void;
  selectedPackage?: string;
  setSelectedPackage?: (pkg: string) => void;
  onSearch?: () => void;
  onReset?: () => void;
  compact?: boolean;
  availableCities?: string[];
  availableMonths?: string[];
  availableZones?: string[];
  availableCamps?: string[];
  availablePackages?: string[];
}

const DEFAULT_MONTHS = [
  { value: "Ramadan", label: "🌙 Ramadan" },
  { value: "Janvier", label: "Janvier 2026" },
  { value: "Février", label: "Février 2026" },
  { value: "Mars", label: "Mars 2026" },
  { value: "Avril", label: "Avril 2026" },
  { value: "Mai", label: "Mai 2026" },
  { value: "Juin", label: "Juin 2026" },
  { value: "Juillet", label: "Juillet 2026" },
  { value: "Août", label: "Août 2026" },
  { value: "Septembre", label: "Septembre 2026" },
  { value: "Octobre", label: "Octobre 2026" },
  { value: "Novembre", label: "Novembre 2026" },
  { value: "Décembre", label: "Décembre 2026" },
];

export function FilterForm({
  tripType,
  setTripType,
  selectedCity,
  setSelectedCity,
  selectedMonth,
  setSelectedMonth,
  selectedDuration,
  setSelectedDuration,
  selectedZone,
  setSelectedZone,
  selectedCamp,
  setSelectedCamp,
  selectedPackage,
  setSelectedPackage,
  onSearch,
  onReset,
  compact = false,
  availableCities = [],
  availableMonths = [],
  availableZones = [],
  availableCamps = [],
  availablePackages = []
}: FilterFormProps) {
  const cities = availableCities.length > 0 ? ["Toutes les villes", ...availableCities] : ["Toutes les villes"];
  const months = availableMonths.length > 0 
    ? DEFAULT_MONTHS.filter(m => availableMonths.includes(m.value))
    : DEFAULT_MONTHS;
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.();
  }

  function handleReset() {
    setSelectedCity('all');
    setSelectedMonth('all');
    setSelectedDuration?.('all');
    setSelectedZone?.('all');
    setSelectedCamp?.('all');
    setSelectedPackage?.('all');
    onReset?.();
  }

  const hasActiveFilters = selectedCity !== 'all' || 
    selectedMonth !== 'all' || 
    (selectedDuration && selectedDuration !== 'all') ||
    (selectedZone && selectedZone !== 'all') ||
    (selectedCamp && selectedCamp !== 'all') ||
    (selectedPackage && selectedPackage !== 'all');

  return (
    <form 
      onSubmit={handleSearch} 
      className={`rounded-2xl border border-border bg-card ${compact ? "p-3" : "p-4 lg:p-5"} shadow-sm`} 
      aria-label="Filtres de recherche Omra/Hajj"
    >
      <div className={`grid gap-3 ${compact ? "grid-cols-1" : tripType === "hajj" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
        {/* TOGGLE TYPE */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Type
          </label>
          <div 
            role="tablist" 
            aria-label="Type de séjour" 
            className="inline-flex w-full rounded-xl bg-muted p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tripType === "omra"}
              onClick={() => setTripType("omra")}
              className={`h-12 flex-1 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary ${
                tripType === "omra"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-foreground"
              }`}
            >
              Omra
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tripType === "hajj"}
              onClick={() => setTripType("hajj")}
              className={`h-12 flex-1 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary ${
                tripType === "hajj"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-foreground"
              }`}
            >
              Hajj
            </button>
          </div>
        </div>

        {/* CITY */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ville de départ
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              <MapPin size={18} />
            </span>
            <select
              value={selectedCity === 'all' ? 'Toutes les villes' : selectedCity}
              onChange={(e) => setSelectedCity(e.target.value === 'Toutes les villes' ? 'all' : e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-[15px] font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MONTH for Omra OR Hajj-specific filters */}
        {tripType === "omra" ? (
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Période
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <Calendar size={18} />
              </span>
              <select
                value={selectedMonth === 'all' ? '' : selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value || 'all')}
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-[15px] font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les mois</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            {/* Zone d'hébergement (Hajj) */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Zone d'hébergement
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Building size={18} />
                </span>
                <select
                  value={selectedZone || 'all'}
                  onChange={(e) => setSelectedZone?.(e.target.value)}
                  className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-[15px] font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Toutes les zones</option>
                  {availableZones.map((zone) => (
                    <option key={zone} value={zone}>
                      Zone {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs opacity-0">Action</label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-12 flex-1 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                <Search size={16} />
                Rechercher
              </span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="h-12 px-4 rounded-xl border border-border bg-background text-foreground font-semibold shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                title="Réinitialiser les filtres"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hajj-specific additional filters row */}
      {tripType === "hajj" && (
        <div className="grid gap-3 mt-3 grid-cols-1 md:grid-cols-3">
          {/* Camp Mina */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Camp Mina
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <Tent size={18} />
              </span>
              <select
                value={selectedCamp || 'all'}
                onChange={(e) => setSelectedCamp?.(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-[15px] font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tous les camps</option>
                {availableCamps.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type de formule (Package) */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Type de formule
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <Package size={18} />
              </span>
              <select
                value={selectedPackage || 'all'}
                onChange={(e) => setSelectedPackage?.(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-[15px] font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Toutes les formules</option>
                {availablePackages.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Durée de séjour (Hajj) */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Durée de séjour
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <Calendar size={18} />
              </span>
              <select
                value={selectedDuration || 'all'}
                onChange={(e) => setSelectedDuration?.(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-[15px] font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Toutes durées</option>
                <option value="court">Court séjour (≤20 nuits)</option>
                <option value="long">Long séjour (&gt;20 nuits)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
