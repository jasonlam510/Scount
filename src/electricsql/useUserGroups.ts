import { useEffect, useMemo, useState } from 'react';
import { useShape } from '@electric-sql/react';
import { getElectricShapeUrl, getElectricAuthParams } from './client';
import { useUser } from '../hooks/useUser';
import { Group } from '../types/groups';

interface UseUserGroupsResult {
  groups: Group[];
  isLoading: boolean;
  error: Error | null;
}

// Fetches all groups where the current user is a participant.
// Returns raw Group[]; you can extend to include participant if needed.
export const useUserGroups = (): UseUserGroupsResult => {
  const { currentUserUuid } = useUser();
  const [error, setError] = useState<Error | null>(null);

  const shapeParams = useMemo(() => {
    if (!currentUserUuid) return null;
    // Two-table shape: participants filtered by user, joined to groups by group_id = id
    return {
      table: 'participants',
      include: {
        groups: {
          on: {
            group_id: 'id',
          },
        },
      },
      where: {
        user_id: currentUserUuid,
      },
    } as const;
  }, [currentUserUuid]);

  // Per docs, shapes are single-table only. We'll subscribe to two shapes and join client-side.
  const participantsShape = useShape(
    currentUserUuid
      ? {
          url: getElectricShapeUrl(),
          params: {
            table: 'participants',
            where: `user_id = '${currentUserUuid}'`,
            ...getElectricAuthParams(),
          },
        }
      : { url: getElectricShapeUrl(), params: { table: 'participants', where: "user_id = 'no-user'", ...getElectricAuthParams() } }
  );

  const groupsShape = useShape({
    url: getElectricShapeUrl(),
    params: { 
      table: 'groups',
      ...getElectricAuthParams(),
    },
  });

  useEffect(() => {
    const err = (participantsShape.error as Error) || (groupsShape.error as Error) || null;
    if (err) {
      console.error('useUserGroups error:', err);
    }
    setError(err);
  }, [participantsShape.error, groupsShape.error]);

  const groups: Group[] = useMemo(() => {
    const participantRows = (participantsShape.data as any[]) || [];
    const groupRows = (groupsShape.data as any[]) || [];
    
    console.log(`useUserGroups: Raw data - Participants: ${participantRows.length}, Groups: ${groupRows.length}`);
    
    const groupIds = new Set<string>();
    for (const p of participantRows) {
      if (p?.group_id) {
        groupIds.add(String(p.group_id));
        console.log(`useUserGroups: Participant ${p.id} belongs to group ${p.group_id} (display_name: ${p.display_name})`);
      } else {
        console.log(`useUserGroups: Participant ${p.id} has no group_id`);
      }
    }
    
    console.log(`useUserGroups: Found ${groupIds.size} unique group IDs from participants:`, Array.from(groupIds));
    
    if (groupIds.size === 0) {
      console.log(`useUserGroups: No groups found for user ${currentUserUuid}`);
      return [];
    }
    
    const result: Group[] = [];
    for (const g of groupRows) {
      if (g?.id && groupIds.has(String(g.id))) {
        result.push(g as Group);
        console.log(`useUserGroups: Added group ${g.id} (${g.title}) to result`);
      } else {
        console.log(`useUserGroups: Group ${g.id} (${g.title}) not in participant's groups`);
      }
    }
    
    console.log(`useUserGroups: Final result - ${result.length} groups for user ${currentUserUuid}:`, 
      result.map(g => ({ id: g.id, title: g.title, currency: g.currency, created_at: g.created_at })));
    return result;
  }, [participantsShape.data, groupsShape.data, currentUserUuid]);

  return {
    groups,
    isLoading: participantsShape.isLoading || groupsShape.isLoading || !currentUserUuid,
    error,
  };
};


