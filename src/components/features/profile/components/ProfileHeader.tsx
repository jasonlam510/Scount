import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, ActionSheetIOS } from 'react-native';
import { useTheme, useI18n } from '@/hooks';
import Selector from '@/components/Selector';

interface ProfileHeaderProps {
  profileName?: string | null;
  userEmail?: string | null;
  profileAvatar?: string | null;
  profileLoading?: boolean;
  onPhotoSelected: (source: 'camera' | 'library') => void;
}

export default function ProfileHeader({
  profileName,
  userEmail,
  profileAvatar,
  profileLoading,
  onPhotoSelected,
}: ProfileHeaderProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);

  const handleEditPhoto = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), t('profile.camera'), t('profile.photoLibrary')],
          cancelButtonIndex: 0,
          title: t('profile.editPhoto'),
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onPhotoSelected('camera');
          } else if (buttonIndex === 2) {
            onPhotoSelected('library');
          }
        }
      );
    } else {
      setShowPhotoSelector(true);
    }
  };

  const handlePhotoSelect = (value: string) => {
    if (value === 'camera') {
      onPhotoSelected('camera');
    } else if (value === 'photoLibrary') {
      onPhotoSelected('library');
    }
    setShowPhotoSelector(false);
  };

  return (
    <>
    <View style={styles.profileHeader}>
      <TouchableOpacity 
        style={styles.profilePhotoContainer}
        onPress={handleEditPhoto}
        activeOpacity={0.7}
      >
        <Image
          source={{ 
            uri: profileAvatar && profileAvatar.trim() !== '' 
              ? profileAvatar 
              : 'https://via.placeholder.com/80x80?text=User'
          }}
          style={styles.profilePhoto}
          onError={() => {
            console.log('Profile image failed to load, using placeholder');
          }}
        />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {profileLoading ? t('common.loading') : profileName}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {userEmail}
        </Text>
      </View>
    </View>

      {/* Photo Selector */}
      <Selector
        visible={showPhotoSelector}
        title={t('profile.editPhoto')}
        options={[
          { key: 'camera', label: t('profile.camera'), value: 'camera' },
          { key: 'photoLibrary', label: t('profile.photoLibrary'), value: 'photoLibrary' },
        ]}
        onSelect={handlePhotoSelect}
        onCancel={() => setShowPhotoSelector(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profilePhotoContainer: {
    marginRight: 15,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
});
