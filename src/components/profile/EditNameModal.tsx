import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useI18n } from "@/hooks";

export interface EditNameModalProps {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

export default function EditNameModal({
  visible,
  currentName,
  onClose,
  onSave,
}: EditNameModalProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [localName, setLocalName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setLocalName(currentName);
      setValidationError(null);
    }
  }, [visible, currentName]);

  const validate = (): string | null => {
    const trimmed = localName.trim();
    if (!trimmed) {
      return t("profile.nameRequired");
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setSaving(true);
    setValidationError(null);
    try {
      await onSave(localName.trim());
      onClose();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      Alert.alert(t("common.error"), message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={
          Platform.OS === "ios" || Platform.OS === "web" ? "padding" : undefined
        }
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              paddingTop: 12,
              paddingBottom: 12,
            },
          ]}
        >
          <Pressable
            onPress={handleCancel}
            style={styles.backButton}
            hitSlop={8}
          >
            <Text style={{ color: colors.primary, fontSize: 17 }}>
              {t("common.cancel")}
            </Text>
          </Pressable>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("profile.changeName")}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-outline" size={64} color={colors.primary} />
          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.searchBarBackground,
                borderColor: colors.searchBarBackground,
                color: colors.text,
              },
            ]}
            placeholder={t("profile.name")}
            placeholderTextColor={colors.textSecondary}
            value={localName}
            onChangeText={(text) => {
              setLocalName(text);
              setValidationError(null);
            }}
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
          />

          {validationError ? (
            <Text style={[styles.validationError, { color: colors.danger }]}>
              {validationError}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: colors.primary,
                opacity: saving ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={styles.saveButtonText}>
              {saving ? t("common.loading") : t("profile.save")}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  },
  backButton: {
    marginRight: 16,
  },
  titleWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 76,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 17,
    marginBottom: 8,
  },
  validationError: {
    fontSize: 14,
    marginBottom: 12,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
});
