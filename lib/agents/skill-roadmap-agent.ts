import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse } from './types';

export class SkillRoadmapAgent extends BaseAgent {
  constructor() {
    super(
      'skill-roadmap',
      'Skill Roadmap Agent',
      'Creates personalized learning paths for technical skills and engineering tools'
    );

    this.registerTool({
      name: 'createLearningPath',
      description: 'Create a personalized learning path for a skill',
      execute: async (params: { skill: string; level: string }, context) => {
        return this.createLearningPath(params.skill, params.level);
      },
    });

    this.registerTool({
      name: 'getResources',
      description: 'Get learning resources for a skill',
      execute: async (params: { skill: string }, context) => {
        return this.getResources(params.skill);
      },
    });

    this.registerTool({
      name: 'trackProgress',
      description: 'Track learning progress for a skill',
      execute: async (params: { skill: string; progress: number }, context) => {
        return this.trackProgress(params.skill, params.progress, context);
      },
    });
  }

  canHandle(message: string, context: AgentContext): boolean {
    const keywords = [
      'skill', 'learn', 'roadmap', 'tutorial', 'practice', 'master',
      'programming', 'python', 'javascript', 'react', 'node', 'docker',
      'git', 'aws', 'machine learning', 'data structure', 'algorithm',
      'development', 'coding', 'project', 'portfolio'
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  }

  async process(message: string, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    this.metrics.messagesProcessed++;

    try {
      this.log(`Processing skill roadmap request: ${message.substring(0, 50)}...`);

      const lowerMessage = message.toLowerCase();
      let response: string;
      let toolsUsed: string[] = [];

      if (lowerMessage.includes('roadmap') || lowerMessage.includes('path') || lowerMessage.includes('learn')) {
        const skill = this.extractSkill(message);
        const level = this.extractLevel(message) || 'beginner';
        const path = await this.executeTool('createLearningPath', { skill, level }, context);
        toolsUsed.push('createLearningPath');
        response = this.formatLearningPath(skill, level, path);
      } else if (lowerMessage.includes('resource') || lowerMessage.includes('tutorial') || lowerMessage.includes('course')) {
        const skill = this.extractSkill(message);
        const resources = await this.executeTool('getResources', { skill }, context);
        toolsUsed.push('getResources');
        response = this.formatResources(skill, resources);
      } else if (lowerMessage.includes('progress') || lowerMessage.includes('track')) {
        const skill = this.extractSkill(message);
        const progress = this.extractProgress(message) || 0;
        const result = await this.executeTool('trackProgress', { skill, progress }, context);
        toolsUsed.push('trackProgress');
        response = this.formatProgressTracking(skill, progress, result);
      } else {
        response = this.generateGeneralResponse(message, context);
      }

      const responseTime = Date.now() - startTime;
      this.updateAverageResponseTime(responseTime);

      return {
        content: response,
        agentId: this.id,
        toolsUsed,
        metadata: { responseTime },
      };
    } catch (error) {
      this.metrics.errors++;
      this.log(`Error: ${error}`, 'error');
      return {
        content: 'I encountered an error while creating your learning roadmap. Please try again with more specific details about the skill you want to learn.',
        agentId: this.id,
        metadata: { error: String(error) },
      };
    }
  }

  private extractSkill(message: string): string {
    const skills = [
      'python', 'javascript', 'react', 'node.js', 'docker', 'kubernetes',
      'aws', 'machine learning', 'data structures', 'algorithms', 'git',
      'sql', 'mongodb', 'postgresql', 'typescript', 'java', 'c++',
      'system design', 'devops', 'ci/cd'
    ];

    const lowerMessage = message.toLowerCase();
    for (const skill of skills) {
      if (lowerMessage.includes(skill)) {
        return skill;
      }
    }

    return 'programming';
  }

  private extractLevel(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) return 'beginner';
    if (lowerMessage.includes('intermediate') || lowerMessage.includes('medium')) return 'intermediate';
    if (lowerMessage.includes('advanced') || lowerMessage.includes('expert')) return 'advanced';
    return null;
  }

  private extractProgress(message: string): number | null {
    const match = message.match(/(\d+)%/);
    return match ? parseInt(match[1]) : null;
  }

  private createLearningPath(skill: string, level: string): any {
    const paths: Record<string, Record<string, any>> = {
      'python': {
        'beginner': {
          weeks: 4,
          milestones: [
            { week: 1, topic: 'Python Basics', tasks: ['Variables & Data Types', 'Control Flow', 'Functions'] },
            { week: 2, topic: 'Data Structures', tasks: ['Lists, Tuples, Dictionaries', 'List Comprehensions'] },
            { week: 3, topic: 'Object-Oriented Programming', tasks: ['Classes & Objects', 'Inheritance'] },
            { week: 4, topic: 'Projects', tasks: ['Build a Calculator', 'Create a To-Do App'] },
          ],
        },
        'intermediate': {
          weeks: 6,
          milestones: [
            { week: 1, topic: 'Advanced OOP', tasks: ['Decorators', 'Generators', 'Context Managers'] },
            { week: 2, topic: 'File Handling', tasks: ['Reading/Writing Files', 'CSV/JSON Processing'] },
            { week: 3, topic: 'APIs', tasks: ['REST APIs', 'HTTP Requests', 'API Integration'] },
            { week: 4, topic: 'Databases', tasks: ['SQLite', 'SQLAlchemy'] },
            { week: 5, topic: 'Testing', tasks: ['Unit Testing', 'pytest'] },
            { week: 6, topic: 'Projects', tasks: ['Build a Web API', 'Create a Data Analysis Tool'] },
          ],
        },
      },
      'react': {
        'beginner': {
          weeks: 5,
          milestones: [
            { week: 1, topic: 'React Basics', tasks: ['Components', 'JSX', 'Props'] },
            { week: 2, topic: 'State Management', tasks: ['useState', 'useEffect'] },
            { week: 3, topic: 'Routing', tasks: ['React Router', 'Navigation'] },
            { week: 4, topic: 'Hooks', tasks: ['Custom Hooks', 'Context API'] },
            { week: 5, topic: 'Projects', tasks: ['Build a Todo App', 'Create a Portfolio'] },
          ],
        },
      },
    };

    return paths[skill]?.[level] || {
      weeks: 4,
      milestones: [
        { week: 1, topic: 'Introduction', tasks: ['Learn Basics'] },
        { week: 2, topic: 'Practice', tasks: ['Build Projects'] },
        { week: 3, topic: 'Advanced Topics', tasks: ['Deep Dive'] },
        { week: 4, topic: 'Mastery', tasks: ['Expert Level'] },
      ],
    };
  }

  private getResources(skill: string): any {
    const resources: Record<string, any> = {
      'python': {
        courses: ['Python for Everybody (Coursera)', 'Automate the Boring Stuff'],
        books: ['Python Crash Course', 'Fluent Python'],
        practice: ['LeetCode', 'HackerRank', 'Codewars'],
        projects: ['Build a Web Scraper', 'Create a Data Visualization Tool'],
      },
      'react': {
        courses: ['React - The Complete Guide (Udemy)', 'Full Stack Open'],
        books: ['Learning React', 'Full Stack React'],
        practice: ['Build Projects', 'React Challenges'],
        projects: ['Todo App', 'E-commerce Site', 'Social Media Dashboard'],
      },
    };

    return resources[skill] || {
      courses: ['Online Courses', 'YouTube Tutorials'],
      books: ['Recommended Books'],
      practice: ['Practice Platforms'],
      projects: ['Build Projects'],
    };
  }

  private trackProgress(skill: string, progress: number, context: AgentContext): any {
    if (!context.memory) context.memory = {};
    if (!context.memory.skills) context.memory.skills = {};

    context.memory.skills[skill] = {
      progress,
      lastUpdated: new Date().toISOString(),
    };

    return {
      skill,
      progress,
      status: progress >= 100 ? 'completed' : progress >= 75 ? 'advanced' : progress >= 50 ? 'intermediate' : 'beginner',
    };
  }

  private formatLearningPath(skill: string, level: string, path: any): string {
    let response = `Here's your personalized ${level} learning path for ${skill}:\n\n`;
    response += `Duration: ${path.weeks} weeks\n\n`;
    response += `Milestones:\n\n`;

    path.milestones.forEach((milestone: any) => {
      response += `Week ${milestone.week}: ${milestone.topic}\n`;
      milestone.tasks.forEach((task: string) => {
        response += `  ✓ ${task}\n`;
      });
      response += '\n';
    });

    response += `Stay consistent and track your progress. Would you like resources for any specific topic?`;
    return response;
  }

  private formatResources(skill: string, resources: any): string {
    let response = `Learning resources for ${skill}:\n\n`;
    response += `📚 Courses:\n${resources.courses.map((c: string) => `  - ${c}`).join('\n')}\n\n`;
    response += `📖 Books:\n${resources.books.map((b: string) => `  - ${b}`).join('\n')}\n\n`;
    response += `💻 Practice Platforms:\n${resources.practice.map((p: string) => `  - ${p}`).join('\n')}\n\n`;
    response += `🚀 Project Ideas:\n${resources.projects.map((p: string) => `  - ${p}`).join('\n')}\n\n`;
    response += `Start with the courses, then practice regularly, and build projects to solidify your knowledge!`;
    return response;
  }

  private formatProgressTracking(skill: string, progress: number, result: any): string {
    return `Great progress on ${skill}! You're at ${progress}% completion, which puts you at the ${result.status} level.\n\n` +
      `Keep up the excellent work! Would you like me to adjust your learning path based on your progress?`;
  }

  private generateGeneralResponse(message: string, context: AgentContext): string {
    return `I'm your Skill Roadmap Agent! I help you create personalized learning paths for technical skills.\n\n` +
      `I can help you with:\n\n` +
      `- Creating learning roadmaps for any skill (Python, React, AWS, etc.)\n` +
      `- Finding the best resources (courses, books, practice platforms)\n` +
      `- Tracking your learning progress\n` +
      `- Adjusting your path based on your level (beginner/intermediate/advanced)\n\n` +
      `What skill would you like to learn or improve?`;
  }

  private updateAverageResponseTime(newTime: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.messagesProcessed - 1) + newTime;
    this.metrics.averageResponseTime = total / this.metrics.messagesProcessed;
  }
}

