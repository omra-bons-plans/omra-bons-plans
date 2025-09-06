import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'SA', name: 'Arabie Saoudite', dialCode: '+966', flag: '🇸🇦' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' },
];

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const CountrySelect = ({ value, onValueChange, className }: CountrySelectProps) => {
  const selectedCountry = countries.find(country => country.dialCode === value) || countries[0];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-24 bg-background border-border ${className}`}>
        <SelectValue>
          <div className="flex items-center space-x-1">
            <span className="text-sm">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background border-border z-50 max-h-60 overflow-y-auto">
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.dialCode}>
            <div className="flex items-center space-x-2">
              <span>{country.flag}</span>
              <span className="font-medium">{country.dialCode}</span>
              <span className="text-muted-foreground">{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;