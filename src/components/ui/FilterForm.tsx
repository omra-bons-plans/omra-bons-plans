import React from "react";
import { Calendar, MapPin, Search } from "lucide-react";

interface FilterFormProps {
  tripType: 'omra' | 'hajj';
  setTripType: (type: 'omra' | 'hajj') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  onSearch?: () => void;
  compact?: boolean;
}

const CITIES = [
  "Toutes les villes", "Paris", "Lyon", "Marseille", "Toulouse", 
  "Nice", "Nantes", "Bordeaux", "Lille"
];

const MONTHS = [
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
  onSearch,
  compact = false
}: FilterFormProps) {
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.();
  }

  return (
    <form 
      onSubmit={handleSearch} 
      className={`rounded-2xl border border-border bg-card ${compact ? "p-3" : "p-4 lg:p-5"} shadow-sm`} 
      aria-label="Filtres de recherche Omra/Hajj"
    >
      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
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
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MONTH */}
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
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs opacity-0">Action</label>
          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Search size={16} />
              Rechercher
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
