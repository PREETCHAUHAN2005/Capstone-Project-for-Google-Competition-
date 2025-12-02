import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse } from './types';

export class AssignmentHelperAgent extends BaseAgent {
  constructor() {
    super(
      'assignment-helper',
      'Assignment Helper',
      'Assists with homework, project planning, and deadline management'
    );

    this.registerTool({
      name: 'createTaskList',
      description: 'Create a task list for an assignment',
      execute: async (params: { assignment: string; deadline: string }, context) => {
        return this.createTaskList(params.assignment, params.deadline);
      },
    });

    this.registerTool({
      name: 'setReminder',
      description: 'Set a reminder for a deadline',
      execute: async (params: { task: string; deadline: string }, context) => {
        return this.setReminder(params.task, params.deadline, context);
      },
    });

    this.registerTool({
      name: 'breakDownProject',
      description: 'Break down a project into manageable tasks',
      execute: async (params: { project: string; complexity: string }, context) => {
        return this.breakDownProject(params.project, params.complexity);
      },
    });
  }

  canHandle(message: string, context: AgentContext): boolean {
    const keywords = [
      'assignment', 'homework', 'project', 'deadline', 'due date',
      'task', 'todo', 'reminder', 'schedule', 'plan', 'break down',
      'help with', 'stuck', 'guidance', 'steps', 'checklist'
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  }

  async process(message: string, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    this.metrics.messagesProcessed++;

    try {
      this.log(`Processing assignment help request: ${message.substring(0, 50)}...`);

      const lowerMessage = message.toLowerCase();
      let response: string;
      let toolsUsed: string[] = [];

      if (lowerMessage.includes('task list') || lowerMessage.includes('checklist') || lowerMessage.includes('break down')) {
        const assignment = this.extractAssignment(message);
        const deadline = this.extractDeadline(message) || 'No deadline specified';
        const tasks = await this.executeTool('createTaskList', { assignment, deadline }, context);
        toolsUsed.push('createTaskList');
        response = this.formatTaskList(assignment, deadline, tasks);
      } else if (lowerMessage.includes('reminder') || lowerMessage.includes('alert')) {
        const task = this.extractAssignment(message);
        const deadline = this.extractDeadline(message) || 'No deadline specified';
        const reminder = await this.executeTool('setReminder', { task, deadline }, context);
        toolsUsed.push('setReminder');
        response = this.formatReminder(task, deadline, reminder);
      } else if (lowerMessage.includes('project') && (lowerMessage.includes('plan') || lowerMessage.includes('steps'))) {
        const project = this.extractAssignment(message);
        const complexity = this.extractComplexity(message) || 'medium';
        const breakdown = await this.executeTool('breakDownProject', { project, complexity }, context);
        toolsUsed.push('breakDownProject');
        response = this.formatProjectBreakdown(project, breakdown);
      } else {
        response = this.generateGeneralHelp(message, context);
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
        content: 'I encountered an error while helping with your assignment. Please provide more details about what you need help with.',
        agentId: this.id,
        metadata: { error: String(error) },
      };
    }
  }

  private extractAssignment(message: string): string {
    // Try to extract assignment name from message
    const patterns = [
      /assignment[:\s]+(.+?)(?:deadline|due|help|$)/i,
      /project[:\s]+(.+?)(?:deadline|due|help|$)/i,
      /homework[:\s]+(.+?)(?:deadline|due|help|$)/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return 'Your assignment';
  }

  private extractDeadline(message: string): string | null {
    const patterns = [
      /deadline[:\s]+(.+?)(?:\n|$)/i,
      /due[:\s]+(.+?)(?:\n|$)/i,
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
      /(\d{4}-\d{2}-\d{2})/,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  private extractComplexity(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('simple') || lowerMessage.includes('easy')) return 'simple';
    if (lowerMessage.includes('complex') || lowerMessage.includes('hard') || lowerMessage.includes('difficult')) return 'complex';
    return null;
  }

  private createTaskList(assignment: string, deadline: string): any {
    return {
      assignment,
      deadline,
      tasks: [
        { id: 1, task: 'Understand requirements', estimatedTime: '1 hour', priority: 'high' },
        { id: 2, task: 'Research and gather resources', estimatedTime: '2 hours', priority: 'high' },
        { id: 3, task: 'Create outline/structure', estimatedTime: '1 hour', priority: 'medium' },
        { id: 4, task: 'Implement solution', estimatedTime: '4-6 hours', priority: 'high' },
        { id: 5, task: 'Test and debug', estimatedTime: '2 hours', priority: 'high' },
        { id: 6, task: 'Review and refine', estimatedTime: '1 hour', priority: 'medium' },
        { id: 7, task: 'Submit assignment', estimatedTime: '30 minutes', priority: 'high' },
      ],
      totalEstimatedTime: '12-14 hours',
    };
  }

  private setReminder(task: string, deadline: string, context: AgentContext): any {
    if (!context.memory) context.memory = {};
    if (!context.memory.reminders) context.memory.reminders = [];

    const reminder = {
      id: Date.now().toString(),
      task,
      deadline,
      createdAt: new Date().toISOString(),
    };

    context.memory.reminders.push(reminder);

    return reminder;
  }

  private breakDownProject(project: string, complexity: string): any {
    const breakdowns: Record<string, any> = {
      'simple': {
        phases: [
          { phase: 'Planning', tasks: ['Define scope', 'Set timeline', 'Gather requirements'] },
          { phase: 'Development', tasks: ['Implement core features', 'Basic testing'] },
          { phase: 'Completion', tasks: ['Final review', 'Documentation', 'Submission'] },
        ],
        estimatedWeeks: 1,
      },
      'medium': {
        phases: [
          { phase: 'Planning', tasks: ['Requirements analysis', 'Design architecture', 'Create timeline'] },
          { phase: 'Development', tasks: ['Set up environment', 'Implement features', 'Integration'] },
          { phase: 'Testing', tasks: ['Unit tests', 'Integration tests', 'Bug fixes'] },
          { phase: 'Completion', tasks: ['Documentation', 'Code review', 'Deployment'] },
        ],
        estimatedWeeks: 2,
      },
      'complex': {
        phases: [
          { phase: 'Planning', tasks: ['Requirements gathering', 'System design', 'Architecture planning', 'Resource allocation'] },
          { phase: 'Development', tasks: ['Module 1 development', 'Module 2 development', 'Module integration'] },
          { phase: 'Testing', tasks: ['Unit testing', 'Integration testing', 'System testing', 'Performance testing'] },
          { phase: 'Refinement', tasks: ['Code optimization', 'Security review', 'User feedback'] },
          { phase: 'Completion', tasks: ['Documentation', 'Deployment', 'Maintenance plan'] },
        ],
        estimatedWeeks: 4,
      },
    };

    return breakdowns[complexity] || breakdowns['medium'];
  }

  private formatTaskList(assignment: string, deadline: string, taskList: any): string {
    let response = `Task list for "${assignment}":\n\n`;
    if (deadline !== 'No deadline specified') {
      response += `Deadline: ${deadline}\n\n`;
    }
    response += `Tasks:\n\n`;

    taskList.tasks.forEach((t: any) => {
      response += `${t.id}. ${t.task}\n`;
      response += `   ⏱️  Estimated time: ${t.estimatedTime}\n`;
      response += `   📌 Priority: ${t.priority}\n\n`;
    });

    response += `Total estimated time: ${taskList.totalEstimatedTime}\n\n`;
    response += `Start with high-priority tasks and work your way through. Good luck!`;
    return response;
  }

  private formatReminder(task: string, deadline: string, reminder: any): string {
    return `✅ Reminder set for "${task}"\n\n` +
      `Deadline: ${deadline}\n` +
      `Created: ${new Date(reminder.createdAt).toLocaleString()}\n\n` +
      `I'll help you stay on track! Would you like me to create a task breakdown for this assignment?`;
  }

  private formatProjectBreakdown(project: string, breakdown: any): string {
    let response = `Project breakdown for "${project}":\n\n`;
    response += `Estimated duration: ${breakdown.estimatedWeeks} week(s)\n\n`;
    response += `Phases:\n\n`;

    breakdown.phases.forEach((phase: any, index: number) => {
      response += `Phase ${index + 1}: ${phase.phase}\n`;
      phase.tasks.forEach((task: string) => {
        response += `  ✓ ${task}\n`;
      });
      response += '\n';
    });

    response += `Work through each phase systematically. Break down each task into smaller sub-tasks if needed.`;
    return response;
  }

  private generateGeneralHelp(message: string, context: AgentContext): string {
    return `I'm your Assignment Helper! I can assist you with:\n\n` +
      `- Creating task lists and checklists for assignments\n` +
      `- Breaking down complex projects into manageable steps\n` +
      `- Setting reminders for deadlines\n` +
      `- Planning your work schedule\n` +
      `- Providing guidance on assignment structure\n\n` +
      `What assignment or project do you need help with?`;
  }

  private updateAverageResponseTime(newTime: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.messagesProcessed - 1) + newTime;
    this.metrics.averageResponseTime = total / this.metrics.messagesProcessed;
  }
}

