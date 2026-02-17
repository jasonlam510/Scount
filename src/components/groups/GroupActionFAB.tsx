import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useI18n, useTheme } from "@/hooks";
import FloatingActionButton from "@/components/FloatingActionButton";
import BottomSheet from "@/components/BottomSheet";

const ActionItem: React.FC<{
  icon: keyof typeof Entypo.glyphMap;
  color: string;
  bgColor: string;
  title: string;
  subtext: string;
  onPress: () => void;
  isLast?: boolean;
}> = ({ icon, color, bgColor, title, subtext, onPress, isLast }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.item,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
        <Entypo name={icon} size={24} color={color} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.itemSubtext, { color: colors.textSecondary }]}>
          {subtext}
        </Text>
      </View>
      <Entypo name="chevron-right" size={20} color={colors.border} />
    </TouchableOpacity>
  );
};

const GroupActionFAB: React.FC = () => {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleAction = (type: "create" | "join") => {
    setIsMenuVisible(false);
    // TODO: Navigation logic will be added later in the app screen
    console.log(`Group action triggered: ${type}`);
  };

  return (
    <>
      <FloatingActionButton
        icon="add"
        label={t("group.add")}
        onPress={() => setIsMenuVisible(true)}
      />

      <BottomSheet
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      >
        <View
          style={[styles.menuContainer, { backgroundColor: colors.surface }]}
        >
          <ActionItem
            icon="plus"
            color={colors.primary}
            bgColor={colors.primary + "20"} // 12% opacity roughly
            title={t("group.startGroup")}
            subtext={t("group.startGroupDesc")}
            onPress={() => handleAction("create")}
          />
          <ActionItem
            icon="link"
            color={colors.success}
            bgColor={colors.success + "20"}
            title={t("group.joinGroup")}
            subtext={t("group.joinGroupDesc")}
            onPress={() => handleAction("join")}
            isLast
          />
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
