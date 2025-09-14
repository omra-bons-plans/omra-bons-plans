import { useState, useEffect } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchAirports, Airport, airports } from "@/data/airports";

interface AirportSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AirportSelect({
  value,
  onValueChange,
  placeholder = "Choisir un aéroport...",
  className
}: AirportSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>(searchAirports(""));

  useEffect(() => {
    const results = searchAirports(searchQuery);
    setFilteredAirports(results);
  }, [searchQuery]);

  const selectedAirport = filteredAirports.find((airport) => airport.code === value) || 
                         airports.find((airport) => airport.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedAirport ? (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{selectedAirport.code}</span>
              <span className="text-muted-foreground">-</span>
              <span className="truncate">{selectedAirport.city}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Rechercher un aéroport..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.length < 2 
                ? "Tapez au moins 2 caractères pour rechercher..." 
                : "Aucun aéroport trouvé."}
            </CommandEmpty>
            <CommandGroup>
              {filteredAirports.map((airport) => (
                <CommandItem
                  key={airport.code}
                  value={airport.code}
                  onSelect={() => {
                    onValueChange(airport.code);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-primary">{airport.code}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{airport.city}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {airport.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{airport.country}</span>
                    {value === airport.code && (
                      <Check className="ml-2 h-4 w-4 text-primary" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}