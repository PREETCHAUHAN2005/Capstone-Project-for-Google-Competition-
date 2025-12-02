import { AgentMessage, AgentContext, AgentResponse, AgentTool, AgentMetrics } from './types';

export abstract class BaseAgent {
  protected id: string;
  protected name: string;
  protected description: string;
  protected tools: Map<string, AgentTool>;
  protected metrics: AgentMetrics;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.tools = new Map();
    this.metrics = {
      messagesProcessed: 0,
      averageResponseTime: 0,
      toolsUsed: 0,
      delegations: 0,
      errors: 0,
    };
  }

  abstract canHandle(message: string, context: AgentContext): boolean;
  abstract process(message: string, context: AgentContext): Promise<AgentResponse>;

  registerTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  async executeTool(toolName: string, params: any, context: AgentContext): Promise<any> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    this.metrics.toolsUsed++;
    return await tool.execute(params, context);
  }

  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${this.name}] ${message}`);
  }
}

