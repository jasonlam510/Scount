import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActionSheet } from "@/components";
import { useTheme, useI18n, useAppSettings } from "@/hooks";
import SwitchRow from "../components/SwitchRow";
import SettingRow from "../components/SettingRow";

interface AppSettingsSectionProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  themeMode: "light" | "dark" | "automatic";
  onThemeChange: (mode: "light" | "dark" | "automatic") => void;
}

export default function AppSettingsSection({
  currentLanguage,
  onLanguageChange,
  themeMode,
  onThemeChange,
}: AppSettingsSectionProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { notificationsEnabled, setNotificationsEnabled } = useAppSettings();

  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const getCurrentLanguageDisplay = () => {
    switch (currentLanguage) {
      case "en":
        return "English";
      case "zh":
        return "繁體中文";
      default:
        return "English";
    }
  };

  const getThemeModeDisplayText = () => {
    switch (themeMode) {
      case "light":
        return t("common.light");
      case "dark":
        return t("common.dark");
      case "automatic":
        return t("common.automatic");
      default:
        return t("common.automatic");
    }
  };

  const handleLanguagePress = () => setShowLanguageSelector(true);

  const handleLanguageSelect = (buttonIndex: number) => {
    if (buttonIndex === 0) onLanguageChange("en");
    else if (buttonIndex === 1) onLanguageChange("zh");
    setShowLanguageSelector(false);
  };

  const handleThemePress = () => setShowThemeSelector(true);

  const handleThemeSelect = (buttonIndex: number) => {
    if (buttonIndex === 0) onThemeChange("light");
    else if (buttonIndex === 1) onThemeChange("dark");
    else if (buttonIndex === 2) onThemeChange("automatic");
    setShowThemeSelector(false);
  };

  return (
    <>
      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
        {t("profile.settings")}
      </Text>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <SwitchRow
          label={t("profile.notifications")}
          value={notificationsEnabled}
          onValueChange={async (value) => {
            try {
              await setNotificationsEnabled(value);
            } catch (error) {
              console.error("Failed to save notifications setting:", error);
            }
          }}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          label={t("profile.language")}
          value={getCurrentLanguageDisplay()}
          onPress={handleLanguagePress}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          label={t("profile.theme")}
          value={getThemeModeDisplayText()}
          onPress={handleThemePress}
        />
      </View>

      {/* Language ActionSheet */}
      <ActionSheet
        visible={showLanguageSelector}
        title={t("profile.language")}
        options={["English", "繁體中文", "Cancel"]}
        cancelButtonIndex={2}
        selectedIndex={currentLanguage === "en" ? 0 : 1}
        onSelect={handleLanguageSelect}
      />

      {/* Theme ActionSheet */}
      <ActionSheet
        visible={showThemeSelector}
        title={t("profile.theme")}
        options={[
          t("common.light"),
          t("common.dark"),
          t("common.automatic"),
          "Cancel",
        ]}
        cancelButtonIndex={3}
        selectedIndex={themeMode === "light" ? 0 : themeMode === "dark" ? 1 : 2}
        onSelect={handleThemeSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
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
