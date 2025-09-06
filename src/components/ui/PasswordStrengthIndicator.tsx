import { getPasswordStrength, validatePassword } from '@/utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator = ({ password, className = '' }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const validation = validatePassword(password);
  const strength = getPasswordStrength(password);
  
  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-orange-500', 
    strong: 'bg-green-500'
  };

  const strengthLabels = {
    weak: 'Faible',
    medium: 'Moyen',
    strong: 'Fort'
  };

  const strengthWidth = {
    weak: 'w-1/3',
    medium: 'w-2/3',
    strong: 'w-full'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${strengthColors[strength]} ${strengthWidth[strength]} h-2 rounded-full transition-all duration-300`}
        />
      </div>
      
      {/* Strength Label */}
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${
          strength === 'weak' ? 'text-red-600' : 
          strength === 'medium' ? 'text-orange-600' : 
          'text-green-600'
        }`}>
          Sécurité : {strengthLabels[strength]}
        </span>
      </div>
      
      {/* Requirements */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Requis :</p>
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.isValid && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-green-600 rounded-full"></span>
          Mot de passe sécurisé !
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;