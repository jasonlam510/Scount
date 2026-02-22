import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, useI18n } from "@/hooks";
import ProfileHeader from "../components/ProfileHeader";
import EditableRow from "../components/EditableRow";
import EditNameModal from "../EditNameModal";

interface ProfileSectionProps {
  profileName?: string | null;
  userEmail?: string | null;
  profileAvatar?: string | null;
  profileLoading?: boolean;
  onPhotoSelected: (source: "camera" | "library") => void;
  onSaveName: (name: string) => Promise<void>;
}

export default function ProfileSection({
  profileName,
  userEmail,
  profileAvatar,
  profileLoading,
  onPhotoSelected,
  onSaveName,
}: ProfileSectionProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [showEditNameModal, setShowEditNameModal] = useState(false);

  const handleNameRowPress = () => setShowEditNameModal(true);
  const handleModalClose = () => setShowEditNameModal(false);

  const handleSaveName = async (name: string) => {
    await onSaveName(name);
    setShowEditNameModal(false);
  };

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      {/* Profile Header */}
      <ProfileHeader
        profileName={profileName}
        userEmail={userEmail}
        profileAvatar={profileAvatar}
        profileLoading={profileLoading}
        onPhotoSelected={onPhotoSelected}
      />

      {/* Separator */}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />

      {/* Name Row */}
      <EditableRow
        label={t("profile.name")}
        value={profileLoading ? t("common.loading") : profileName}
        onPress={handleNameRowPress}
      />

      {/* Edit Name Modal */}
      <EditNameModal
        visible={showEditNameModal}
        currentName={profileName ?? ""}
        onClose={handleModalClose}
        onSave={handleSaveName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 15,
  },
});
