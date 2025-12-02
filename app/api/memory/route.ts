import { NextRequest, NextResponse } from 'next/server';
import { memoryBank } from '@/lib/memory/memory-bank';
import { logger } from '@/lib/observability/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const memories = memoryBank.getAll(userId);
    const skills = memories.filter(m => m.type === 'skill');
    const courses = memories.filter(m => m.type === 'course');
    const assignments = memories.filter(m => m.type === 'assignment');
    const goals = memories.filter(m => m.type === 'goal');

    return NextResponse.json({
      skills: skills.map(s => ({ skill: s.key, ...s.value })),
      courses: courses.map(c => ({ course: c.key, ...c.value })),
      assignments: assignments.map(a => ({ assignment: a.key, ...a.value })),
      goals: goals.map(g => ({ goal: g.key, ...g.value })),
    });
  } catch (error) {
    logger.error('Error fetching memory', { error: String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, key, value, metadata } = body;

    if (!userId || !type || !key || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type, key, value' },
        { status: 400 }
      );
    }

    const entry = memoryBank.store(userId, type, key, value, metadata);
    logger.info('Memory stored', { userId, type, key });

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch (error) {
    logger.error('Error storing memory', { error: String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

