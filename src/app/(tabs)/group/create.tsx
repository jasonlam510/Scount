import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks";
import { useI18n } from "@/hooks/useI18n";
import CurrencyQuickMenu from "@/components/currency/CurrencyQuickMenu";
import CurrencySelectorModal from "@/components/currency/CurrencySelectorModal";
import { getCurrencySymbol } from "@/utils/currency";

export default function CreateGroupScreen() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState("");
  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [selectorModalVisible, setSelectorModalVisible] = useState(false);

  const symbol = getCurrencySymbol(currencyCode || "USD");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
        >
          {Platform.OS === "web" ? (
            <Text style={{ color: colors.primary, fontSize: 24 }}>←</Text>
          ) : (
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          )}
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("group.startGroup")}
        </Text>
      </View>
      {/* Form */}
      <View style={styles.form}>
        {/* Name field */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t("group.createName")}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder={t("group.createNamePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Currency field */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t("group.createCurrency")}
        </Text>
        <CurrencyQuickMenu
          value={currencyCode}
          onChange={(code) => setCurrencyCode(code)}
          onOpenFullSelector={() => setSelectorModalVisible(true)}
        >
          <Pressable
            style={({ pressed }) => [
              styles.currencyRow,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.currencyRowPressed,
            ]}
          >
            <Text style={[styles.currencyDisplay, { color: colors.text }]}>
              {currencyCode
                ? `${symbol}`
                : t("group.createCurrencyPlaceholder")}
            </Text>
          </Pressable>
        </CurrencyQuickMenu>
      </View>

      {/* Currency selector modal */}
      <CurrencySelectorModal
        visible={selectorModalVisible}
        onClose={() => setSelectorModalVisible(false)}
        value={currencyCode}
        onSelect={(code) => setCurrencyCode(code)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  form: {
    paddingHorizontal: 20,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  currencyRow: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  currencyRowPressed: {
    opacity: 0.8,
  },
  currencyDisplay: {
    fontSize: 16,
  },
});
