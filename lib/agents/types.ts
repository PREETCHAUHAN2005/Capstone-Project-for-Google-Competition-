export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  agentId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentContext {
  userId: string;
  sessionId: string;
  conversationHistory: AgentMessage[];
  userProfile?: UserProfile;
  memory?: Record<string, any>;
}

export interface UserProfile {
  name: string;
  major: string;
  year: string;
  interests: string[];
  goals: string[];
}

export interface AgentResponse {
  content: string;
  agentId: string;
  shouldDelegate?: boolean;
  delegateTo?: string;
  toolsUsed?: string[];
  metadata?: Record<string, any>;
}

export interface AgentCapabilities {
  canHandle: (message: string, context: AgentContext) => boolean;
  priority: number;
}

export type AgentTool = {
  name: string;
  description: string;
  execute: (params: any, context: AgentContext) => Promise<any>;
};

export interface AgentMetrics {
  messagesProcessed: number;
  averageResponseTime: number;
  toolsUsed: number;
  delegations: number;
  errors: number;
}

