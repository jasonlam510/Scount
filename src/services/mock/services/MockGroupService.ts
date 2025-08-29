import { IGroupService } from '../../interfaces/IGroupService';
import { 
  Group,
  CreateGroupRequest,
  UpdateGroupRequest
} from '../../types/groups';
import { 
  Participant,
  CreateParticipantRequest,
  UpdateParticipantRequest
} from '../../types/participants';
import { 
  Transaction,
  TransactionFilters
} from '../../types/transactions';
import { mockGroups } from '../data/groups';
import { mockParticipants } from '../data/participants';
import { mockTransactions } from '../data/transactions';

export class MockGroupService implements IGroupService {
  private groups: Group[] = [...mockGroups];
  private participants: Participant[] = [...mockParticipants];
  
  private groupListeners: { [groupId: string]: ((group: Group) => void)[] } = {};
  private participantListeners: { [groupId: string]: ((participants: Participant[]) => void)[] } = {};

  constructor() {
    console.log(`MockGroupService initialized with ${this.groups.length} groups`);
  }

  // Group management
  async getGroups(): Promise<Group[]> {
    await this.simulateDelay();
    return [...this.groups];
  }

  async getGroupById(id: string): Promise<Group | null> {
    await this.simulateDelay();
    return this.groups.find(g => g.id === id) || null;
  }

  async createGroup(group: CreateGroupRequest): Promise<Group> {
    await this.simulateDelay();
    const newGroup: Group = {
      id: this.generateId(),
      ...group,
      is_archived: false,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.groups.push(newGroup);
    this.notifyGroupListeners(newGroup.id, newGroup);
    return newGroup;
  }

  async updateGroup(id: string, updates: UpdateGroupRequest): Promise<Group> {
    await this.simulateDelay();
    const index = this.groups.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Group not found');
    
    this.groups[index] = { 
      ...this.groups[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyGroupListeners(id, this.groups[index]);
    return this.groups[index];
  }

  async deleteGroup(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.groups.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Group not found');
    
    this.groups.splice(index, 1);
    // Also remove participants
    this.participants = this.participants.filter(p => p.group_id !== id);
  }

  // Group queries
  async getUserGroups(userId: string): Promise<Group[]> {
    await this.simulateDelay();
    const userParticipantIds = this.participants
      .filter(p => p.user_id === userId && p.is_active)
      .map(p => p.group_id);
    
    return this.groups.filter(g => userParticipantIds.includes(g.id));
  }

  async getActiveGroups(): Promise<Group[]> {
    await this.simulateDelay();
    return this.groups.filter(g => !g.is_archived);
  }

  async getArchivedGroups(): Promise<Group[]> {
    await this.simulateDelay();
    return this.groups.filter(g => g.is_archived);
  }

  async searchGroups(query: string): Promise<Group[]> {
    await this.simulateDelay();
    const lowercaseQuery = query.toLowerCase();
    return this.groups.filter(g => 
      g.title.toLowerCase().includes(lowercaseQuery) ||
      g.icon.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Participant management
  async getGroupParticipants(groupId: string): Promise<Participant[]> {
    await this.simulateDelay();
    return this.participants.filter(p => p.group_id === groupId && p.is_active);
  }

  async getParticipantById(id: string): Promise<Participant | null> {
    await this.simulateDelay();
    return this.participants.find(p => p.id === id) || null;
  }

  async addParticipantToGroup(participant: CreateParticipantRequest): Promise<Participant> {
    await this.simulateDelay();
    const newParticipant: Participant = {
      id: this.generateId(),
      ...participant,
      is_active: true,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.participants.push(newParticipant);
    this.notifyParticipantListeners(participant.group_id, this.getGroupParticipants(participant.group_id));
    return newParticipant;
  }

  async updateParticipant(id: string, updates: UpdateParticipantRequest): Promise<Participant> {
    await this.simulateDelay();
    const index = this.participants.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Participant not found');
    
    this.participants[index] = { 
      ...this.participants[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    const participant = this.participants[index];
    this.notifyParticipantListeners(participant.group_id, this.getGroupParticipants(participant.group_id));
    return participant;
  }

  async removeParticipantFromGroup(groupId: string, userId: string): Promise<void> {
    await this.simulateDelay();
    const index = this.participants.findIndex(p => p.group_id === groupId && p.user_id === userId);
    if (index === -1) throw new Error('Participant not found');
    
    this.participants.splice(index, 1);
    this.notifyParticipantListeners(groupId, this.getGroupParticipants(groupId));
  }

  // Group operations
  async archiveGroup(id: string): Promise<void> {
    await this.simulateDelay();
    const group = await this.getGroupById(id);
    if (!group) throw new Error('Group not found');
    
    await this.updateGroup(id, { is_archived: true });
  }

  async unarchiveGroup(id: string): Promise<void> {
    await this.simulateDelay();
    const group = await this.getGroupById(id);
    if (!group) throw new Error('Group not found');
    
    await this.updateGroup(id, { is_archived: false });
  }

  async getGroupBalance(groupId: string): Promise<{ [userId: string]: number }> {
    await this.simulateDelay();
    // Mock implementation - in real app this would calculate from transactions and payers
    const participants = await this.getGroupParticipants(groupId);
    const balance: { [userId: string]: number } = {};
    
    participants.forEach(p => {
      balance[p.user_id] = 0; // Mock balance
    });
    
    return balance;
  }

  async getGroupExpenses(groupId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    let filtered = mockTransactions.filter(t => t.group_id === groupId);
    
    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      if (filters.subcategory_id) {
        filtered = filtered.filter(t => t.subcategory_id === filters.subcategory_id);
      }
      if (filters.dateRange) {
        filtered = filtered.filter(t => 
          t.date >= filters.dateRange!.startDate && t.date <= filters.dateRange!.endDate
        );
      }
    }
    
    return filtered;
  }

  // Real-time subscriptions (for future sync)
  subscribeToGroupChanges(groupId: string, callback: (group: Group) => void): () => void {
    if (!this.groupListeners[groupId]) {
      this.groupListeners[groupId] = [];
    }
    this.groupListeners[groupId].push(callback);
    
    // Initial call
    const group = this.groups.find(g => g.id === groupId);
    if (group) callback(group);
    
    return () => {
      const index = this.groupListeners[groupId].indexOf(callback);
      if (index > -1) {
        this.groupListeners[groupId].splice(index, 1);
      }
    };
  }

  subscribeToParticipantChanges(groupId: string, callback: (participants: Participant[]) => void): () => void {
    if (!this.participantListeners[groupId]) {
      this.participantListeners[groupId] = [];
    }
    this.participantListeners[groupId].push(callback);
    
    // Initial call
    const participants = this.participants.filter(p => p.group_id === groupId && p.is_active);
    callback(participants);
    
    return () => {
      const index = this.participantListeners[groupId].indexOf(callback);
      if (index > -1) {
        this.participantListeners[groupId].splice(index, 1);
      }
    };
  }

  private notifyGroupListeners(groupId: string, group: Group): void {
    if (this.groupListeners[groupId]) {
      this.groupListeners[groupId].forEach(callback => callback(group));
    }
  }

  private notifyParticipantListeners(groupId: string, participants: Participant[]): void {
    if (this.participantListeners[groupId]) {
      this.participantListeners[groupId].forEach(callback => callback(participants));
    }
  }

  private generateId(): string {
    return `mock_group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateDelay(ms: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

