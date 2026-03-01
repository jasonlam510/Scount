import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Alert } from "@/components";
import { useI18n, useTheme } from "@/hooks";
import {
  GroupListSection,
  GroupActionFAB,
  GroupActionFABItemConfig,
  CreateGroupModal,
} from "@/components/groups";
import { useUserGroupsRealtime } from "@/powersync/hooks/useUserGroups";
import { Group } from "@/types/groups";

export default function GroupScreen() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { groups, isLoading, error } = useUserGroupsRealtime();
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  if (isLoading) {
    console.log("Loading groups... [GroupScreen]");
  }
  if (error) {
    console.log("Failed to load groups:", error.message);
  }

  const handleGroupPress = (group: Group) => {
    // Navigate to group detail page using Expo Router
    Alert.alert("Navigate", `Going to ${group.title} group page`);
    // TODO: Implement group detail navigation
    // router.push(`/group/${group.id}`);
  };

  const actionConfigs: GroupActionFABItemConfig[] = [
    {
      icon: "plus",
      iconBackgroundColor: colors.primary + "20",
      iconColor: colors.primary,
      title: t("group.startGroup"),
      subtitle: t("group.startGroupDesc"),
      onPress: () => setIsCreateVisible(true),
    },
    {
      icon: "link",
      iconBackgroundColor: colors.success + "20",
      iconColor: colors.success,
      title: t("group.joinGroup"),
      subtitle: t("group.joinGroupDesc"),
      onPress: () => {
        // TODO: Join group flow
        console.log("Join group");
      },
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Group List Section */}
      <GroupListSection
        groups={groups}
        isLoading={isLoading}
        onGroupPress={handleGroupPress}
      />

      {/* Group Action FAB (Start/Join) */}
      <GroupActionFAB actions={actionConfigs} />

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={isCreateVisible}
        onClose={() => setIsCreateVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
