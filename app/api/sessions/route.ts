import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/sessions/session-service';
import { logger } from '@/lib/observability/logger';
import { UserProfile } from '@/lib/agents/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userProfile } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    const session = sessionService.createSession(userId, userProfile);
    logger.info('Session created', { userId, sessionId: session.id });

    return NextResponse.json({
      sessionId: session.id,
      userId: session.userId,
      createdAt: session.createdAt,
    });
  } catch (error) {
    logger.error('Error creating session', { error: String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = sessionService.getSession(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        sessionId: session.id,
        userId: session.userId,
        createdAt: session.createdAt,
        lastAccessed: session.lastAccessed,
        messageCount: session.messages.length,
      });
    }

    if (userId) {
      const sessions = sessionService.getUserSessions(userId);
      return NextResponse.json({
        sessions: sessions.map(s => ({
          sessionId: s.id,
          createdAt: s.createdAt,
          lastAccessed: s.lastAccessed,
          messageCount: s.messages.length,
        })),
      });
    }

    return NextResponse.json(
      { error: 'Missing userId or sessionId parameter' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Error fetching sessions', { error: String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

