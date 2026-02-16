import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/hooks";

export interface SelectorOption {
  key: string;
  label: string;
  value: string;
}

interface SelectorProps {
  visible: boolean;
  title: string;
  options: SelectorOption[];
  onSelect: (value: string) => void;
  onCancel: () => void;
}

const Selector: React.FC<SelectorProps> = ({
  visible,
  title,
  options,
  onSelect,
  onCancel,
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
    >
      <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
        {/* Title */}
        <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>

        {/* Options */}
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.option,
              { borderBottomColor: colors.border },
              index === options.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: colors.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    minWidth: 250,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Selector;
