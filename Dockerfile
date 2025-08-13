# Multi-stage build for React SSE application

# Build stage for React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Runtime stage
FROM python:3.11-alpine
WORKDIR /app

# Install Node.js for serving the React app
RUN apk add --no-cache nodejs npm

# Copy backend
COPY backend.py .

# Copy built frontend from build stage
COPY --from=frontend-build /app/build ./build

# Install serve to serve the React app
RUN npm install -g serve

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'python3 backend.py &' >> /app/start.sh && \
    echo 'serve -s build -l 3000' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8000

# Start both servers
CMD ["/app/start.sh"]