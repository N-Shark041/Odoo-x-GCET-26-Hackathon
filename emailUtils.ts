
/**
 * Sanitizes a string by converting to lowercase and removing non-alphanumeric characters.
 */
const sanitize = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Generates a corporate email following the pattern: name.id@odoodo.com
 */
export const generateCorporateEmail = (name: string, employeeId: string): string => {
  const cleanName = sanitize(name);
  const cleanId = sanitize(employeeId);
  
  if (!cleanName || !cleanId) return '';
  
  return `${cleanName}.${cleanId}@odoodo.com`;
};

/**
 * Regex for strictly validating the corporate email format.
 */
export const CORPORATE_EMAIL_REGEX = /^[a-z0-9]+\.[a-z0-9]+@odoodo\.com$/;

/**
 * Validates if an email matches the strict corporate requirements.
 */
export const isValidCorporateEmail = (email: string): boolean => {
  return CORPORATE_EMAIL_REGEX.test(email);
};
