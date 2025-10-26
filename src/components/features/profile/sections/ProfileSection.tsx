import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, useI18n } from '@/hooks';
import ProfileHeader from '../components/ProfileHeader';
import EditableRow from '../components/EditableRow';

interface ProfileSectionProps {
  profileName?: string | null;
  userEmail?: string | null;
  profileAvatar?: string | null;
  profileLoading?: boolean;
  onPhotoSelected: (source: 'camera' | 'library') => void;
  onEditName: () => void;
}

export default function ProfileSection({
  profileName,
  userEmail,
  profileAvatar,
  profileLoading,
  onPhotoSelected,
  onEditName,
}: ProfileSectionProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <ProfileHeader
        profileName={profileName}
        userEmail={userEmail}
        profileAvatar={profileAvatar}
        profileLoading={profileLoading}
        onPhotoSelected={onPhotoSelected}
      />
      
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      
      <EditableRow
        label={t('profile.name')}
        value={profileLoading ? t('common.loading') : profileName}
        onPress={onEditName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 15,
  },
});
