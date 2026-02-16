import React, { useEffect, useRef } from "react";
import { StyleSheet, Pressable, Animated } from "react-native";
import { useTheme } from "@/hooks";

export interface ThemedSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

/** iOS-style dimensions: track 51×31, thumb 27 (snug inside track). */
const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const TRACK_RADIUS = TRACK_HEIGHT / 2;
const THUMB_OFFSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;

const THUMB_LEFT_OFF = THUMB_OFFSET;
const THUMB_LEFT_ON = TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET;

const THUMB_ANIM_DURATION = 200;

const webStyles = StyleSheet.create({
  track: {
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
});

/**
 * Themed Switch for web.
 * Custom switch with iOS proportions and thumb slide animation.
 */
export default function ThemedSwitch({
  value,
  onValueChange,
  disabled,
}: ThemedSwitchProps) {
  const { colors } = useTheme();

  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: THUMB_ANIM_DURATION,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#767577", colors.success],
  });

  const thumbColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f4f3f4", "#ffffff"],
  });

  const thumbLeft = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_LEFT_OFF, THUMB_LEFT_ON],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={[
        webStyles.track,
        {
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_RADIUS,
          opacity: disabled ? 0.5 : 1,
          overflow: "hidden",
        },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius: TRACK_RADIUS,
            backgroundColor: trackColor,
          },
        ]}
      />
      <Animated.View
        style={[
          webStyles.thumb,
          {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: thumbColor,
            left: thumbLeft,
            top: THUMB_OFFSET,
          },
        ]}
      />
    </Pressable>
  );
}
