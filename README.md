# EduAgent - Multi-Agent Educational Assistance System

A comprehensive, production-ready multi-agent system designed to help engineering students with academic guidance, skill development, assignment management, and career planning.

## 🎯 Project Overview

EduAgent is a sophisticated AI-powered educational assistant that uses multiple specialized agents to provide comprehensive support to engineering students. The system demonstrates advanced concepts in multi-agent systems, including agent orchestration, session management, memory systems, tool integration, and observability.

## ✨ Features

### Multi-Agent System
- **Academic Advisor Agent**: Provides course guidance, degree planning, and academic strategy
- **Skill Roadmap Agent**: Creates personalized learning paths for technical skills
- **Assignment Helper Agent**: Assists with homework, project planning, and deadline management
- **Career Guidance Agent**: Offers internship advice, resume feedback, and career path recommendations
- **Coordinator Agent**: Orchestrates communication between agents and manages routing

### Core Capabilities
- ✅ **Multi-agent system** with intelligent routing and delegation
- ✅ **Session & Memory Management** (InMemorySessionService, Memory Bank)
- ✅ **Tool Integration** (Google Search simulation, code execution, custom tools)
- ✅ **Observability** (Logging, Tracing, Metrics)
- ✅ **Long-term Memory** for tracking student progress and preferences
- ✅ **Real-time Chat Interface** with agent switching
- ✅ **Progress Tracking** for skills, courses, and assignments
- ✅ **Modern UI/UX** with dark/light mode and responsive design

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Chat   │  │ Dashboard│  │ Sidebar  │            │
│  │Interface │  │          │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  API Routes (Next.js API)              │
│  /api/chat  /api/sessions  /api/agents  /api/metrics   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Coordinator Agent (Orchestrator)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Agent Selection & Routing Logic                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Academic   │  │    Skill     │  │ Assignment   │
│   Advisor    │  │   Roadmap    │  │   Helper     │
└──────────────┘  └──────────────┘  └──────────────┘
        │
        ▼
┌──────────────┐
│    Career    │
│   Guidance   │
└──────────────┘
```

### Agent Communication Flow

1. User sends a message through the chat interface
2. Coordinator Agent receives the message and analyzes it
3. Coordinator selects the most appropriate agent(s) based on message content
4. Selected agent processes the message using its specialized tools
5. Response is returned to the user with agent identification
6. Session and memory systems are updated with the interaction

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- TypeScript knowledge (helpful but not required)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edu-agent-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file (optional for basic functionality):

```env
# Optional: Add OpenAI API key if you want to enhance agents with LLM capabilities
OPENAI_API_KEY=your_api_key_here
```

## 📁 Project Structure

```
edu-agent-system/
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── chat/         # Chat endpoint
│   │   ├── sessions/     # Session management
│   │   ├── agents/       # Agent information
│   │   ├── metrics/      # System metrics
│   │   └── memory/       # Memory operations
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/            # React components
│   ├── ChatInterface.tsx
│   ├── AgentDashboard.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── ProfileModal.tsx
├── lib/
│   ├── agents/           # Agent implementations
│   │   ├── base-agent.ts
│   │   ├── coordinator-agent.ts
│   │   ├── academic-advisor-agent.ts
│   │   ├── skill-roadmap-agent.ts
│   │   ├── assignment-helper-agent.ts
│   │   ├── career-guidance-agent.ts
│   │   └── types.ts
│   ├── sessions/         # Session management
│   │   └── session-service.ts
│   ├── memory/           # Memory systems
│   │   └── memory-bank.ts
│   ├── tools/            # Tool implementations
│   │   └── tools.ts
│   └── observability/    # Logging, tracing, metrics
│       ├── logger.ts
│       ├── metrics.ts
│       └── tracer.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎓 Usage Examples

### Academic Guidance
```
User: "What courses should I take as a Computer Science sophomore?"
Agent: Academic Advisor provides course recommendations based on major and year
```

### Skill Development
```
User: "I want to learn React, create a roadmap for me"
Agent: Skill Roadmap Agent creates a personalized learning path
```

### Assignment Help
```
User: "Help me break down my software engineering project"
Agent: Assignment Helper Agent creates a task breakdown with deadlines
```

### Career Guidance
```
User: "I need advice on finding internships"
Agent: Career Guidance Agent provides internship tips and resources
```

## 🔧 Technical Implementation Details

### Multi-Agent System
- **Base Agent Class**: Abstract base class with common functionality
- **Agent Selection**: Intelligent routing based on message content analysis
- **Agent Delegation**: Agents can delegate to other agents when needed
- **Tool System**: Each agent can register and use custom tools

### Session Management
- **InMemorySessionService**: Manages user sessions and conversation history
- **Session Persistence**: Sessions stored in memory (can be extended to database)
- **Context Management**: Maintains user profile and conversation context

### Memory Systems
- **Memory Bank**: Long-term storage for skills, courses, assignments, and goals
- **Progress Tracking**: Tracks learning progress across different skills
- **Context Extraction**: Automatically extracts and stores relevant information

### Observability
- **Logging**: Comprehensive logging system with different log levels
- **Tracing**: Distributed tracing for request flows
- **Metrics**: Real-time metrics collection (response times, error rates, etc.)

### Tools Integration
- **Google Search Tool**: Simulated search functionality
- **Code Execution Tool**: Simulated code execution environment
- **Calendar Tool**: Event creation and management
- **Custom Tools**: Course lookup, skill assessment, etc.

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface with smooth animations
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live metrics and agent status updates
- **Agent Switching**: Easy selection of specific agents or automatic routing
- **Progress Visualization**: Visual indicators for learning progress

## 📊 Success Metrics

The system demonstrates:
- ✅ Effective inter-agent communication without conflicts
- ✅ Responsive and intuitive UI for student users
- ✅ Reliable handling of concurrent user sessions
- ✅ Clear educational value and time savings
- ✅ Production-ready code quality and error handling

## 🔮 Future Enhancements

- Integration with actual LLM APIs (OpenAI, Anthropic, etc.)
- Database persistence for sessions and memory
- Real Google Search API integration
- Secure code execution environment
- User authentication and multi-user support
- Advanced analytics and reporting
- Mobile app version
- Voice interface support

## 🛠️ Development

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Next.js for server-side rendering and API routes

## 📝 License

This project is created for the 5-Day AI Agents Intensive Course with Google competition.

## 👥 Authors

Built as a capstone project demonstrating multi-agent system capabilities.

## 🙏 Acknowledgments

- Google AI Agents Course for the learning framework
- Next.js team for the excellent framework
- The open-source community for inspiration and tools

---

**Note**: This is a demonstration project. For production use, consider adding:
- Proper authentication and authorization
- Database persistence
- Rate limiting and security measures
- Enhanced error handling
- Comprehensive testing suite
- CI/CD pipeline

