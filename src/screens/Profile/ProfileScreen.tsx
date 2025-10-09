import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useI18n, useUser, useAppSettings } from '../../hooks';
import { supabase } from '../../lib/supbabase';
import { useProfile } from '../../powersync/hooks';
import FloatingActionButton from '../../components/FloatingActionButton';
import Selector from '../../components/Selector';

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { 
    currentUserUuid, 
    userEmail,
    setCurrentUserUuid, 
    clearUserData,
  } = useUser();
  const { 
    notificationsEnabled, 
    setNotificationsEnabled,
  } = useAppSettings();
  
  // PowerSync profile data
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();
  
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showLogoutSelector, setShowLogoutSelector] = useState(false);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);

  // Handlers for navigation/actions
  const handleEditName = () => {
    Alert.alert('Edit Name', 'Navigate to screen to edit user name.');
    // In a real app: navigation.navigate('EditNameScreen');
  };

  const handleEditProfilePicture = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), t('profile.camera'), t('profile.photoLibrary')],
          cancelButtonIndex: 0,
          title: t('profile.editPhoto'),
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            console.log('Open camera');
          } else if (buttonIndex === 2) {
            console.log('Open photo library');
          }
        }
      );
    } else {
      setShowPhotoSelector(true);
    }
  };

  const getCurrentLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'en': return 'English';
      case 'zh': return '繁體中文';
      default: return 'English';
    }
  };

  // Platform-specific menu handlers
  const handleLanguagePress = () => {
    if (Platform.OS === 'ios') {
      // Native iOS ActionSheet (true bottom-up menu)
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['English', '繁體中文', 'Cancel'],
          cancelButtonIndex: 2,
          title: t('profile.language'),
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            changeLanguage('en');
          } else if (buttonIndex === 1) {
            changeLanguage('zh');
          }
          // buttonIndex === 2 is Cancel, do nothing
        }
      );
    } else {
      // Web/Android: use custom selector
      setShowLanguageSelector(true);
    }
  };

  const handleLanguageSelect = (language: string) => {
    changeLanguage(language);
    setShowLanguageSelector(false);
  };

  const handleThemePress = () => {
    if (Platform.OS === 'ios') {
      // Native iOS ActionSheet (true bottom-up menu)
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.light'), t('common.dark'), t('common.automatic'), 'Cancel'],
          cancelButtonIndex: 3,
          title: t('profile.theme'),
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            setThemeMode('light');
          } else if (buttonIndex === 1) {
            setThemeMode('dark');
          } else if (buttonIndex === 2) {
            setThemeMode('automatic');
          }
          // buttonIndex === 3 is Cancel, do nothing
        }
      );
    } else {
      // Web/Android: use custom selector
      setShowThemeSelector(true);
    }
  };

  const handleThemeSelect = (mode: string) => {
    setThemeMode(mode as 'light' | 'dark' | 'automatic');
    setShowThemeSelector(false);
  };

  // Platform-specific logout handlers
  const handleLogoutPress = () => {
    if (Platform.OS === 'ios') {
      // Native iOS ActionSheet (true bottom-up menu)
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('profile.logout'), 'Cancel'],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0, // Makes logout button red
          title: 'Logout?',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handleLogout(); // Execute actual logout
          }
          // buttonIndex === 1 is Cancel, do nothing
        }
      );
    } else {
      // Web/Android: use custom selector
      setShowLogoutSelector(true);
    }
  };

  const handleLogoutSelect = (value: string) => {
    if (value === 'logout') {
      handleLogout();
    }
    setShowLogoutSelector(false);
  };

  const handlePhotoSelect = (value: string) => {
    if (value === 'camera') {
      console.log('Open camera');
    } else if (value === 'photoLibrary') {
      console.log('Open photo library');
    }
    setShowPhotoSelector(false);
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
      }
      
      // Clear local user data
      await clearUserData();
      console.log('User logged out');
      // The AuthContext will automatically handle the navigation back to login
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => console.log('Profile deleted') },
      ]
    );
  };

  const handleSupportCenter = () => {
    Alert.alert('Support Center', 'Open support chat or contact page.');
    // In a real app: navigation.navigate('SupportScreen'); or open external link
  };

  const getThemeModeDisplayText = () => {
    switch (themeMode) {
      case 'light': return t('common.light');
      case 'dark': return t('common.dark');
      case 'automatic': return t('common.automatic');
      default: return t('common.automatic');
    }
  };

  // Loading state removed since we're using Zustand stores now

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        {/* Header */}
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>

        {/* User Information Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {/* Profile Photo and User Info */}
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.profilePhotoContainer}
              onPress={handleEditProfilePicture}
              activeOpacity={0.7}
            >
              <Image
                source={{ 
                  uri: profile?.avatar && profile.avatar.trim() !== '' 
                    ? profile.avatar 
                    : 'https://via.placeholder.com/80x80?text=User'
                }}
                style={styles.profilePhoto}
                onError={() => {
                  // Fallback to placeholder if image fails to load
                  console.log('Profile image failed to load, using placeholder');
                }}
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {profileLoading ? 'Loading...' : (profile?.name || 'No name set')}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {userEmail || 'No email set'}
              </Text>
            </View>
          </View>
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          {/* Editable Name */}
          <TouchableOpacity style={styles.row} onPress={handleEditName}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('profile.name')}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
                {profileLoading ? 'Loading...' : (profile?.name || 'No name set')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{t('profile.settings')}</Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('profile.notifications')}</Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.success }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={async (value) => {
                try {
                  await setNotificationsEnabled(value);
                } catch (error) {
                  console.error('Failed to save notifications setting:', error);
                }
              }}
              value={notificationsEnabled}
            />
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.row} onPress={handleLanguagePress}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('profile.language')}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{getCurrentLanguageDisplay()}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.row} onPress={handleThemePress}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('profile.theme')}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{getThemeModeDisplayText()}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogoutPress}>
          <Text style={[styles.logoutButtonText, { color: colors.danger }]}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteProfile}>
          <Text style={[styles.deleteProfileText, { color: colors.danger }]}>{t('profile.deleteProfile')}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button for Support Center */}
      <FloatingActionButton
        icon="chatbubble"
        label={t('profile.supportCenter')}
        backgroundColor={colors.success}
        onPress={handleSupportCenter}
      />

      {/* Theme Selector */}
      <Selector
        visible={showThemeSelector}
        title={t('profile.theme')}
        options={[
          { key: 'light', label: t('common.light'), value: 'light' },
          { key: 'dark', label: t('common.dark'), value: 'dark' },
          { key: 'automatic', label: t('common.automatic'), value: 'automatic' },
        ]}
        onSelect={handleThemeSelect}
        onCancel={() => setShowThemeSelector(false)}
      />

      {/* Language Selector */}
      <Selector
        visible={showLanguageSelector}
        title={t('profile.language')}
        options={[
          { key: 'en', label: 'English', value: 'en' },
          { key: 'zh', label: '繁體中文', value: 'zh' },
        ]}
        onSelect={handleLanguageSelect}
        onCancel={() => setShowLanguageSelector(false)}
      />

      {/* Logout Selector */}
      <Selector
        visible={showLogoutSelector}
        title="Logout?"
        options={[
          { key: 'logout', label: t('profile.logout'), value: 'logout' },
        ]}
        onSelect={handleLogoutSelect}
        onCancel={() => setShowLogoutSelector(false)}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
  },
  section: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  rowLabel: {
    fontSize: 17,
  },
  rowValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 17,
    marginRight: 5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 15,
  },
  logoutButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  deleteProfileText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ProfileScreen; 