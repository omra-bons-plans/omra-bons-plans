import React, { useState, useEffect } from 'react';
import Check from 'lucide-react/dist/esm/icons/check';
import ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down';
import Plane from 'lucide-react/dist/esm/icons/plane';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAirlines, Airline } from '@/hooks/useAirlines';

interface AirlineSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AirlineSelect({ 
  value, 
  onChange, 
  placeholder = "Sélectionner une compagnie aérienne...",
  className 
}: AirlineSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { airlines, loading, searchAirlines } = useAirlines();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== '') {
        searchAirlines(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchAirlines]);

  const selectedAirline = airlines.find((airline) => airline.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 opacity-50" />
            {selectedAirline ? (
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {selectedAirline.iata}
                </span>
                {selectedAirline.name}
              </span>
            ) : (
              placeholder
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-50 bg-background" align="start">
        <Command>
          <CommandInput 
            placeholder="Rechercher une compagnie..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>
            {loading ? 'Chargement...' : 'Aucune compagnie trouvée.'}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {airlines.map((airline) => (
              <CommandItem
                key={airline.iata}
                value={airline.name}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 opacity-50" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                        {airline.iata}
                      </span>
                      <span>{airline.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {airline.country}
                    </div>
                  </div>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === airline.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}