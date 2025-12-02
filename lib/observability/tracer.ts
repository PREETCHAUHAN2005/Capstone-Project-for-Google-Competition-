import { v4 as uuidv4 } from 'uuid';

export interface TraceSpan {
  id: string;
  traceId: string;
  parentId?: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  metadata?: Record<string, any>;
  status: 'started' | 'completed' | 'error';
}

export class Tracer {
  private traces: Map<string, TraceSpan[]>;
  private activeSpans: Map<string, TraceSpan>;

  constructor() {
    this.traces = new Map();
    this.activeSpans = new Map();
  }

  startTrace(traceId: string, name: string, metadata?: Record<string, any>): string {
    const spanId = uuidv4();
    const span: TraceSpan = {
      id: spanId,
      traceId,
      name,
      startTime: new Date(),
      status: 'started',
      metadata,
    };

    if (!this.traces.has(traceId)) {
      this.traces.set(traceId, []);
    }
    this.traces.get(traceId)!.push(span);
    this.activeSpans.set(spanId, span);

    return spanId;
  }

  startSpan(traceId: string, name: string, parentId?: string, metadata?: Record<string, any>): string {
    const spanId = uuidv4();
    const span: TraceSpan = {
      id: spanId,
      traceId,
      parentId,
      name,
      startTime: new Date(),
      status: 'started',
      metadata,
    };

    if (!this.traces.has(traceId)) {
      this.traces.set(traceId, []);
    }
    this.traces.get(traceId)!.push(span);
    this.activeSpans.set(spanId, span);

    return spanId;
  }

  endSpan(spanId: string, status: 'completed' | 'error' = 'completed', metadata?: Record<string, any>): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    span.endTime = new Date();
    span.duration = span.endTime.getTime() - span.startTime.getTime();
    span.status = status;
    if (metadata) {
      span.metadata = { ...span.metadata, ...metadata };
    }

    this.activeSpans.delete(spanId);
  }

  getTrace(traceId: string): TraceSpan[] {
    return this.traces.get(traceId) || [];
  }

  getAllTraces(): Map<string, TraceSpan[]> {
    return new Map(this.traces);
  }

  clear(): void {
    this.traces.clear();
    this.activeSpans.clear();
  }
}

export const tracer = new Tracer();

