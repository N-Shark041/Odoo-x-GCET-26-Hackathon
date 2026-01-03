
export interface PasswordStrength {
  score: number; // 0 to 100
  label: string;
  color: string;
  metCriteria: {
    length8: boolean;
    length15: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

const COMMON_PASSWORDS = ['password', '12345678', 'password123', 'admin123', 'qwertyuiop'];

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  const criteria = {
    length8: password.length >= 8,
    length15: password.length >= 15,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (password.length > 0) {
    if (criteria.length8) score += 25;
    if (criteria.length15) score += 25;
    if (criteria.hasUpper) score += 12.5;
    if (criteria.hasLower) score += 12.5;
    if (criteria.hasNumber) score += 12.5;
    if (criteria.hasSpecial) score += 12.5;
  }

  // Normalize score to 100 max
  score = Math.min(score, 100);

  let label = 'Very Weak';
  let color = 'bg-red-500';

  if (score > 75) {
    label = 'Strong';
    color = 'bg-emerald-500';
  } else if (score > 50) {
    label = 'Good';
    color = 'bg-yellow-500';
  } else if (score > 25) {
    label = 'Weak';
    color = 'bg-orange-500';
  }

  return { score, label, color, metCriteria: criteria };
};

export const isPasswordValid = (password: string): boolean => {
  const { metCriteria } = calculatePasswordStrength(password);
  
  // Option A: 15+ characters
  if (metCriteria.length15) return true;
  
  // Option B: 8+ characters AND mix of types
  const complexityCount = [
    metCriteria.hasUpper,
    metCriteria.hasLower,
    metCriteria.hasNumber,
    metCriteria.hasSpecial
  ].filter(Boolean).length;
  
  return metCriteria.length8 && complexityCount >= 3;
};

export const checkCommonPassword = (password: string): boolean => {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
};
