import React, { useEffect, useRef } from "react";
import { Platform, ActionSheetIOS } from "react-native";
import Selector from "@/components/Selector";

export interface ActionSheetProps {
  visible: boolean;
  title: string;
  options: string[];
  cancelButtonIndex: number;
  onSelect: (buttonIndex: number) => void;
  /** Optional: index of the currently selected option (web shows it in blue, others in default text; native ignores). */
  selectedIndex?: number;
}

/**
 * ActionSheet for native: iOS uses ActionSheetIOS, Android uses Selector.
 */
export default function ActionSheet({
  visible,
  title,
  options,
  cancelButtonIndex,
  onSelect,
}: ActionSheetProps) {
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      hasShownRef.current = false;
      return;
    }
    if (Platform.OS === "ios") {
      if (hasShownRef.current) return;
      hasShownRef.current = true;
      ActionSheetIOS.showActionSheetWithOptions(
        { title, options, cancelButtonIndex },
        (buttonIndex) => {
          onSelect(buttonIndex);
        },
      );
    }
  }, [visible, title, options, cancelButtonIndex, onSelect]);

  if (Platform.OS !== "android") {
    return null;
  }

  const selectorOptions = options.map((label, i) => ({
    key: String(i),
    label,
    value: String(i),
  }));

  return (
    <Selector
      visible={visible}
      title={title}
      options={selectorOptions}
      onSelect={(value) => onSelect(parseInt(value, 10))}
      onCancel={() => onSelect(cancelButtonIndex)}
    />
  );
}
