# Deployment Guide

This guide covers deploying the EduAgent system to production.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)
- A hosting platform (Vercel, AWS, Google Cloud, etc.)

## Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd edu-agent-system
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Build

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## Deployment Options

### Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t edu-agent .
   docker run -p 3000:3000 edu-agent
   ```

### Environment Variables

Create a `.env.production` file with:

```env
NODE_ENV=production
# Add any API keys or configuration here
```

## Production Considerations

### Performance Optimization

- Enable Next.js caching
- Use CDN for static assets
- Implement rate limiting
- Add database connection pooling (if using database)

### Security

- Implement authentication and authorization
- Use HTTPS
- Add CORS configuration
- Implement rate limiting
- Sanitize user inputs
- Use environment variables for secrets

### Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor API response times
- Track user sessions
- Set up alerts for errors

### Scaling

- Use load balancer for multiple instances
- Implement session storage in Redis or database
- Use message queue for agent processing
- Consider serverless deployment

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find and kill process on port 3000
   lsof -ti:3000 | xargs kill
   ```

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Memory Issues**
   - Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

## Support

For issues or questions, please refer to the main README.md or open an issue in the repository.

