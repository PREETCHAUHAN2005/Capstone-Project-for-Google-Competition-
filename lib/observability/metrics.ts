import { AgentMetrics } from '../agents/types';

export interface SystemMetrics {
  totalMessages: number;
  totalSessions: number;
  activeSessions: number;
  averageResponseTime: number;
  agentMetrics: Map<string, AgentMetrics>;
  errorRate: number;
  uptime: number;
}

export class MetricsCollector {
  private startTime: Date;
  private totalMessages: number;
  private totalErrors: number;
  private responseTimes: number[];
  private agentMetrics: Map<string, AgentMetrics>;

  constructor() {
    this.startTime = new Date();
    this.totalMessages = 0;
    this.totalErrors = 0;
    this.responseTimes = [];
    this.agentMetrics = new Map();
  }

  recordMessage(agentId: string, responseTime: number, success: boolean): void {
    this.totalMessages++;
    this.responseTimes.push(responseTime);

    if (!success) {
      this.totalErrors++;
    }

    // Keep only last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  updateAgentMetrics(agentId: string, metrics: AgentMetrics): void {
    this.agentMetrics.set(agentId, metrics);
  }

  getSystemMetrics(activeSessions: number, totalSessions: number): SystemMetrics {
    const averageResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    const errorRate = this.totalMessages > 0
      ? (this.totalErrors / this.totalMessages) * 100
      : 0;

    const uptime = Date.now() - this.startTime.getTime();

    return {
      totalMessages: this.totalMessages,
      totalSessions,
      activeSessions,
      averageResponseTime,
      agentMetrics: new Map(this.agentMetrics),
      errorRate,
      uptime,
    };
  }

  reset(): void {
    this.startTime = new Date();
    this.totalMessages = 0;
    this.totalErrors = 0;
    this.responseTimes = [];
    this.agentMetrics.clear();
  }
}

export const metricsCollector = new MetricsCollector();

