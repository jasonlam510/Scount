import React, { useState } from 'react';
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
import { useTheme } from '../../context/ThemeContext';

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  // Local state for user data and preferences
  const [userName, setUserName] = useState('Jason Lam');
  const [publicNickname, setPublicNickname] = useState('Jason Lam');
  const [userEmail, setUserEmail] = useState('jasonlamufo@gmail.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  // Handlers for navigation/actions
  const handleEditName = () => {
    Alert.alert('Edit Name', 'Navigate to screen to edit user name.');
    // In a real app: navigation.navigate('EditNameScreen');
  };

  const handleEditNickname = () => {
    Alert.alert('Edit Nickname', 'Navigate to screen to edit public nickname.');
    // In a real app: navigation.navigate('EditNicknameScreen');
  };

  const handleLanguagePress = () => {
    Alert.alert('Language Settings', 'Navigate to language selection screen.');
    // In a real app: navigation.navigate('LanguageSettingsScreen');
  };

  const handleThemePress = () => {
    if (Platform.OS === 'web') {
      setShowThemeSelector(true);
    } else {
      Alert.alert(
        'Theme',
        'Choose your theme preference',
        [
          { text: 'Light', onPress: () => setThemeMode('light') },
          { text: 'Dark', onPress: () => setThemeMode('dark') },
          { text: 'Automatic', onPress: () => setThemeMode('automatic') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleThemeSelect = (mode: 'light' | 'dark' | 'automatic') => {
    setThemeMode(mode);
    setShowThemeSelector(false);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', onPress: () => console.log('User logged out') },
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
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'automatic': return 'Automatic';
      default: return 'Automatic';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        {/* Header */}
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>

        {/* User Information Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {/* Profile Photo and User Info */}
          <View style={styles.profileHeader}>
            <View style={styles.profilePhotoContainer}>
              <Image
                source={{ uri: 'https://avatars.githubusercontent.com/jasonlam510' }}
                style={styles.profilePhoto}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>
            </View>
          </View>
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          {/* Editable Name */}
          <TouchableOpacity style={styles.row} onPress={handleEditName}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Name</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{userName}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          {/* Editable Public Nickname */}
          <TouchableOpacity style={styles.row} onPress={handleEditNickname}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Public Nickname</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{publicNickname}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Preferences</Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Notifications</Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.success }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.row} onPress={handleLanguagePress}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Language</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{language}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.row} onPress={handleThemePress}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Theme</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{getThemeModeDisplayText()}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
          <Text style={[styles.logoutButtonText, { color: colors.danger }]}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteProfile}>
          <Text style={[styles.deleteProfileText, { color: colors.danger }]}>Delete Profile</Text>
        </TouchableOpacity>

        {/* Support Center */}
        <TouchableOpacity style={styles.supportCenter} onPress={handleSupportCenter}>
          <View style={[styles.supportIconContainer, { backgroundColor: colors.success }]}>
            <Ionicons name="chatbubble" size={30} color="white" />
          </View>
          <Text style={[styles.supportText, { color: colors.text }]}>Support Center</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Theme Selector Modal for Web */}
      {showThemeSelector && Platform.OS === 'web' && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Theme</Text>
            <TouchableOpacity 
              style={[styles.themeOption, { borderBottomColor: colors.border }]} 
              onPress={() => handleThemeSelect('light')}
            >
              <Text style={[styles.themeOptionText, { color: colors.text }]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeOption, { borderBottomColor: colors.border }]} 
              onPress={() => handleThemeSelect('dark')}
            >
              <Text style={[styles.themeOptionText, { color: colors.text }]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.themeOption} 
              onPress={() => handleThemeSelect('automatic')}
            >
              <Text style={[styles.themeOptionText, { color: colors.text }]}>Automatic</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.border }]} 
              onPress={() => setShowThemeSelector(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
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
  supportCenter: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  supportIconContainer: {
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  supportText: {
    fontSize: 15,
  },
  // Modal styles for web
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    minWidth: 250,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  themeOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  themeOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 