import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  ModalPrimaryButton,
  ModalTextField,
  useInvalidShake,
} from "@/components/Modal";
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
  const { animatedStyle, shake } = useInvalidShake();

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
      shake("edit-name-input");
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

  return (
    <Modal visible={visible} onClose={onClose} title={t("profile.changeName")}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios" || Platform.OS === "web" ? "padding" : undefined
        }
      >
        <View style={styles.body}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-outline" size={64} color={colors.primary} />
          </View>

          <Animated.View style={animatedStyle("edit-name-input")}>
            <ModalTextField
              placeholder={t("profile.name")}
              value={localName}
              onChangeText={(text) => {
                setLocalName(text);
                setValidationError(null);
              }}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
            />
          </Animated.View>

          {validationError ? (
            <Text style={[styles.validationError, { color: colors.danger }]}>
              {validationError}
            </Text>
          ) : null}

          <ModalPrimaryButton
            label={saving ? t("common.loading") : t("profile.save")}
            onPress={handleSave}
            disabled={saving}
            loading={saving}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
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
  validationError: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
});
