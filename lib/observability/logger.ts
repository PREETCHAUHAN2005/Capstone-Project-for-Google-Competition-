export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  agentId?: string;
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export class Logger {
  private logs: LogEntry[];
  private maxLogs: number;

  constructor(maxLogs: number = 1000) {
    this.logs = [];
    this.maxLogs = maxLogs;
  }

  log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      metadata,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also log to console
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    console.log(`${prefix} ${message}${metaStr}`);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = this.logs;
    
    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  getLogsByAgent(agentId: string, limit?: number): LogEntry[] {
    let filtered = this.logs.filter(log => log.agentId === agentId);
    
    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();

