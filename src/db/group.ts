import { db } from "@/powersync";
import { generateUUID, getCurrentTimestamp } from "@/utils";

export interface CreateGroupParams {
  title: string;
  currency: string;
  participants: { display_name: string; user_id?: string | null }[];
}

export class GroupService {
  /**
   * @param params - Group title, currency, and initial participants
   * @returns The ID of the newly created group
   */
  static async createGroup(params: CreateGroupParams): Promise<string> {
    const groupId = generateUUID();
    const now = getCurrentTimestamp();

    await db.transaction().execute(async (transaction) => {
      // 1. Insert the group
      await transaction
        .insertInto("groups")
        .values({
          id: groupId,
          title: params.title,
          currency: params.currency,
          icon: "default",
          is_deleted: 0,
          created_at: now,
          updated_at: now,
        } as any)
        .execute();

      // 2. Insert the initial members in a single statement
      await transaction
        .insertInto("group_members")
        .values(
          params.participants.map(
            (p) =>
              ({
                id: generateUUID(),
                group_id: groupId,
                user_id: p.user_id || null,
                display_name: p.display_name,
                is_archived: 0,
                created_at: now,
                updated_at: now,
              }) as any,
          ),
        )
        .execute();
    });

    return groupId;
  }
}
