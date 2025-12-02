import { AgentContext } from '../agents/types';

export interface MemoryEntry {
  id: string;
  userId: string;
  type: 'skill' | 'course' | 'assignment' | 'goal' | 'achievement' | 'preference';
  key: string;
  value: any;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class MemoryBank {
  private memories: Map<string, MemoryEntry[]>;
  private index: Map<string, Set<string>>; // userId -> memory IDs

  constructor() {
    this.memories = new Map();
    this.index = new Map();
  }

  store(userId: string, type: MemoryEntry['type'], key: string, value: any, metadata?: Record<string, any>): MemoryEntry {
    if (!this.memories.has(userId)) {
      this.memories.set(userId, []);
      this.index.set(userId, new Set());
    }

    const userMemories = this.memories.get(userId)!;
    const existing = userMemories.find(m => m.type === type && m.key === key);

    const now = new Date();
    let entry: MemoryEntry;

    if (existing) {
      // Update existing
      existing.value = value;
      existing.metadata = { ...existing.metadata, ...metadata };
      existing.updatedAt = now;
      entry = existing;
    } else {
      // Create new
      entry = {
        id: `${userId}-${type}-${key}-${Date.now()}`,
        userId,
        type,
        key,
        value,
        metadata,
        createdAt: now,
        updatedAt: now,
      };
      userMemories.push(entry);
      this.index.get(userId)!.add(entry.id);
    }

    return entry;
  }

  retrieve(userId: string, type?: MemoryEntry['type'], key?: string): MemoryEntry[] {
    const userMemories = this.memories.get(userId) || [];
    
    if (type && key) {
      return userMemories.filter(m => m.type === type && m.key === key);
    } else if (type) {
      return userMemories.filter(m => m.type === type);
    } else if (key) {
      return userMemories.filter(m => m.key === key);
    }

    return userMemories;
  }

  getSkillProgress(userId: string, skill: string): number {
    const entries = this.retrieve(userId, 'skill', skill);
    if (entries.length === 0) return 0;
    return entries[0].value?.progress || 0;
  }

  getCourseHistory(userId: string): string[] {
    const entries = this.retrieve(userId, 'course');
    return entries.map(e => e.key);
  }

  getAssignments(userId: string): any[] {
    const entries = this.retrieve(userId, 'assignment');
    return entries.map(e => ({ ...e.value, id: e.id }));
  }

  getGoals(userId: string): any[] {
    const entries = this.retrieve(userId, 'goal');
    return entries.map(e => ({ ...e.value, id: e.id }));
  }

  updateSkillProgress(userId: string, skill: string, progress: number): void {
    this.store(userId, 'skill', skill, { progress, lastUpdated: new Date().toISOString() });
  }

  addCourse(userId: string, course: string, metadata?: Record<string, any>): void {
    this.store(userId, 'course', course, { enrolled: true, ...metadata });
  }

  addAssignment(userId: string, assignment: string, deadline: string, metadata?: Record<string, any>): void {
    this.store(userId, 'assignment', assignment, {
      deadline,
      status: 'pending',
      ...metadata,
    });
  }

  addGoal(userId: string, goal: string, metadata?: Record<string, any>): void {
    this.store(userId, 'goal', goal, {
      status: 'active',
      createdAt: new Date().toISOString(),
      ...metadata,
    });
  }

  delete(userId: string, type: MemoryEntry['type'], key: string): boolean {
    const userMemories = this.memories.get(userId);
    if (!userMemories) return false;

    const index = userMemories.findIndex(m => m.type === type && m.key === key);
    if (index === -1) return false;

    const entry = userMemories[index];
    this.index.get(userId)?.delete(entry.id);
    userMemories.splice(index, 1);
    return true;
  }

  getAll(userId: string): MemoryEntry[] {
    return this.retrieve(userId);
  }

  clear(userId: string): void {
    this.memories.delete(userId);
    this.index.delete(userId);
  }
}

// Singleton instance
export const memoryBank = new MemoryBank();

