import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, ActionSheetIOS } from "react-native";
import { useTheme, useI18n, useAppSettings } from "@/hooks";
import Selector from "@/components/Selector";
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

  // Platform-specific handlers
  const handleLanguagePress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["English", "繁體中文", "Cancel"],
          cancelButtonIndex: 2,
          title: t("profile.language"),
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onLanguageChange("en");
          } else if (buttonIndex === 1) {
            onLanguageChange("zh");
          }
        },
      );
    } else {
      setShowLanguageSelector(true);
    }
  };

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language);
    setShowLanguageSelector(false);
  };

  const handleThemePress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            t("common.light"),
            t("common.dark"),
            t("common.automatic"),
            "Cancel",
          ],
          cancelButtonIndex: 3,
          title: t("profile.theme"),
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onThemeChange("light");
          } else if (buttonIndex === 1) {
            onThemeChange("dark");
          } else if (buttonIndex === 2) {
            onThemeChange("automatic");
          }
        },
      );
    } else {
      setShowThemeSelector(true);
    }
  };

  const handleThemeSelect = (mode: string) => {
    onThemeChange(mode as "light" | "dark" | "automatic");
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

      {/* Language Selector */}
      <Selector
        visible={showLanguageSelector}
        title={t("profile.language")}
        options={[
          { key: "en", label: "English", value: "en" },
          { key: "zh", label: "繁體中文", value: "zh" },
        ]}
        onSelect={handleLanguageSelect}
        onCancel={() => setShowLanguageSelector(false)}
      />

      {/* Theme Selector */}
      <Selector
        visible={showThemeSelector}
        title={t("profile.theme")}
        options={[
          { key: "light", label: t("common.light"), value: "light" },
          { key: "dark", label: t("common.dark"), value: "dark" },
          {
            key: "automatic",
            label: t("common.automatic"),
            value: "automatic",
          },
        ]}
        onSelect={handleThemeSelect}
        onCancel={() => setShowThemeSelector(false)}
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
