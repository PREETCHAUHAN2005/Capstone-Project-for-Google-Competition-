import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse } from './types';

export class AcademicAdvisorAgent extends BaseAgent {
  constructor() {
    super(
      'academic-advisor',
      'Academic Advisor',
      'Provides course guidance, degree planning, and academic strategy for engineering students'
    );

    // Register tools
    this.registerTool({
      name: 'getCourseRecommendations',
      description: 'Get course recommendations based on major and year',
      execute: async (params: { major: string; year: string }, context) => {
        return this.getCourseRecommendations(params.major, params.year);
      },
    });

    this.registerTool({
      name: 'checkPrerequisites',
      description: 'Check prerequisites for a course',
      execute: async (params: { course: string }, context) => {
        return this.checkPrerequisites(params.course);
      },
    });

    this.registerTool({
      name: 'createDegreePlan',
      description: 'Create a degree plan for the student',
      execute: async (params: { major: string; credits: number }, context) => {
        return this.createDegreePlan(params.major, params.credits);
      },
    });
  }

  canHandle(message: string, context: AgentContext): boolean {
    const keywords = [
      'course', 'degree', 'prerequisite', 'graduation', 'credit', 'semester',
      'academic', 'major', 'minor', 'curriculum', 'schedule', 'enrollment',
      'gpa', 'grade', 'transcript', 'advisor'
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  }

  async process(message: string, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    this.metrics.messagesProcessed++;

    try {
      this.log(`Processing message: ${message.substring(0, 50)}...`);

      const lowerMessage = message.toLowerCase();
      let response: string;
      let toolsUsed: string[] = [];

      if (lowerMessage.includes('recommend') || lowerMessage.includes('course')) {
        const major = context.userProfile?.major || 'Engineering';
        const year = context.userProfile?.year || 'Freshman';
        const recommendations = await this.executeTool('getCourseRecommendations', { major, year }, context);
        toolsUsed.push('getCourseRecommendations');
        response = this.formatCourseRecommendations(recommendations, major, year);
      } else if (lowerMessage.includes('prerequisite') || lowerMessage.includes('prereq')) {
        const courseMatch = message.match(/[A-Z]{2,4}\s?\d{3,4}/);
        const course = courseMatch ? courseMatch[0] : 'CS 101';
        const prereqs = await this.executeTool('checkPrerequisites', { course }, context);
        toolsUsed.push('checkPrerequisites');
        response = this.formatPrerequisites(course, prereqs);
      } else if (lowerMessage.includes('degree plan') || lowerMessage.includes('graduation')) {
        const major = context.userProfile?.major || 'Engineering';
        const plan = await this.executeTool('createDegreePlan', { major, credits: 120 }, context);
        toolsUsed.push('createDegreePlan');
        response = this.formatDegreePlan(plan);
      } else {
        response = this.generateGeneralAdvice(message, context);
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
      this.log(`Error processing message: ${error}`, 'error');
      return {
        content: 'I apologize, but I encountered an error while processing your request. Please try rephrasing your question.',
        agentId: this.id,
        metadata: { error: String(error) },
      };
    }
  }

  private getCourseRecommendations(major: string, year: string): any {
    const recommendations: Record<string, Record<string, string[]>> = {
      'Computer Science': {
        'Freshman': ['CS 101: Introduction to Programming', 'MATH 101: Calculus I', 'ENG 101: English Composition'],
        'Sophomore': ['CS 201: Data Structures', 'CS 202: Algorithms', 'MATH 201: Linear Algebra'],
        'Junior': ['CS 301: Software Engineering', 'CS 302: Database Systems', 'CS 303: Operating Systems'],
        'Senior': ['CS 401: Capstone Project', 'CS 402: Distributed Systems', 'CS 403: Machine Learning'],
      },
      'Electrical Engineering': {
        'Freshman': ['EE 101: Circuit Analysis', 'MATH 101: Calculus I', 'PHYS 101: Physics I'],
        'Sophomore': ['EE 201: Digital Systems', 'EE 202: Signals and Systems', 'MATH 201: Differential Equations'],
        'Junior': ['EE 301: Electronics', 'EE 302: Control Systems', 'EE 303: Power Systems'],
        'Senior': ['EE 401: Senior Design', 'EE 402: Communication Systems', 'EE 403: Embedded Systems'],
      },
    };

    return recommendations[major]?.[year] || recommendations['Computer Science'][year] || [];
  }

  private checkPrerequisites(course: string): any {
    const prereqs: Record<string, string[]> = {
      'CS 201': ['CS 101'],
      'CS 202': ['CS 201', 'MATH 101'],
      'CS 301': ['CS 202'],
      'CS 302': ['CS 201'],
      'CS 303': ['CS 201', 'CS 202'],
      'EE 201': ['EE 101', 'MATH 101'],
      'EE 301': ['EE 201', 'MATH 201'],
    };

    return prereqs[course] || ['No specific prerequisites found'];
  }

  private createDegreePlan(major: string, credits: number): any {
    return {
      major,
      totalCredits: credits,
      semesters: 8,
      creditsPerSemester: credits / 8,
      coreCourses: this.getCoreCourses(major),
      electives: this.getElectives(major),
    };
  }

  private getCoreCourses(major: string): string[] {
    const cores: Record<string, string[]> = {
      'Computer Science': ['CS 101', 'CS 201', 'CS 202', 'CS 301', 'CS 401'],
      'Electrical Engineering': ['EE 101', 'EE 201', 'EE 301', 'EE 401'],
    };
    return cores[major] || cores['Computer Science'];
  }

  private getElectives(major: string): string[] {
    return ['Technical Elective 1', 'Technical Elective 2', 'General Elective 1', 'General Elective 2'];
  }

  private formatCourseRecommendations(recommendations: string[], major: string, year: string): string {
    return `Based on your ${major} major and ${year} year, I recommend the following courses:\n\n${recommendations.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nThese courses will help you build a strong foundation and progress toward your degree. Would you like more details about any specific course?`;
  }

  private formatPrerequisites(course: string, prereqs: string[]): string {
    if (prereqs.length === 0 || prereqs[0] === 'No specific prerequisites found') {
      return `${course} has no specific prerequisites, but basic programming knowledge is recommended.`;
    }
    return `The prerequisites for ${course} are:\n${prereqs.map(p => `- ${p}`).join('\n')}\n\nMake sure you've completed these before enrolling.`;
  }

  private formatDegreePlan(plan: any): string {
    return `Here's your ${plan.major} degree plan:\n\n` +
      `Total Credits: ${plan.totalCredits}\n` +
      `Semesters: ${plan.semesters}\n` +
      `Credits per Semester: ${plan.creditsPerSemester}\n\n` +
      `Core Courses:\n${plan.coreCourses.map((c: string) => `- ${c}`).join('\n')}\n\n` +
      `Electives:\n${plan.electives.map((e: string) => `- ${e}`).join('\n')}\n\n` +
      `This is a general plan. I recommend meeting with your academic advisor to customize it based on your specific goals.`;
  }

  private generateGeneralAdvice(message: string, context: AgentContext): string {
    return `As your Academic Advisor, I'm here to help with course selection, degree planning, and academic strategy. ` +
      `I can help you with:\n\n` +
      `- Course recommendations based on your major and year\n` +
      `- Checking prerequisites for specific courses\n` +
      `- Creating a degree plan\n` +
      `- Academic planning and scheduling\n\n` +
      `What specific academic question can I help you with today?`;
  }

  private updateAverageResponseTime(newTime: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.messagesProcessed - 1) + newTime;
    this.metrics.averageResponseTime = total / this.metrics.messagesProcessed;
  }
}

