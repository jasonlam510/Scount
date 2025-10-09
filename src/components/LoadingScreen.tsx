import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme, useI18n } from '../hooks';

interface LoadingScreenProps {
  messageKey?: string;
  message?: string;
  error?: string;
  showError?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  messageKey,
  message,
  error,
  showError = false,
}) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  
  // Use messageKey for i18n, fallback to message prop, then default
  const displayMessage = messageKey ? t(messageKey) : (message || t('common.loading'));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {displayMessage}
      </Text>
      {showError && error && (
        <Text style={[styles.error, { color: colors.danger }]}>
          Error: {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default LoadingScreen;
