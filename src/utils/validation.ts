const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Basic email format validation.
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
