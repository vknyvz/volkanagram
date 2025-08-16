export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // proper email
  PASSWORD: /^[A-Za-z0-9()?^*&]{6,}$/, // min: 6 chars, accepts only "AZ, 0-9, ()?^*&"
  FULL_NAME: /^[A-Za-z\s]{3,}$/, // min: 3 chars, accepts only "AZ"
  USERNAME: /^[A-Za-z0-9]{3,}$/ // min: 3 chars, accepts only "AZ, 0-9"
} as const;