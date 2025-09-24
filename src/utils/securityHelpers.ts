/**
 * Utilitaires de sécurité pour éviter l'exposition de données sensibles
 * IMPORTANT: Ne jamais exposer d'informations sensibles côté client
 */

// Liste des patterns dangereux à éviter dans les logs
const SENSITIVE_PATTERNS = [
  /password/i,
  /email/i,
  /token/i,
  /auth/i,
  /admin/i,
  /secret/i,
  /key/i,
  /credential/i
];

/**
 * Fonction sécurisée pour les logs en développement uniquement
 * Ne log rien en production et filtre les données sensibles
 */
export const secureLog = (message: string, data?: any) => {
  // Ne pas logger en production
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  // Vérifier si le message contient des patterns sensibles
  const containsSensitiveData = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(message) || (data && JSON.stringify(data).match(pattern))
  );
  
  if (containsSensitiveData) {
    console.warn('🚨 Tentative de log de données sensibles bloquée');
    return;
  }
  
  console.log(message, data);
};

/**
 * Vérifie si l'utilisateur actuel est admin de manière sécurisée
 * Ne révèle aucune information sensible
 */
export const isCurrentUserAdmin = (userRoles: any[] | null): boolean => {
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.some(role => role.role === 'admin');
};

/**
 * Nettoie les données sensibles d'un objet avant de les exposer côté client
 */
export const sanitizeUserData = (userData: any) => {
  if (!userData) return null;
  
  const sanitized = { ...userData };
  
  // Supprimer les champs sensibles
  delete sanitized.password;
  delete sanitized.raw_user_meta_data;
  delete sanitized.encrypted_password;
  delete sanitized.email_confirmed_at;
  delete sanitized.phone_confirmed_at;
  delete sanitized.confirmation_token;
  delete sanitized.recovery_token;
  delete sanitized.email_change_token_new;
  delete sanitized.email_change_token_current;
  
  return sanitized;
};