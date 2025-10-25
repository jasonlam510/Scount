import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';

interface FloatingActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onPress,
  size = 56,
  iconSize = 24,
  backgroundColor,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: backgroundColor || colors.primary,
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onPress={onPress}
      >
        <Ionicons name={icon} size={iconSize} color="white" />
      </TouchableOpacity>
      <Text style={[styles.fabLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 8,
  },
  fabLabel: {
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 10,
  },
});

export default FloatingActionButton; 