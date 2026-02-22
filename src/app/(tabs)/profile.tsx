import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Alert, ActionSheet } from "@/components";
import { useTheme, useI18n, useUser } from "@/hooks";
import { useProfile } from "@/powersync/hooks";
import { supabase } from "@/lib/supabase";
import { disconnectDatabase } from "@/powersync";
import FloatingActionButton from "@/components/FloatingActionButton";
import {
  ProfileSection,
  AppSettingsSection,
  AccountSection,
} from "@/components/profile";

export default function ProfileScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { userEmail, clearUserData } = useUser();
  const { profile, profileLoading, handleSaveName } = useProfile();
  const [showLogoutActionSheet, setShowLogoutActionSheet] = useState(false);

  const handlePhotoSelected = (source: "camera" | "library") => {
    if (source === "camera") {
      console.log("Open camera");
      // TODO: Open camera and update profile avatar
    } else if (source === "library") {
      console.log("Open photo library");
      // TODO: Open photo library and update profile avatar
    }
  };

  const handleLogoutPress = () => setShowLogoutActionSheet(true);

  const handleLogoutSelect = (buttonIndex: number) => {
    if (buttonIndex === 0) {
      handleLogout();
    }
    setShowLogoutActionSheet(false);
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
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
          onSaveName={handleSaveName}
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

      {/* Logout ActionSheet */}
      <ActionSheet
        visible={showLogoutActionSheet}
        title="Logout?"
        options={[t("profile.logout"), "Cancel"]}
        cancelButtonIndex={1}
        onSelect={handleLogoutSelect}
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
