import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Dimensions,
  Modal,
  PanResponder,
} from "react-native";
import { useTheme } from "@/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(visible);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // PanResponder to handle pull down to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical drags downwards
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging downwards (positive dy)
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
          // Also fade out backdrop slightly as user pulls down
          const newOpacity = 1 - gestureState.dy / (SCREEN_HEIGHT * 0.5);
          backdropOpacity.setValue(Math.max(0, newOpacity));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          // If dragged down enough or fast enough, close it
          onClose();
        } else {
          // Otherwise snap back to original position
          Animated.parallel([
            Animated.spring(sheetTranslateY, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      // Sequence: Background fade in, then sheet slides up
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Sequence: Sheet slides down, background fades out
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
            ]}
          />
        </Pressable>

        {/* Sheet Content */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: sheetTranslateY }],
              paddingBottom: Platform.OS === "ios" ? insets.bottom + 20 : 20,
            },
          ]}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.handle,
                { backgroundColor: isDark ? "#3A3A3C" : "#E5E5EA" },
              ]}
            />
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 500 : "100%",
    alignSelf: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    // Shadow for Android/iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    width: "100%",
  },
});

export default BottomSheet;
