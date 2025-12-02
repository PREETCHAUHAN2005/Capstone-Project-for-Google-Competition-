import { NextRequest, NextResponse } from 'next/server';
import { CoordinatorAgent } from '@/lib/agents/coordinator-agent';
import { sessionService } from '@/lib/sessions/session-service';
import { memoryBank } from '@/lib/memory/memory-bank';
import { logger } from '@/lib/observability/logger';
import { tracer } from '@/lib/observability/tracer';
import { metricsCollector } from '@/lib/observability/metrics';
import { AgentMessage } from '@/lib/agents/types';
import { v4 as uuidv4 } from 'uuid';

const coordinator = new CoordinatorAgent();

export async function POST(request: NextRequest) {
  const traceId = uuidv4();
  const spanId = tracer.startTrace(traceId, 'chat-request');

  try {
    const body = await request.json();
    const { message, sessionId, userId, userProfile, selectedAgent } = body;

    if (!message || !sessionId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, sessionId, userId' },
        { status: 400 }
      );
    }

    logger.info('Chat request received', { userId, sessionId, messageLength: message.length, selectedAgent });

    // Get or create session
    let session = sessionService.getSession(sessionId);
    if (!session) {
      session = sessionService.createSession(userId, userProfile);
      logger.info('New session created', { userId, sessionId: session.id });
    }

    // Update user profile if provided
    if (userProfile) {
      session.context.userProfile = userProfile;
    }

    // Add user message
    const userMessage: AgentMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    sessionService.addMessage(sessionId, userMessage);

    // Process with coordinator or specific agent
    const agentSpanId = tracer.startSpan(traceId, 'agent-processing', spanId);
    const startTime = Date.now();
    
    let response;
    try {
      if (selectedAgent) {
        // Use specific agent if selected
        const agent = coordinator.getAgent(selectedAgent);
        if (agent) {
          if (agent.canHandle(message, session.context)) {
            response = await agent.process(message, session.context);
          } else {
            // Agent can't handle, but try anyway or fall back
            response = await agent.process(message, session.context);
          }
        } else {
          // Agent not found, use coordinator
          logger.warn(`Agent ${selectedAgent} not found, using coordinator`);
          response = await coordinator.process(message, session.context);
        }
      } else {
        // Use coordinator for automatic routing
        response = await coordinator.process(message, session.context);
      }
    } catch (agentError) {
      logger.error('Error in agent processing', { error: String(agentError), selectedAgent });
      // Fallback response
      response = {
        content: 'I encountered an error while processing your request. Please try rephrasing your question or selecting a different agent.',
        agentId: 'coordinator',
        metadata: { error: String(agentError) },
      };
    }
    
    const responseTime = Date.now() - startTime;
    tracer.endSpan(agentSpanId, response.metadata?.error ? 'error' : 'completed', {
      agentId: response.agentId,
      responseTime,
    });

    // Record metrics
    metricsCollector.recordMessage(response.agentId, responseTime, !response.metadata?.error);
    const agent = coordinator.getAgent(response.agentId);
    if (agent) {
      metricsCollector.updateAgentMetrics(response.agentId, agent.getMetrics());
    }

    // Add agent response
    const agentMessage: AgentMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: response.content,
      agentId: response.agentId,
      timestamp: new Date(),
      metadata: response.metadata,
    };
    sessionService.addMessage(sessionId, agentMessage);

    // Update memory bank if needed
    if (response.metadata?.toolsUsed?.includes('trackProgress')) {
      // Extract skill and progress from response if available
      const skillMatch = message.match(/(python|javascript|react|node|java|c\+\+)/i);
      if (skillMatch) {
        const skill = skillMatch[1].toLowerCase();
        const progressMatch = message.match(/(\d+)%/);
        if (progressMatch) {
          memoryBank.updateSkillProgress(userId, skill, parseInt(progressMatch[1]));
        }
      }
    }

    tracer.endSpan(spanId, 'completed', { responseTime });

    logger.info('Chat response generated', {
      userId,
      sessionId,
      agentId: response.agentId,
      responseTime,
    });

    return NextResponse.json({
      message: response.content,
      agentId: response.agentId,
      agentName: agent?.getName() || 'Unknown',
      sessionId: session.id,
      metadata: response.metadata,
      traceId,
    });
  } catch (error) {
    tracer.endSpan(spanId, 'error', { error: String(error) });
    logger.error('Error processing chat request', { error: String(error), traceId });
    
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}

