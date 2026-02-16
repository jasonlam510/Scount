import { Alert as RNAlert, AlertButton, Platform } from "react-native";

/**
 * Web polyfill: RN Alert.alert doesn't work on web, use window.confirm.
 */
function alertPolyfill(
  title: string,
  message?: string,
  buttons?: AlertButton[],
): void {
  const text = [title, message].filter(Boolean).join("\n");
  const result = typeof window !== "undefined" && window.confirm(text);

  if (result) {
    const confirmOption = buttons?.find((b) => b.style !== "cancel");
    confirmOption?.onPress?.();
  } else {
    const cancelOption = buttons?.find((b) => b.style === "cancel");
    cancelOption?.onPress?.();
  }
}

/**
 * Wrapper around React Native Alert for consistent usage across the app.
 * On web, uses window.confirm polyfill; on native, uses Alert.alert.
 */
export const Alert = {
  alert: (title: string, message?: string, buttons?: AlertButton[]): void => {
    if (Platform.OS === "web") {
      alertPolyfill(title, message, buttons);
    } else {
      RNAlert.alert(title, message ?? "", buttons);
    }
  },
};
