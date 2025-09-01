import Constants from 'expo-constants';

// ElectricSQL Cloud API URL and credentials from .env
const ELECTRIC_URL: string =
  (process.env.EXPO_PUBLIC_ELECTRIC_URL as string) ||
  ((Constants.expoConfig?.extra as any)?.ELECTRIC_URL as string) ||
  'https://api.electric-sql.cloud';

const ELECTRIC_SOURCE_ID: string =
  (process.env.EXPO_PUBLIC_ELECTRIC_SOURCE_ID as string) ||
  ((Constants.expoConfig?.extra as any)?.ELECTRIC_SOURCE_ID as string) ||
  '';

const ELECTRIC_SOURCE_SECRET: string =
  (process.env.EXPO_PUBLIC_ELECTRIC_SOURCE_SECRET as string) ||
  ((Constants.expoConfig?.extra as any)?.ELECTRIC_SOURCE_SECRET as string) ||
  '';

export const getElectricShapeUrl = (): string => {
  if (!ELECTRIC_URL) {
    console.warn('ELECTRIC_URL is not set. Configure ELECTRIC_URL in .env');
  }
  // ELECTRIC_URL already includes the full path, just return it as is
  return ELECTRIC_URL;
};

export const getElectricAuthParams = (): { source_id: string; secret: string } | undefined => {
  if (ELECTRIC_SOURCE_ID && ELECTRIC_SOURCE_SECRET) {
    return {
      source_id: ELECTRIC_SOURCE_ID,
      secret: ELECTRIC_SOURCE_SECRET,
    };
  }
  console.warn('ELECTRIC_SOURCE_ID or ELECTRIC_SOURCE_SECRET not set in .env');
  return undefined;
};


