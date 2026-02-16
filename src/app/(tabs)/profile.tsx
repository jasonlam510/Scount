import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, useI18n, useUser } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { disconnectDatabase, db } from "@/powersync";
import { Profile } from "@/types/profiles";
import FloatingActionButton from "@/components/FloatingActionButton";
import Selector from "@/components/Selector";
import {
  ProfileSection,
  AppSettingsSection,
  AccountSection,
} from "@/components/features/profile";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { currentUserUuid, userEmail, clearUserData } = useUser();
  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showLogoutSelector, setShowLogoutSelector] = useState(false);

  // Handlers for navigation/actions
  const handleEditName = () => {
    Alert.alert("Edit Name", "Navigate to screen to edit user name.");
    // TODO: Navigate to edit name screen using Expo Router
    // router.push('/(stack)/edit-name');
  };

  const handlePhotoSelected = (source: "camera" | "library") => {
    if (source === "camera") {
      console.log("Open camera");
      // TODO: Open camera and update profile avatar
    } else if (source === "library") {
      console.log("Open photo library");
      // TODO: Open photo library and update profile avatar
    }
  };

  // Platform-specific logout handlers
  const handleLogoutPress = () => {
    if (Platform.OS === "ios") {
      // Native iOS ActionSheet (true bottom-up menu)
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t("profile.logout"), "Cancel"],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0, // Makes logout button red
          title: "Logout?",
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handleLogout(); // Execute actual logout
          }
          // buttonIndex === 1 is Cancel, do nothing
        },
      );
    } else {
      // Android: use custom selector
      setShowLogoutSelector(true);
    }
  };

  const handleLogoutSelect = (value: string) => {
    if (value === "logout") {
      handleLogout();
    }
    setShowLogoutSelector(false);
  };

  const handleLogout = async () => {
    try {
      // Disconnect PowerSync and clear local database
      await disconnectDatabase();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase logout error:", error);
      }

      // Clear local user data
      await clearUserData();
      console.log("User logged out");
      // The AuthContext will automatically handle the navigation back to login
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => console.log("Profile deleted") },
      ],
    );
  };

  const handleSupportCenter = () => {
    Alert.alert("Support Center", "Open support chat or contact page.");
    // TODO: Navigate to support screen using Expo Router
    // router.push('/(stack)/support');
  };

  // Fetch profile from PowerSync
  useEffect(() => {
    if (!currentUserUuid) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const result = await db
          .selectFrom("profiles")
          .selectAll()
          .where("user_id", "=", currentUserUuid)
          .limit(1)
          .execute();

        if (!isCancelled) {
          if (result.length > 0) {
            const profileData = result[0];
            setProfile({
              user_id: profileData.user_id,
              name: profileData.name,
              avatar: profileData.avatar || "",
              created_at: profileData.created_at,
            });
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("❌ Error fetching profile:", err);
        }
      } finally {
        if (!isCancelled) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isCancelled = true;
    };
  }, [currentUserUuid]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: colors.background },
        ]}
      >
        {/* Header */}
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("profile.title")}
        </Text>

        {/* User Information Section */}
        <ProfileSection
          profileName={profile?.name}
          userEmail={userEmail}
          profileAvatar={profile?.avatar}
          profileLoading={profileLoading}
          onPhotoSelected={handlePhotoSelected}
          onEditName={handleEditName}
        />

        {/* Preferences Section */}
        <AppSettingsSection
          currentLanguage={currentLanguage}
          onLanguageChange={changeLanguage}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
        />

        {/* Account Actions */}
        <AccountSection
          onLogoutPress={handleLogoutPress}
          onDeleteProfile={handleDeleteProfile}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button for Support Center */}
      <FloatingActionButton
        icon="chatbubble"
        label={t("profile.supportCenter")}
        backgroundColor={colors.success}
        onPress={handleSupportCenter}
      />

      {/* Logout Selector */}
      <Selector
        visible={showLogoutSelector}
        title="Logout?"
        options={[
          { key: "logout", label: t("profile.logout"), value: "logout" },
        ]}
        onSelect={handleLogoutSelect}
        onCancel={() => setShowLogoutSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15,
  },
});
