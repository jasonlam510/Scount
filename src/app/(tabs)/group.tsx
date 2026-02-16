import React from "react";
import { View, StyleSheet } from "react-native";
import { Alert } from "@/components";
import { useTheme, useI18n } from "@/hooks";
import { GroupListSection } from "@/components/features/groups";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useUserGroupsRealtime } from "@/powersync/hooks/useUserGroups";
import { Group } from "@/types/groups";

export default function GroupScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
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

  const handleCreateGroup = () => {
    Alert.alert("Create Group", "Navigate to create group screen");
    // TODO: Implement create group navigation
    // router.push('/create-group');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Group List Section */}
      <GroupListSection
        groups={groups}
        isLoading={isLoading}
        onGroupPress={handleGroupPress}
      />

      {/* Floating Action Button for Group */}
      <FloatingActionButton
        icon="people"
        label={t("group.addGroupExpense")}
        onPress={handleCreateGroup}
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
