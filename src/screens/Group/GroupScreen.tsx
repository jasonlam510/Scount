import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';
import { useI18n } from '../../hooks/useI18n';
import GroupCard from '../../components/features/groups/GroupCard';
import { FloatingActionButton } from '../../components';
import { Group } from '../../types/goups';

const GroupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();
  
  // Sample groups data - in a real app, this would come from your store/service
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      title: 'Roommates',
      icon: '🏠',
      currency: 'USD',
      is_archived: false,
      created_at: Date.now() - 86400000 * 30,
      updated_at: Date.now(),
    },
    {
      id: '2',
      title: 'Vacation Trip',
      icon: '✈️',
      currency: 'EUR',
      is_archived: false,
      created_at: Date.now() - 86400000 * 7,
      updated_at: Date.now(),
    },
    {
      id: '3',
      title: 'Old Project',
      icon: '💼',
      currency: 'USD',
      is_archived: true,
      created_at: Date.now() - 86400000 * 90,
      updated_at: Date.now(),
    },
  ]);

  const handleGroupPress = (group: Group) => {
    // Navigate to group detail page
    Alert.alert('Navigate', `Going to ${group.title} group page`);
    // In a real app: navigation.navigate('GroupDetail', { groupId: group.id });
  };

  const handleCreateGroup = () => {
    Alert.alert('Create Group', 'Navigate to create group screen');
    // In a real app: navigation.navigate('CreateGroup');
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

export default GroupScreen; 