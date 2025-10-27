import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme, useI18n } from '@/hooks';
import GroupCard from '../components/GroupCard';
import GroupListHeader from '../components/GroupListHeader';
import EmptyGroupState from '../components/EmptyGroupState';
import { Group } from '@/types/groups';

interface GroupListSectionProps {
  groups: Group[];
  isLoading?: boolean;
  onGroupPress: (group: Group) => void;
}

export default function GroupListSection({ 
  groups, 
  isLoading = false, 
  onGroupPress 
}: GroupListSectionProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  if (isLoading) {
    return null; // Or show loading spinner
  }

  return (
    <View style={styles.container}>
      <GroupListHeader 
        title={t('group.title')} 
        subtitle={t('group.subtitle')} 
      />
      
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
              onPress={onGroupPress}
            />
          ))
        ) : (
          <EmptyGroupState />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Space for FAB
  },
});
