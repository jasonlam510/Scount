import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks";
import { db } from "@/powersync/SystemProvider";
import type { Profile } from "@/types/profiles";

export function useProfile() {
  const { currentUserUuid } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!currentUserUuid) return;
    try {
      setProfileLoading(true);
      const result = await db
        .selectFrom("profiles")
        .selectAll()
        .where("user_id", "=", currentUserUuid)
        .limit(1)
        .execute();

      if (result.length > 0) {
        const profileData = result[0];
        setProfile({
          user_id: profileData.user_id,
          name: profileData.name,
          avatar: profileData.avatar || "",
          created_at: profileData.created_at,
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }, [currentUserUuid]);

  const handleSaveName = useCallback(
    async (name: string) => {
      if (!currentUserUuid) return;
      await db
        .updateTable("profiles")
        .set({ name })
        .where("user_id", "=", currentUserUuid)
        .execute();
      await fetchProfile();
    },
    [currentUserUuid, fetchProfile],
  );

  useEffect(() => {
    if (!currentUserUuid) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    fetchProfile();
  }, [currentUserUuid, fetchProfile]);

  return { profile, profileLoading, handleSaveName };
}
