import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import FloatingActionButton from '../../components/FloatingActionButton';

const GroupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Group</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Split expenses with friends</Text>
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          This screen will contain the Group functionality for splitting expenses between multiple people.
        </Text>
      </View>
      
      {/* Floating Action Button for Group */}
      <FloatingActionButton
        icon="people"
        label="Create Group"
        onPress={() => {
          // TODO: Navigate to create group screen
          console.log('Create group pressed');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default GroupScreen; 