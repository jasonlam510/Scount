import { useCallback, useMemo, useRef } from "react";
import { Animated, type ViewStyle } from "react-native";

interface InvalidShakeOptions {
  first?: number;
  second?: number;
  third?: number;
  fourth?: number;
  durationA?: number;
  durationB?: number;
  durationC?: number;
  durationD?: number;
  durationE?: number;
}

const DEFAULT_OPTIONS: Required<InvalidShakeOptions> = {
  first: -8,
  second: 8,
  third: -6,
  fourth: 6,
  durationA: 40,
  durationB: 60,
  durationC: 50,
  durationD: 50,
  durationE: 40,
};

export function useInvalidShake(options: InvalidShakeOptions = {}) {
  const config = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const shakeMapRef = useRef<Record<string, Animated.Value>>({});

  const getShakeValue = useCallback((key: string) => {
    if (!shakeMapRef.current[key]) {
      shakeMapRef.current[key] = new Animated.Value(0);
    }
    return shakeMapRef.current[key];
  }, []);

  const shake = useCallback(
    (key: string) => {
      const value = getShakeValue(key);
      value.setValue(0);
      Animated.sequence([
        Animated.timing(value, {
          toValue: config.first,
          duration: config.durationA,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: config.second,
          duration: config.durationB,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: config.third,
          duration: config.durationC,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: config.fourth,
          duration: config.durationD,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: config.durationE,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [config, getShakeValue],
  );

  const shakeMany = useCallback(
    (keys: string[]) => {
      keys.forEach((key) => shake(key));
    },
    [shake],
  );

  const clear = useCallback((key: string) => {
    delete shakeMapRef.current[key];
  }, []);

  const animatedStyle = useCallback(
    (key: string): { transform: ViewStyle["transform"] } => ({
      transform: [{ translateX: getShakeValue(key) }],
    }),
    [getShakeValue],
  );

  return {
    animatedStyle,
    shake,
    shakeMany,
    clear,
  };
}
