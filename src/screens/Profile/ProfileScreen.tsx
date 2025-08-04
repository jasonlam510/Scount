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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useI18n } from '../../hooks';
import { useUser } from '../../hooks/database';
import { useSettings } from '../../contexts/SettingsContext';
import FloatingActionButton from '../../components/FloatingActionButton';
import Selector from '../../components/Selector';

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { 
    currentUserUuid, 
    setCurrentUserUuid, 
    clearCurrentUserUuid,
    notificationsEnabled, 
    setNotificationsEnabled,
    isLoading: settingsLoading 
  } = useSettings();
  
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Create stable filters object
  const userFilters = useMemo(() => {
    return currentUserUuid ? { uuid: currentUserUuid } : {}
  }, [currentUserUuid])

  // Use generic user hook with UUID
  const { users, isLoading: userLoading, error: userError } = useUser(
    userFilters,
    {
      enabled: !!currentUserUuid,
      onSuccess: useCallback((data: any[]) => {
        if (data.length > 0) {
          console.log('Current user loaded:', data[0].name);
        }
      }, []),
      onError: useCallback((error: string) => console.error('Error loading user:', error), [])
    }
  );

  const userData = users[0] || null;

  // Handlers for navigation/actions
  const handleEditName = () => {
    Alert.alert('Edit Name', 'Navigate to screen to edit user name.');
    // In a real app: navigation.navigate('EditNameScreen');
  };

  const handleEditNickname = () => {
    Alert.alert('Edit Nickname', 'Navigate to screen to edit public nickname.');
    // In a real app: navigation.navigate('EditNicknameScreen');
  };

  const getCurrentLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'en': return 'English';
      case 'zh': return '繁體中文';
      default: return 'English';
    }
  };

  const handleLanguagePress = () => {
    setShowLanguageSelector(true);
  };

  const handleLanguageSelect = (language: string) => {
    changeLanguage(language);
    setShowLanguageSelector(false);
  };

  const handleThemePress = () => {
    setShowThemeSelector(true);
  };

  const handleThemeSelect = (mode: string) => {
    setThemeMode(mode as 'light' | 'dark' | 'automatic');
    setShowThemeSelector(false);
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Log Out', 
        onPress: async () => {
          try {
            await clearCurrentUserUuid();
            console.log('User logged out');
            // In a real app, you might navigate to login screen
          } catch (error) {
            console.error('Failed to logout:', error);
          }
        } 
      },
    ]);
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

  // Show loading state if settings are still loading
  if (settingsLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        {/* Header */}
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>

        {/* User Information Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {/* Profile Photo and User Info */}
          <View style={styles.profileHeader}>
            <View style={styles.profilePhotoContainer}>
              <Image
                source={{ 
                  uri: userData?.avatar || 'https://via.placeholder.com/80x80?text=User'
                }}
                style={styles.profilePhoto}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {userData?.name || (userLoading ? 'Loading...' : 'No user found')}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {userData?.email || (userLoading ? 'Loading...' : 'No email')}
              </Text>
            </View>
          </View>
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          {/* Editable Name */}
          <TouchableOpacity style={styles.row} onPress={handleEditName}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('profile.name')}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
                {userData?.name || (userLoading ? 'Loading...' : 'No name')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          {/* Editable Public Nickname */}
          <TouchableOpacity style={styles.row} onPress={handleEditNickname}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('profile.publicNickname')}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
                {userData?.nickname || (userLoading ? 'Loading...' : 'No nickname')}
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
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
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
});

export default ProfileScreen; 