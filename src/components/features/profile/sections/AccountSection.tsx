import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, useI18n } from "@/hooks";

interface AccountSectionProps {
  onLogoutPress: () => void;
  onDeleteProfile: () => void;
}

export default function AccountSection({
  onLogoutPress,
  onDeleteProfile,
}: AccountSectionProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.surface }]}
        onPress={onLogoutPress}
      >
        <Text style={[styles.logoutButtonText, { color: colors.danger }]}>
          {t("profile.logout")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDeleteProfile}>
        <Text style={[styles.deleteProfileText, { color: colors.danger }]}>
          {t("profile.deleteProfile")}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  deleteProfileText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
});
