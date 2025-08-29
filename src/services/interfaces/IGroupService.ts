import { 
  Group,
  CreateGroupRequest,
  UpdateGroupRequest
} from '../types/groups';
import { 
  Participant,
  CreateParticipantRequest,
  UpdateParticipantRequest
} from '../types/participants';
import { 
  Transaction,
  TransactionFilters
} from '../types/transactions';

export interface IGroupService {
  // Group management
  getGroups(): Promise<Group[]>;
  getGroupById(id: string): Promise<Group | null>;
  createGroup(group: CreateGroupRequest): Promise<Group>;
  updateGroup(id: string, updates: UpdateGroupRequest): Promise<Group>;
  deleteGroup(id: string): Promise<void>;
  
  // Group queries
  getUserGroups(userId: string): Promise<Group[]>;
  getActiveGroups(): Promise<Group[]>;
  getArchivedGroups(): Promise<Group[]>;
  searchGroups(query: string): Promise<Group[]>;
  
  // Participant management
  getGroupParticipants(groupId: string): Promise<Participant[]>;
  getParticipantById(id: string): Promise<Participant | null>;
  addParticipantToGroup(participant: CreateParticipantRequest): Promise<Participant>;
  updateParticipant(id: string, updates: UpdateParticipantRequest): Promise<Participant>;
  removeParticipantFromGroup(groupId: string, userId: string): Promise<void>;
  
  // Group operations
  archiveGroup(id: string): Promise<void>;
  unarchiveGroup(id: string): Promise<void>;
  getGroupBalance(groupId: string): Promise<{ [userId: string]: number }>;
  getGroupExpenses(groupId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  
  // Real-time subscriptions (for future sync)
  subscribeToGroupChanges(groupId: string, callback: (group: Group) => void): () => void;
  subscribeToParticipantChanges(groupId: string, callback: (participants: Participant[]) => void): () => void;
}

