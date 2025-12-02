import { BaseAgent } from './base-agent';
import { AcademicAdvisorAgent } from './academic-advisor-agent';
import { SkillRoadmapAgent } from './skill-roadmap-agent';
import { AssignmentHelperAgent } from './assignment-helper-agent';
import { CareerGuidanceAgent } from './career-guidance-agent';
import { AgentContext, AgentResponse, AgentMessage } from './types';

export class CoordinatorAgent extends BaseAgent {
  private agents: Map<string, BaseAgent>;
  private agentCapabilities: Map<string, (message: string, context: AgentContext) => boolean>;

  constructor() {
    super(
      'coordinator',
      'Coordinator Agent',
      'Orchestrates communication between agents and manages user sessions'
    );

    // Initialize all agents
    this.agents = new Map();
    const academicAgent = new AcademicAdvisorAgent();
    const skillAgent = new SkillRoadmapAgent();
    const assignmentAgent = new AssignmentHelperAgent();
    const careerAgent = new CareerGuidanceAgent();

    this.agents.set(academicAgent.getId(), academicAgent);
    this.agents.set(skillAgent.getId(), skillAgent);
    this.agents.set(assignmentAgent.getId(), assignmentAgent);
    this.agents.set(careerAgent.getId(), careerAgent);

    // Build capability map
    this.agentCapabilities = new Map();
    this.agents.forEach((agent, id) => {
      this.agentCapabilities.set(id, (msg, ctx) => agent.canHandle(msg, ctx));
    });

    this.log('Coordinator initialized with all agents');
  }

  canHandle(message: string, context: AgentContext): boolean {
    // Coordinator can handle any message by delegating
    return true;
  }

  async process(message: string, context: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now();
    this.metrics.messagesProcessed++;

    try {
      this.log(`Coordinating message: ${message.substring(0, 50)}...`);

      // Find the best agent(s) to handle this message
      const selectedAgents = this.selectAgents(message, context);

      if (selectedAgents.length === 0) {
        return {
          content: "I'm not sure which agent can best help with that. Could you provide more context? I have agents for:\n\n" +
            "• Academic Advisor - Course guidance and degree planning\n" +
            "• Skill Roadmap - Learning paths and skill development\n" +
            "• Assignment Helper - Homework and project assistance\n" +
            "• Career Guidance - Internships and career advice",
          agentId: this.id,
        };
      }

      // If multiple agents can handle, use the one with highest priority
      // In a more sophisticated system, we could use multiple agents in parallel
      const primaryAgent = selectedAgents[0];
      const agent = this.agents.get(primaryAgent.id);

      if (!agent) {
        throw new Error(`Agent ${primaryAgent.id} not found`);
      }

      this.log(`Delegating to ${agent.getName()}`);

      // Process with selected agent
      const response = await agent.process(message, context);

      // Check if agent wants to delegate
      if (response.shouldDelegate && response.delegateTo) {
        const delegateAgent = this.agents.get(response.delegateTo);
        if (delegateAgent) {
          this.log(`Agent ${agent.getName()} delegating to ${delegateAgent.getName()}`);
          this.metrics.delegations++;
          return await delegateAgent.process(message, context);
        }
      }

      const responseTime = Date.now() - startTime;
      this.updateAverageResponseTime(responseTime);

      return {
        ...response,
        metadata: {
          ...response.metadata,
          coordinatorTime: responseTime,
          selectedAgent: primaryAgent.id,
        },
      };
    } catch (error) {
      this.metrics.errors++;
      this.log(`Error in coordination: ${error}`, 'error');
      return {
        content: 'I encountered an error while processing your request. Please try again.',
        agentId: this.id,
        metadata: { error: String(error) },
      };
    }
  }

  private selectAgents(message: string, context: AgentContext): Array<{ id: string; score: number }> {
    const scores: Array<{ id: string; score: number }> = [];

    this.agentCapabilities.forEach((canHandle, agentId) => {
      if (canHandle(message, context)) {
        // Calculate a score based on how well the agent can handle this
        // For now, we'll use a simple binary score, but this could be more sophisticated
        const agent = this.agents.get(agentId);
        if (agent) {
          // Count keyword matches for a simple scoring mechanism
          const score = this.calculateRelevanceScore(message, agentId);
          scores.push({ id: agentId, score });
        }
      }
    });

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    return scores;
  }

  private calculateRelevanceScore(message: string, agentId: string): number {
    const lowerMessage = message.toLowerCase();
    let score = 0;

    const keywordMap: Record<string, string[]> = {
      'academic-advisor': ['course', 'degree', 'prerequisite', 'graduation', 'academic', 'major', 'gpa'],
      'skill-roadmap': ['skill', 'learn', 'roadmap', 'tutorial', 'programming', 'python', 'react'],
      'assignment-helper': ['assignment', 'homework', 'project', 'deadline', 'task', 'help with'],
      'career-guidance': ['career', 'internship', 'resume', 'job', 'interview', 'application'],
    };

    const keywords = keywordMap[agentId] || [];
    keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        score += 1;
      }
    });

    return score;
  }

  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  private updateAverageResponseTime(newTime: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.messagesProcessed - 1) + newTime;
    this.metrics.averageResponseTime = total / this.metrics.messagesProcessed;
  }
}

