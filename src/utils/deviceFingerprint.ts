// Génère un device fingerprint basé sur les caractéristiques du navigateur
export const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  let fingerprint = '';
  
  // Canvas fingerprinting
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device Fingerprint', 2, 2);
    fingerprint += canvas.toDataURL();
  }
  
  // Collect browser characteristics
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    navigator.hardwareConcurrency || 0,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ];
  
  fingerprint += components.join('|');
  
  // Generate hash
  return hashString(fingerprint);
};

// Simple hash function (FNV-1a)
const hashString = (str: string): string => {
  let hash = 2166136261;
  
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  
  return (hash >>> 0).toString(36);
};
