import { Platform } from 'react-native'

/**
 * Detect if the app is running on web platform
 */
export const isWeb = Platform.OS === 'web'

/**
 * Detect if the app is running on mobile platform (iOS/Android)
 */
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'

/**
 * Detect if the app is running on iOS
 */
export const isIOS = Platform.OS === 'ios'

/**
 * Detect if the app is running on Android
 */
export const isAndroid = Platform.OS === 'android'

/**
 * Get the current platform name
 */
export const getPlatform = (): 'web' | 'ios' | 'android' => {
  return Platform.OS as 'web' | 'ios' | 'android'
} 