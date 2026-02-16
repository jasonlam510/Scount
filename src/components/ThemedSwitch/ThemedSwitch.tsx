import React from "react";
import { Switch } from "react-native";
import { useTheme } from "@/hooks";

export interface ThemedSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function ThemedSwitch({
  value,
  onValueChange,
  disabled,
}: ThemedSwitchProps) {
  const { colors } = useTheme();

  const thumbColor = value ? "#ffffff" : "#f4f3f4";

  return (
    <Switch
      trackColor={{ false: "#767577", true: colors.success }}
      thumbColor={thumbColor}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
      disabled={disabled}
    />
  );
}
