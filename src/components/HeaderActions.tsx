import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  visible?: boolean;
  size?: number;
}

interface HeaderActionsProps {
  // Left side - Back button
  showBackButton?: boolean;
  backButtonText?: string;
  onBackPress?: () => void;
  
  // Right side - Actions
  actions?: HeaderAction[];
  
  // Styling
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  showBackButton = false,
  backButtonText,
  onBackPress,
  actions = [],
  style,
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const renderBackButton = () => {
    if (!showBackButton) return null;
    
    return (
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBackPress}
      >
        <Ionicons name="chevron-back" size={24} color={colors.text} />
        {backButtonText && (
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            {backButtonText}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderActions = () => {
    const visibleActions = actions.filter(action => action.visible !== false);
    
    if (visibleActions.length === 0) return null;
    
    return (
      <View style={styles.actionsContainer}>
        {visibleActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <Ionicons 
              name={action.icon} 
              size={action.size || 24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          paddingTop: insets.top, 
          backgroundColor: backgroundColor || colors.background 
        },
        style
      ]}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {renderBackButton()}
        </View>
        <View style={styles.rightSection}>
          {renderActions()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default HeaderActions; 