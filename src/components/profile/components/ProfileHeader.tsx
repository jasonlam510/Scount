import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTheme, useI18n } from "@/hooks";
import { ActionSheet } from "@/components";

interface ProfileHeaderProps {
  profileName?: string | null;
  userEmail?: string | null;
  profileAvatar?: string | null;
  profileLoading?: boolean;
  onPhotoSelected: (source: "camera" | "library") => void;
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
  const [showPhotoActionSheet, setShowPhotoActionSheet] = useState(false);

  const handleEditPhoto = () => setShowPhotoActionSheet(true);

  const handlePhotoSelect = (buttonIndex: number) => {
    if (buttonIndex === 0) {
      onPhotoSelected("camera");
    } else if (buttonIndex === 1) {
      onPhotoSelected("library");
    }
    setShowPhotoActionSheet(false);
  };

  return (
    <>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.profilePhotoContainer}
          onPress={handleEditPhoto}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri:
                profileAvatar && profileAvatar.trim() !== ""
                  ? profileAvatar
                  : "https://via.placeholder.com/80x80?text=User",
            }}
            style={styles.profilePhoto}
            onError={() => {
              console.log("Profile image failed to load, using placeholder");
            }}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {profileLoading ? t("common.loading") : profileName}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {userEmail}
          </Text>
        </View>
      </View>

      {/* Photo ActionSheet */}
      <ActionSheet
        visible={showPhotoActionSheet}
        title={t("profile.editPhoto")}
        options={[
          t("profile.camera"),
          t("profile.photoLibrary"),
          t("common.cancel"),
        ]}
        cancelButtonIndex={2}
        onSelect={handlePhotoSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
});
