import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks';
import { useI18n } from '@/hooks/useI18n';
import GroupCard from '@/components/features/groups/GroupCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { Group } from '@/types/groups';
import { useUserGroupsRealtime } from '@/powersync/hooks/useUserGroups';
import { router } from 'expo-router';

export default function GroupScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { groups, isLoading, error } = useUserGroupsRealtime();
  
  if (isLoading) {
    console.log('Loading groups... [GroupScreen]');
  }
  if (error) {
    console.log('Failed to load groups:', error.message);
  }

  const handleGroupPress = (group: Group) => {
    // Navigate to group detail page using Expo Router
    Alert.alert('Navigate', `Going to ${group.title} group page`);
    // TODO: Implement group detail navigation
    // router.push(`/group/${group.id}`);
  };

  const handleCreateGroup = () => {
    Alert.alert('Create Group', 'Navigate to create group screen');
    // TODO: Implement create group navigation
    // router.push('/create-group');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('group.title')}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Split expenses with friends</Text>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={handleGroupPress}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No groups yet. Create your first group to start splitting expenses!
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Floating Action Button for Group */}
      <FloatingActionButton
        icon="people"
        label={t('group.addGroupExpense')}
        onPress={handleCreateGroup}
      />
    </View>
  );
}

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
  },
  contentContainer: {
    paddingBottom: 100, // Space for FAB
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
