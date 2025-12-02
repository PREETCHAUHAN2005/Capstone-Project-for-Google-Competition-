# Quick Start Guide

Get up and running with EduAgent in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

## Step 3: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Step 4: Set Up Your Profile

1. Click "Set Up Profile" in the header
2. Enter your information:
   - Name
   - Major (e.g., Computer Science)
   - Year (Freshman, Sophomore, etc.)
   - Interests (optional)
   - Goals (optional)
3. Click "Save Profile"

## Step 5: Start Chatting!

Try these example queries:

### Academic Guidance
- "What courses should I take as a Computer Science sophomore?"
- "What are the prerequisites for CS 201?"
- "Help me create a degree plan"

### Skill Development
- "I want to learn Python, create a roadmap"
- "What resources do you recommend for learning React?"
- "I'm at 60% progress with JavaScript"

### Assignment Help
- "Help me break down my software engineering project"
- "Create a task list for my database assignment due next week"
- "I need help planning my capstone project"

### Career Guidance
- "I need advice on finding internships"
- "Review my resume"
- "What career paths are available for Computer Science majors?"

## Features to Explore

1. **Agent Selection**: Click on different agents in the sidebar to route your questions
2. **Dark Mode**: Toggle dark/light mode using the button in the sidebar
3. **Metrics Dashboard**: View real-time system metrics in the right panel
4. **Progress Tracking**: The system remembers your skills and progress

## Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process
lsof -ti:3000 | xargs kill
# Or use a different port
PORT=3001 npm run dev
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

Happy learning! 🎓

