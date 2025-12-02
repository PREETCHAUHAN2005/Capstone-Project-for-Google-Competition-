import { v4 as uuidv4 } from 'uuid';
import { AgentContext, AgentMessage, UserProfile } from '../agents/types';

export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  lastAccessed: Date;
  messages: AgentMessage[];
  context: AgentContext;
  metadata?: Record<string, any>;
}

export class InMemorySessionService {
  private sessions: Map<string, Session>;
  private userSessions: Map<string, string[]>; // userId -> sessionIds

  constructor() {
    this.sessions = new Map();
    this.userSessions = new Map();
  }

  createSession(userId: string, userProfile?: UserProfile): Session {
    const sessionId = uuidv4();
    const now = new Date();

    const session: Session = {
      id: sessionId,
      userId,
      createdAt: now,
      lastAccessed: now,
      messages: [],
      context: {
        userId,
        sessionId,
        conversationHistory: [],
        userProfile,
        memory: {},
      },
    };

    this.sessions.set(sessionId, session);

    // Track user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, []);
    }
    this.userSessions.get(userId)!.push(sessionId);

    return session;
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastAccessed = new Date();
    }
    return session;
  }

  getUserSessions(userId: string): Session[] {
    const sessionIds = this.userSessions.get(userId) || [];
    return sessionIds
      .map(id => this.sessions.get(id))
      .filter((s): s is Session => s !== undefined)
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime());
  }

  addMessage(sessionId: string, message: AgentMessage): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.messages.push(message);
    session.context.conversationHistory.push(message);
    session.lastAccessed = new Date();

    // Update context memory if needed
    this.updateMemory(session);
  }

  updateContext(sessionId: string, updates: Partial<AgentContext>): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.context = {
      ...session.context,
      ...updates,
    };
    session.lastAccessed = new Date();
  }

  private updateMemory(session: Session): void {
    // Extract and store important information from conversation
    const recentMessages = session.messages.slice(-10);
    
    if (!session.context.memory) {
      session.context.memory = {};
    }

    // Track mentioned skills, courses, assignments, etc.
    const mentionedSkills: string[] = [];
    const mentionedCourses: string[] = [];
    const mentionedAssignments: string[] = [];

    recentMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      // Extract skills
      const skillKeywords = ['python', 'javascript', 'react', 'node', 'java', 'c++', 'aws', 'docker'];
      skillKeywords.forEach(skill => {
        if (content.includes(skill) && !mentionedSkills.includes(skill)) {
          mentionedSkills.push(skill);
        }
      });

      // Extract courses (pattern: CS 101, EE 201, etc.)
      const coursePattern = /[A-Z]{2,4}\s?\d{3,4}/g;
      const courses = content.match(coursePattern);
      if (courses) {
        courses.forEach(course => {
          if (!mentionedCourses.includes(course)) {
            mentionedCourses.push(course);
          }
        });
      }
    });

    session.context.memory.mentionedSkills = mentionedSkills;
    session.context.memory.mentionedCourses = mentionedCourses;
    session.context.memory.mentionedAssignments = mentionedAssignments;
    session.context.memory.lastUpdated = new Date().toISOString();
  }

  deleteSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      const userId = session.userId;
      const userSessions = this.userSessions.get(userId);
      if (userSessions) {
        const index = userSessions.indexOf(sessionId);
        if (index > -1) {
          userSessions.splice(index, 1);
        }
      }
    }
    this.sessions.delete(sessionId);
  }

  cleanupOldSessions(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
    // Clean up sessions older than maxAge (default 7 days)
    const now = Date.now();
    let cleaned = 0;

    this.sessions.forEach((session, sessionId) => {
      const age = now - session.lastAccessed.getTime();
      if (age > maxAge) {
        this.deleteSession(sessionId);
        cleaned++;
      }
    });

    return cleaned;
  }

  getSessionCount(): number {
    return this.sessions.size;
  }
}

// Singleton instance
export const sessionService = new InMemorySessionService();

