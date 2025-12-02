# Architecture Documentation

## System Architecture Overview

EduAgent is built using a multi-agent architecture pattern with clear separation of concerns between agents, tools, session management, and observability.

## Core Components

### 1. Agent System

#### Base Agent (`lib/agents/base-agent.ts`)
- Abstract base class for all agents
- Provides common functionality: tool registration, metrics tracking, logging
- Implements the agent interface contract

#### Coordinator Agent (`lib/agents/coordinator-agent.ts`)
- Orchestrates communication between agents
- Implements intelligent routing based on message content
- Manages agent selection and delegation
- Maintains registry of all available agents

#### Specialized Agents
- **Academic Advisor**: Course guidance, degree planning
- **Skill Roadmap**: Learning path creation
- **Assignment Helper**: Task breakdown, deadline management
- **Career Guidance**: Internship advice, resume feedback

### 2. Session Management

#### InMemorySessionService (`lib/sessions/session-service.ts`)
- Manages user sessions and conversation history
- Maintains context across conversations
- Extracts and stores relevant information in memory
- Handles session lifecycle (create, update, delete)

**Key Features:**
- Session persistence in memory
- Automatic memory extraction from conversations
- Session cleanup for old sessions
- User session tracking

### 3. Memory System

#### Memory Bank (`lib/memory/memory-bank.ts`)
- Long-term storage for user information
- Tracks skills, courses, assignments, goals
- Provides retrieval and update operations
- Maintains user progress over time

**Memory Types:**
- Skills: Learning progress and proficiency
- Courses: Enrollment and completion
- Assignments: Tasks and deadlines
- Goals: User objectives and achievements

### 4. Tools Integration

#### Tool System (`lib/tools/tools.ts`)
- Google Search Tool (simulated)
- Code Execution Tool (simulated)
- Calendar Tool
- Custom Tools: Course lookup, skill assessment

**Tool Interface:**
```typescript
interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}
```

### 5. Observability

#### Logger (`lib/observability/logger.ts`)
- Structured logging with levels (DEBUG, INFO, WARN, ERROR)
- Log retention and filtering
- Agent-specific log tracking

#### Metrics Collector (`lib/observability/metrics.ts`)
- System-wide metrics tracking
- Agent-specific metrics
- Response time monitoring
- Error rate calculation

#### Tracer (`lib/observability/tracer.ts`)
- Distributed tracing for requests
- Span-based tracing
- Request flow visualization

## Data Flow

### Request Processing Flow

```
1. User sends message via ChatInterface
   ↓
2. POST /api/chat
   ↓
3. Session Service retrieves/creates session
   ↓
4. Coordinator Agent receives message
   ↓
5. Coordinator analyzes message and selects agent(s)
   ↓
6. Selected agent processes message
   - Uses tools if needed
   - Generates response
   ↓
7. Response returned to user
   ↓
8. Session and memory updated
   ↓
9. Metrics and logs recorded
```

### Agent Selection Algorithm

1. **Keyword Matching**: Analyze message for domain-specific keywords
2. **Capability Check**: Each agent reports if it can handle the message
3. **Scoring**: Calculate relevance score based on keyword matches
4. **Selection**: Choose agent with highest score
5. **Fallback**: If no agent matches, coordinator provides general response

## API Architecture

### RESTful API Endpoints

- `POST /api/chat` - Process chat messages
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Retrieve session(s)
- `GET /api/agents` - List all agents and metrics
- `GET /api/metrics` - System metrics
- `GET /api/memory` - Retrieve user memory
- `POST /api/memory` - Store memory entry

## Frontend Architecture

### Component Structure

```
app/
├── page.tsx (Main page, state management)
├── layout.tsx (Root layout, providers)
└── globals.css (Global styles)

components/
├── ChatInterface.tsx (Chat UI)
├── AgentDashboard.tsx (Metrics display)
├── Sidebar.tsx (Agent selection)
├── Header.tsx (User profile, navigation)
└── ProfileModal.tsx (User profile editor)
```

### State Management

- React hooks for local state
- localStorage for user preferences
- API calls for server state
- Real-time updates via polling

## Design Patterns

### 1. Strategy Pattern
- Different agents implement the same interface but different strategies
- Coordinator selects strategy based on context

### 2. Observer Pattern
- Metrics collector observes agent activities
- Logger observes system events

### 3. Factory Pattern
- Agent creation and registration
- Tool registration and instantiation

### 4. Singleton Pattern
- Session service instance
- Memory bank instance
- Logger, metrics, tracer instances

## Scalability Considerations

### Current Limitations
- In-memory storage (sessions and memory)
- Single instance deployment
- No database persistence

### Scaling Strategies
1. **Database Persistence**: Move sessions and memory to database
2. **Redis Caching**: Cache frequently accessed data
3. **Load Balancing**: Multiple instances behind load balancer
4. **Message Queue**: Async agent processing
5. **Microservices**: Split agents into separate services

## Security Considerations

### Current Implementation
- Basic input validation
- Error handling
- Session isolation

### Production Recommendations
- Authentication and authorization
- Rate limiting
- Input sanitization
- SQL injection prevention (if using SQL)
- XSS protection
- CSRF tokens
- Secure session storage

## Testing Strategy

### Unit Tests
- Agent logic testing
- Tool execution testing
- Session management testing

### Integration Tests
- API endpoint testing
- Agent coordination testing
- End-to-end flow testing

### Performance Tests
- Load testing
- Response time testing
- Concurrent session handling

## Future Enhancements

1. **LLM Integration**: Connect agents to actual LLM APIs
2. **Database**: Persistent storage for sessions and memory
3. **Real Tools**: Integrate actual Google Search, code execution
4. **Authentication**: User accounts and multi-user support
5. **Analytics**: Advanced reporting and insights
6. **Mobile App**: Native mobile application
7. **Voice Interface**: Speech-to-text and text-to-speech

