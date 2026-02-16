import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { useTheme } from "@/hooks";

interface OtpInputProps {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  length?: number;
}

export default function OtpInput({
  value,
  onChangeText,
  label,
  length = 6,
}: OtpInputProps) {
  const { colors } = useTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChangeText = useCallback(
    (index: number, text: string) => {
      const digitsOnly = text.replace(/[^0-9]/g, "");

      if (digitsOnly.length > 1) {
        // Paste: take up to `length` digits and fill from current index
        const fromCurrent = value.slice(0, index) + digitsOnly;
        const newValue = fromCurrent.slice(0, length);
        onChangeText(newValue);
        const nextFocus = Math.min(newValue.length, length - 1);
        focusInput(nextFocus);
      } else if (digitsOnly.length === 1) {
        // Single digit
        const newValue =
          value.slice(0, index) + digitsOnly + value.slice(index + 1);
        onChangeText(newValue.slice(0, length));
        if (index < length - 1) {
          focusInput(index + 1);
        }
      }
    },
    [value, length, onChangeText, focusInput],
  );

  const handleKeyPress = useCallback(
    (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
        const newValue = value.slice(0, index - 1) + value.slice(index);
        onChangeText(newValue);
        focusInput(index - 1);
      } else if (e.nativeEvent.key === "Backspace" && digits[index]) {
        const newValue = value.slice(0, index) + value.slice(index + 1);
        onChangeText(newValue);
      }
    },
    [value, digits, onChangeText, focusInput],
  );

  return (
    <View style={styles.container}>
      {label != null && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View style={styles.boxRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            style={[
              styles.box,
              {
                backgroundColor: colors.surface,
                borderColor: digit ? colors.primary : colors.border,
                color: colors.text,
              },
            ]}
            value={digit}
            onChangeText={(text) => handleChangeText(index, text)}
            onKeyPress={(e) => handleKeyPress(index, e)}
            keyboardType="number-pad"
            maxLength={length}
            textAlign="center"
            selectTextOnFocus
            autoFocus={index === 0}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            placeholder=""
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  box: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
});
