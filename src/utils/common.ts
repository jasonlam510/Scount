/**
 * Generates a unique identifier (UUID v4)
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Returns the current timestamp in ISO 8601 format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
