import React from "react";
import { useRouter } from "expo-router";
import CreateGroupModal from "@/components/groups/CreateGroupModal";

export default function CreateGroupScreen() {
  const router = useRouter();

  return <CreateGroupModal visible onClose={() => router.back()} />;
}
