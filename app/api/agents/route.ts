import { NextResponse } from 'next/server';
import { CoordinatorAgent } from '@/lib/agents/coordinator-agent';

const coordinator = new CoordinatorAgent();

export async function GET() {
  try {
    const agents = coordinator.getAllAgents();
    
    return NextResponse.json({
      agents: agents.map(agent => ({
        id: agent.getId(),
        name: agent.getName(),
        description: agent.getDescription(),
        metrics: agent.getMetrics(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

