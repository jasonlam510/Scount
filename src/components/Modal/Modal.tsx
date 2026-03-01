import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type TextInputProps,
  type ViewStyle,
  type ModalProps as RNModalProps,
} from "react-native";
import { useI18n, useTheme } from "@/hooks";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  headerTopPadding?: number;
  headerBottomPadding?: number;
  cancelLabel?: string;
  animationType?: RNModalProps["animationType"];
  presentationStyle?: RNModalProps["presentationStyle"];
}

export interface ModalPrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface ModalSectionTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface ModalCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface ModalRowProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export interface ModalDividerProps {
  style?: StyleProp<ViewStyle>;
}

export interface ModalTextFieldProps extends TextInputProps {
  variant?: "default" | "form" | "search";
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  containerStyle,
  bodyStyle,
  titleStyle,
  headerTopPadding = 12,
  headerBottomPadding = 12,
  cancelLabel,
  animationType = "slide",
  presentationStyle = "pageSheet",
}: ModalProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const resolvedCancelLabel = cancelLabel || t("common.cancel");

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
          containerStyle,
        ]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              paddingTop: headerTopPadding,
              paddingBottom: headerBottomPadding,
            },
          ]}
        >
          <Pressable onPress={onClose} style={styles.cancelButton} hitSlop={8}>
            <Text style={[styles.cancelText, { color: colors.primary }]}>
              {resolvedCancelLabel}
            </Text>
          </Pressable>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: colors.text }, titleStyle]}>
              {title}
            </Text>
          </View>
          <View style={styles.cancelButtonMirror} pointerEvents="none">
            <Text style={[styles.cancelText, styles.hiddenText]}>
              {resolvedCancelLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.body, bodyStyle]}>{children}</View>
      </View>
    </RNModal>
  );
}

export function ModalSectionTitle({ children, style }: ModalSectionTitleProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.sectionTitle, { color: colors.text }, style]}>
      {children}
    </Text>
  );
}

export function ModalCard({ children, style }: ModalCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.searchBarBackground,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function ModalRow({
  children,
  onPress,
  style,
  pressedStyle,
  disabled = false,
}: ModalRowProps) {
  if (!onPress) {
    return <View style={[styles.row, style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        style,
        pressed && styles.rowPressed,
        pressed && pressedStyle,
      ]}
    >
      {children}
    </Pressable>
  );
}

export function ModalDivider({ style }: ModalDividerProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: colors.border }, style]} />
  );
}

export function ModalTextField({
  variant = "default",
  containerStyle,
  inputStyle,
  placeholderTextColor,
  ...inputProps
}: ModalTextFieldProps) {
  const { colors } = useTheme();
  const isForm = variant === "form";
  const isSearch = variant === "search";

  return (
    <View
      style={[
        styles.textFieldContainer,
        isForm && styles.textFieldContainerForm,
        isSearch && styles.textFieldContainerSearch,
        {
          backgroundColor: colors.searchBarBackground,
          borderColor: colors.searchBarBackground,
        },
        containerStyle,
      ]}
    >
      <TextInput
        {...inputProps}
        style={[
          styles.textFieldInput,
          isSearch && styles.textFieldInputSearch,
          { color: colors.text },
          inputStyle,
        ]}
        placeholderTextColor={placeholderTextColor || colors.textSecondary}
      />
    </View>
  );
}

export function ModalPrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}: ModalPrimaryButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: colors.primary },
        (pressed || disabled || loading) && styles.primaryButtonPressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.primaryButtonText}>{label}</Text>
      )}
    </Pressable>
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
  cancelButton: {
    marginRight: 16,
  },
  cancelButtonMirror: {
    marginLeft: 16,
  },
  cancelText: {
    fontSize: 17,
  },
  hiddenText: {
    opacity: 0,
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
  body: {
    flex: 1,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
  primaryButtonPressed: {
    opacity: 0.72,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 14,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: {
    opacity: 0.72,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 14,
  },
  textFieldContainer: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
  },
  textFieldInput: {
    fontSize: 17,
  },
  textFieldContainerForm: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  textFieldContainerSearch: {
    height: 36,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  textFieldInputSearch: {
    fontSize: 16,
  },
});
