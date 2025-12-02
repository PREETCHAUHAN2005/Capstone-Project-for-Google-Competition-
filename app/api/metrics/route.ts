import { NextResponse } from 'next/server';
import { metricsCollector } from '@/lib/observability/metrics';
import { sessionService } from '@/lib/sessions/session-service';

export async function GET() {
  try {
    const totalSessions = sessionService.getSessionCount();
    const metrics = metricsCollector.getSystemMetrics(totalSessions, totalSessions);

    return NextResponse.json({
      ...metrics,
      agentMetrics: Array.from(metrics.agentMetrics.entries()).map(([id, metrics]) => ({
        agentId: id,
        ...metrics,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

