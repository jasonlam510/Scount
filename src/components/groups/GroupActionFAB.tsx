import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useI18n, useTheme } from "@/hooks";
import FloatingActionButton from "@/components/FloatingActionButton";
import BottomSheet from "@/components/BottomSheet";

export interface GroupActionFABItemConfig {
  icon: keyof typeof Entypo.glyphMap;
  iconBackgroundColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  iconColor?: string;
}

interface GroupActionFABProps {
  actions: GroupActionFABItemConfig[];
}

const ActionItem: React.FC<{
  icon: keyof typeof Entypo.glyphMap;
  color: string;
  bgColor: string;
  title: string;
  subtext: string;
  onPress: () => void;
  showDivider?: boolean;
}> = ({ icon, color, bgColor, title, subtext, onPress, showDivider }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.item,
        showDivider && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Action icon */}
      <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
        <Entypo name={icon} size={24} color={color} />
      </View>

      {/* Action copy */}
      <View style={styles.textWrapper}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.itemSubtext, { color: colors.textSecondary }]}>
          {subtext}
        </Text>
      </View>

      {/* Row affordance */}
      <Entypo name="chevron-right" size={20} color={colors.border} />
    </TouchableOpacity>
  );
};

const GroupActionFAB: React.FC<GroupActionFABProps> = ({ actions }) => {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [pendingActionIndex, setPendingActionIndex] = useState<number | null>(
    null,
  );

  const handleAction = (index: number) => {
    setPendingActionIndex(index);
    setIsMenuVisible(false);
  };

  const handleMenuDismiss = () => {
    if (pendingActionIndex === null) return;
    const action = actions[pendingActionIndex];
    setPendingActionIndex(null);
    action?.onPress();
  };

  return (
    <>
      {/* FAB trigger */}
      <FloatingActionButton
        icon="add"
        label={t("group.add")}
        onPress={() => {
          if (actions.length > 0) {
            setIsMenuVisible(true);
          }
        }}
      />

      {/* Action menu */}
      <BottomSheet
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onDismiss={handleMenuDismiss}
      >
        {/* Action list */}
        <View
          style={[styles.menuContainer, { backgroundColor: colors.surface }]}
        >
          {actions.map((action, index) => (
            <ActionItem
              key={`${action.title}-${index}`}
              icon={action.icon}
              color={action.iconColor || colors.primary}
              bgColor={action.iconBackgroundColor}
              title={action.title}
              subtext={action.subtitle}
              onPress={() => handleAction(index)}
              showDivider={index < actions.length - 1}
            />
          ))}
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemSubtext: {
    fontSize: 13,
  },
});

export default GroupActionFAB;
