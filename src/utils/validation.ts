// Validation rules for ads and forms

// Limits for ad content
export const AD_LIMITS = {
  TITLE_MIN: 10,
  TITLE_MAX: 80,
  DESCRIPTION_MIN: 20,
  DESCRIPTION_MAX: 500,
} as const;

// Password validation rules
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
} as const;

// Validate ad title
export const validateAdTitle = (title: string): string | true => {
  if (!title || title.trim().length === 0) {
    return "Le titre est requis";
  }
  
  if (title.length < AD_LIMITS.TITLE_MIN) {
    return `Le titre doit contenir au moins ${AD_LIMITS.TITLE_MIN} caractères`;
  }
  
  if (title.length > AD_LIMITS.TITLE_MAX) {
    return `Le titre ne peut pas dépasser ${AD_LIMITS.TITLE_MAX} caractères`;
  }
  
  return true;
};

// Validate ad description
export const validateAdDescription = (description: string): string | true => {
  if (!description || description.trim().length === 0) {
    return "La description est requise";
  }
  
  if (description.length < AD_LIMITS.DESCRIPTION_MIN) {
    return `La description doit contenir au moins ${AD_LIMITS.DESCRIPTION_MIN} caractères`;
  }
  
  if (description.length > AD_LIMITS.DESCRIPTION_MAX) {
    return `La description ne peut pas dépasser ${AD_LIMITS.DESCRIPTION_MAX} caractères`;
  }
  
  return true;
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_RULES.MIN_LENGTH) {
    errors.push(`Au moins ${PASSWORD_RULES.MIN_LENGTH} caractères`);
  }
  
  if (PASSWORD_RULES.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push("Au moins une majuscule");
  }
  
  if (PASSWORD_RULES.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push("Au moins une minuscule");
  }
  
  if (PASSWORD_RULES.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push("Au moins un chiffre");
  }
  
  if (PASSWORD_RULES.REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Au moins un caractère spécial (!@#$%^&*...)");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get password strength level
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const validation = validatePassword(password);
  const errorCount = validation.errors.length;
  
  if (errorCount >= 3) return 'weak';
  if (errorCount >= 1) return 'medium';
  return 'strong';
};

// Get remaining characters for inputs
export const getRemainingChars = (text: string, maxLength: number): number => {
  return Math.max(0, maxLength - text.length);
};