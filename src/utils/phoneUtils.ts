// Utility functions for phone number handling in descriptions

// Regex patterns to detect phone numbers in different formats
const phonePatterns = [
  // French phone numbers: +33, 0033, 06/07 formats
  /(\+33\s?[1-9](?:\s?\d){8})/g,
  /(\b0033\s?[1-9](?:\s?\d){8})/g,
  /(\b0[1-9](?:[\s.-]?\d){8})/g,
  
  // International formats
  /(\+\d{1,3}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9})/g,
  /(\b00\d{1,3}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9})/g,
  
  // WhatsApp and other messaging app numbers
  /(\bwhatsapp[:\s]+\+?\d{8,15})/gi,
  /(\btél[éephone]*[:\s]+\+?\d{8,15})/gi,
  /(\btel[éephone]*[:\s]+\+?\d{8,15})/gi,
  /(\bcontact[:\s]+\+?\d{8,15})/gi,
  
  // Common separators and formats
  /(\d{2}[\s.-]\d{2}[\s.-]\d{2}[\s.-]\d{2}[\s.-]\d{2})/g,
  /(\d{10,15})/g // Simple long digit sequences
];

/**
 * Masks phone numbers in text by replacing them with 'x' characters
 * @param text - The text to process
 * @returns The text with phone numbers masked
 */
export const maskPhoneNumbers = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  
  let maskedText = text;
  
  // Apply each pattern to mask phone numbers
  phonePatterns.forEach(pattern => {
    maskedText = maskedText.replace(pattern, (match) => {
      // Keep prefixes like "+33", "0033", "whatsapp:", "tél:", etc.
      const prefixMatch = match.match(/^(\+\d{1,3}|00\d{1,3}|whatsapp[:\s]+|tél[éephone]*[:\s]+|tel[éephone]*[:\s]+|contact[:\s]+)/i);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      
      // Count digits in the match to determine mask length
      const digits = match.replace(/\D/g, '');
      if (digits.length >= 8) { // Only mask if it looks like a real phone number
        const maskLength = Math.max(8, digits.length);
        return prefix + 'x'.repeat(maskLength);
      }
      
      return match; // Don't mask if it's too short to be a phone number
    });
  });
  
  return maskedText;
};

/**
 * Checks if text contains phone numbers
 * @param text - The text to check
 * @returns True if phone numbers are detected
 */
export const containsPhoneNumbers = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  
  return phonePatterns.some(pattern => pattern.test(text));
};
