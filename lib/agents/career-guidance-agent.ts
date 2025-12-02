import { BaseAgent } from './base-agent';
import { AgentContext, AgentResponse } from './types';

export class CareerGuidanceAgent extends BaseAgent {
  constructor() {
    super(
      'career-guidance',
      'Career Guidance Agent',
      'Offers internship advice, resume feedback, and career path recommendations'
    );

    this.registerTool({
      name: 'getInternshipAdvice',
      description: 'Get advice for finding and applying to internships',
      execute: async (params: { field: string; year: string }, context) => {
        return this.getInternshipAdvice(params.field, params.year);
      },
    });

    this.registerTool({
      name: 'reviewResume',
      description: 'Review resume and provide feedback',
      execute: async (params: { resume: string }, context) => {
        return this.reviewResume(params.resume);
      },
    });

    this.registerTool({
      name: 'suggestCareerPath',
      description: 'Suggest career paths based on interests and skills',
      execute: async (params: { interests: string[]; skills: string[] }, context) => {
        return this.suggestCareerPath(params.interests, params.skills);
      },
    });
  }

  canHandle(message: string, context: AgentContext): boolean {
    const keywords = [
      'career', 'internship', 'resume', 'cv', 'job', 'interview',
      'application', 'hire', 'employment', 'position', 'role',
      'salary', 'company', 'industry', 'professional', 'network',
      'linkedin', 'portfolio', 'experience', 'skills'
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  }

  async process(message: string, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    this.metrics.messagesProcessed++;

    try {
      this.log(`Processing career guidance request: ${message.substring(0, 50)}...`);

      const lowerMessage = message.toLowerCase();
      let response: string;
      let toolsUsed: string[] = [];

      if (lowerMessage.includes('internship') || lowerMessage.includes('intern')) {
        const field = context.userProfile?.major || 'Engineering';
        const year = context.userProfile?.year || 'Sophomore';
        const advice = await this.executeTool('getInternshipAdvice', { field, year }, context);
        toolsUsed.push('getInternshipAdvice');
        response = this.formatInternshipAdvice(field, year, advice);
      } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
        const resume = this.extractResumeContent(message);
        const review = await this.executeTool('reviewResume', { resume }, context);
        toolsUsed.push('reviewResume');
        response = this.formatResumeReview(review);
      } else if (lowerMessage.includes('career path') || lowerMessage.includes('what should i do')) {
        const interests = context.userProfile?.interests || [];
        const skills = this.extractSkills(message);
        const paths = await this.executeTool('suggestCareerPath', { interests, skills }, context);
        toolsUsed.push('suggestCareerPath');
        response = this.formatCareerPaths(paths);
      } else {
        response = this.generateGeneralGuidance(message, context);
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
        content: 'I encountered an error while providing career guidance. Please try rephrasing your question.',
        agentId: this.id,
        metadata: { error: String(error) },
      };
    }
  }

  private extractResumeContent(message: string): string {
    // In a real implementation, this would parse actual resume content
    return message.substring(0, 500);
  }

  private extractSkills(message: string): string[] {
    const commonSkills = [
      'python', 'javascript', 'react', 'node.js', 'java', 'c++',
      'machine learning', 'data science', 'web development',
      'cloud computing', 'devops', 'database'
    ];

    const lowerMessage = message.toLowerCase();
    return commonSkills.filter(skill => lowerMessage.includes(skill));
  }

  private getInternshipAdvice(field: string, year: string): any {
    return {
      timing: this.getTimingAdvice(year),
      applicationTips: [
        'Start early - many companies post internships 6-9 months in advance',
        'Tailor your resume for each application',
        'Write a compelling cover letter',
        'Build a portfolio showcasing your projects',
        'Network on LinkedIn and attend career fairs',
        'Practice coding interviews (LeetCode, HackerRank)',
        'Prepare behavioral interview questions (STAR method)',
      ],
      resources: [
        'LinkedIn Jobs',
        'Handshake',
        'Indeed',
        'Glassdoor',
        'Company career pages',
        'University career center',
      ],
      skillsToHighlight: this.getSkillsForField(field),
    };
  }

  private getTimingAdvice(year: string): string {
    const timing: Record<string, string> = {
      'Freshman': 'Focus on building skills and projects. Start networking and exploring options.',
      'Sophomore': 'Apply for summer internships. Many companies have programs for sophomores.',
      'Junior': 'This is prime internship season. Apply to multiple companies and prepare thoroughly.',
      'Senior': 'Consider full-time positions or post-graduation opportunities.',
    };
    return timing[year] || 'Start preparing early and apply to multiple opportunities.';
  }

  private getSkillsForField(field: string): string[] {
    const skills: Record<string, string[]> = {
      'Computer Science': ['Programming languages', 'Data structures & algorithms', 'Software development', 'System design'],
      'Electrical Engineering': ['Circuit design', 'Embedded systems', 'Signal processing', 'Hardware design'],
      'Engineering': ['Problem-solving', 'Technical skills', 'Project management', 'Communication'],
    };
    return skills[field] || skills['Engineering'];
  }

  private reviewResume(resume: string): any {
    return {
      strengths: [
        'Clear formatting and structure',
        'Quantifiable achievements',
        'Relevant technical skills',
      ],
      improvements: [
        'Add more specific metrics and numbers',
        'Include relevant projects with GitHub links',
        'Tailor experience descriptions to job descriptions',
        'Ensure consistent formatting throughout',
        'Add a skills section with proficiency levels',
        'Include any certifications or courses',
      ],
      tips: [
        'Keep it to 1 page for internships/entry-level',
        'Use action verbs (developed, implemented, optimized)',
        'Highlight impact and results, not just responsibilities',
        'Proofread multiple times for typos',
        'Get feedback from peers and mentors',
      ],
    };
  }

  private suggestCareerPath(interests: string[], skills: string[]): any {
    const paths = [
      {
        title: 'Software Engineer',
        description: 'Build and maintain software applications',
        requiredSkills: ['Programming', 'Problem-solving', 'System design'],
        growth: 'High demand, excellent growth prospects',
        salary: '$70k - $150k+',
      },
      {
        title: 'Data Scientist',
        description: 'Analyze data and build ML models',
        requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'Data Analysis'],
        growth: 'Rapidly growing field with high demand',
        salary: '$80k - $160k+',
      },
      {
        title: 'DevOps Engineer',
        description: 'Manage infrastructure and deployment pipelines',
        requiredSkills: ['Cloud platforms', 'CI/CD', 'Containerization', 'Monitoring'],
        growth: 'Critical role in modern software teams',
        salary: '$75k - $140k+',
      },
      {
        title: 'Product Manager',
        description: 'Define product strategy and roadmap',
        requiredSkills: ['Communication', 'Analytics', 'Technical understanding', 'Leadership'],
        growth: 'Leadership track with high impact',
        salary: '$85k - $170k+',
      },
    ];

    return {
      recommended: paths.slice(0, 2),
      alternatives: paths.slice(2),
      nextSteps: [
        'Build projects in your area of interest',
        'Get relevant internships or co-ops',
        'Network with professionals in the field',
        'Continue learning and upskilling',
      ],
    };
  }

  private formatInternshipAdvice(field: string, year: string, advice: any): string {
    let response = `Internship advice for ${field} students (${year}):\n\n`;
    response += `⏰ Timing: ${advice.timing}\n\n`;
    response += `💡 Application Tips:\n`;
    advice.applicationTips.forEach((tip: string) => {
      response += `  • ${tip}\n`;
    });
    response += `\n📚 Resources:\n`;
    advice.resources.forEach((resource: string) => {
      response += `  • ${resource}\n`;
    });
    response += `\n🎯 Skills to Highlight:\n`;
    advice.skillsToHighlight.forEach((skill: string) => {
      response += `  • ${skill}\n`;
    });
    response += `\nStart preparing now and apply early!`;
    return response;
  }

  private formatResumeReview(review: any): string {
    let response = `Resume Review Feedback:\n\n`;
    response += `✅ Strengths:\n`;
    review.strengths.forEach((strength: string) => {
      response += `  • ${strength}\n`;
    });
    response += `\n📝 Areas for Improvement:\n`;
    review.improvements.forEach((improvement: string) => {
      response += `  • ${improvement}\n`;
    });
    response += `\n💡 Tips:\n`;
    review.tips.forEach((tip: string) => {
      response += `  • ${tip}\n`;
    });
    response += `\nWould you like specific feedback on any section?`;
    return response;
  }

  private formatCareerPaths(paths: any): string {
    let response = `Career Path Recommendations:\n\n`;
    response += `🎯 Recommended Paths:\n\n`;
    paths.recommended.forEach((path: any) => {
      response += `📌 ${path.title}\n`;
      response += `   ${path.description}\n`;
      response += `   Skills: ${path.requiredSkills.join(', ')}\n`;
      response += `   Growth: ${path.growth}\n`;
      response += `   Salary Range: ${path.salary}\n\n`;
    });
    response += `🔄 Alternative Paths:\n\n`;
    paths.alternatives.forEach((path: any) => {
      response += `  • ${path.title} - ${path.description}\n`;
    });
    response += `\n🚀 Next Steps:\n`;
    paths.nextSteps.forEach((step: string) => {
      response += `  • ${step}\n`;
    });
    return response;
  }

  private generateGeneralGuidance(message: string, context: AgentContext): string {
    return `I'm your Career Guidance Agent! I can help you with:\n\n` +
      `- Finding and applying to internships\n` +
      `- Resume and CV review and feedback\n` +
      `- Career path recommendations\n` +
      `- Interview preparation tips\n` +
      `- Professional networking advice\n` +
      `- Salary and negotiation guidance\n\n` +
      `What aspect of your career would you like guidance on?`;
  }

  private updateAverageResponseTime(newTime: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.messagesProcessed - 1) + newTime;
    this.metrics.averageResponseTime = total / this.metrics.messagesProcessed;
  }
}

