import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme, useI18n } from '@/hooks';

interface GroupListHeaderProps {
  title: string;
  subtitle?: string;
}

export default function GroupListHeader({ title, subtitle }: GroupListHeaderProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
});
