import React from "react";
import { View, StyleSheet } from "react-native";
import { Alert } from "@/components";
import { useTheme } from "@/hooks";
import { GroupListSection, GroupActionFAB } from "@/components/groups";
import { useUserGroupsRealtime } from "@/powersync/hooks/useUserGroups";
import { Group } from "@/types/groups";

export default function GroupScreen() {
  const { colors } = useTheme();
  const { groups, isLoading, error } = useUserGroupsRealtime();

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Group List Section */}
      <GroupListSection
        groups={groups}
        isLoading={isLoading}
        onGroupPress={handleGroupPress}
      />

      {/* Group Action FAB (Start/Join) */}
      <GroupActionFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
