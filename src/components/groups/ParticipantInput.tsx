import React from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

interface ParticipantInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  isCreator?: boolean;
}

export const ParticipantInput: React.FC<ParticipantInputProps> = ({
  value,
  onChangeText,
  onRemove,
  placeholder,
  isCreator = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
      />
      {!isCreator && onRemove && (
        <Pressable onPress={onRemove} style={styles.removeButton} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color={colors.danger} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  removeButton: {
    marginLeft: 8,
  },
});
