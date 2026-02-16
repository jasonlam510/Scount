import React, { useEffect, useRef, useState } from "react";
// @ts-expect-error - createPortal from react-dom; types from @types/react-dom if present
import { createPortal } from "react-dom";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { useTheme } from "@/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ActionSheetProps {
  visible: boolean;
  title: string;
  options: string[];
  cancelButtonIndex: number;
  onSelect: (buttonIndex: number) => void;
  selectedIndex?: number;
}

/**
 * ActionSheet for web: matches iOS behavior from React Native source.
 *
 * RN uses RCTActionSheetManager → UIAlertController(UIAlertControllerStyleActionSheet)
 * with presentViewController:animated:YES. On iPhone the system slides the sheet
 * up from the bottom, full-width with ~8–10pt side margin, Cancel separate at bottom.
 * See: facebook/react-native Libraries/ActionSheetIOS/RCTActionSheetManager.m
 *
 * - Title: grey (secondary); options: tint/primary (blue); single Cancel at bottom.
 * - Excludes cancel from the option list so only one Cancel is shown (iOS does this in UI).
 */
export default function ActionSheet({
  visible,
  title,
  options,
  cancelButtonIndex,
  onSelect,
  selectedIndex,
}: ActionSheetProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(300)).current;
  const openedAtRef = useRef(0);
  const [portalReady, setPortalReady] = useState(false);

  const overlayPosition =
    Platform.OS === "web"
      ? ({ position: "fixed" } as unknown as Record<string, unknown>)
      : {};

  useEffect(() => {
    if (!visible) {
      setPortalReady(false);
      return;
    }
    openedAtRef.current = Date.now();
    const frameId = requestAnimationFrame(() => setPortalReady(true));
    return () => cancelAnimationFrame(frameId);
  }, [visible]);

  useEffect(() => {
    if (visible && portalReady) {
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(300);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
      ]).start();
    }
  }, [visible, portalReady, overlayOpacity, sheetTranslateY]);

  const handleBackdropPress = () => {
    if (Date.now() - openedAtRef.current < 200) return;
    onSelect(cancelButtonIndex);
  };

  if (!visible) return null;
  if (Platform.OS === "web" && !portalReady) return null;

  const actionOptions = options
    .map((label, index) => ({ label, index }))
    .filter(({ index }) => index !== cancelButtonIndex);

  const overlayContent = (
    <Animated.View
      style={[
        styles.overlay,
        overlayPosition,
        {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          opacity: overlayOpacity,
          paddingBottom: insets.bottom + 8,
        },
      ]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleBackdropPress}
      />
      <Animated.View
        style={[
          styles.sheetsWrapper,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
      >
        {/* First block: title + options (5% transparent + backdrop blur) */}
        <View
          style={[
            styles.optionsSheet,
            {
              backgroundColor: isDark
                ? "rgba(28, 28, 30, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              ...(Platform.OS === "web"
                ? {
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }
                : {}),
            } as Record<string, unknown>,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: isDark ? "rgba(255, 255, 255, 0.55)" : "#8e8e93",
              },
            ]}
          >
            {title}
          </Text>
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
          <View style={styles.optionsBlock}>
            {actionOptions.map(({ label, index }, i) => (
              <React.Fragment key={index}>
                {i > 0 && (
                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
                <TouchableOpacity
                  style={styles.optionTouchable}
                  activeOpacity={0.7}
                  onPress={() => onSelect(index)}
                >
                  <Text style={[styles.optionText, { color: colors.primary }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Gap (transparent; overlay shows through) */}
        <View style={[styles.gap, { backgroundColor: "transparent" }]} />

        {/* Second block: Cancel in its own rounded sheet */}
        <TouchableOpacity
          style={[
            styles.cancelSheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: Math.max(14, insets.bottom + 4),
            },
          ]}
          activeOpacity={0.7}
          onPress={() => onSelect(cancelButtonIndex)}
        >
          <Text style={[styles.cancelText, { color: colors.primary }]}>
            {options[cancelButtonIndex]}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  if (Platform.OS === "web" && typeof document !== "undefined" && portalReady) {
    return createPortal(overlayContent, document.body);
  }
  return overlayContent;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10000,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  sheetsWrapper: {
    width: "100%",
    maxWidth: 400,
    zIndex: 1,
  },
  optionsSheet: {
    width: "100%",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  optionsBlock: {
    overflow: "hidden",
  },
  optionTouchable: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  optionText: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
  },
  gap: {
    height: 8,
  },
  cancelSheet: {
    width: "100%",
    borderRadius: 14,
    paddingTop: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});
