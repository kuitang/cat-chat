# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- **Start both servers**: `./run.sh` - Starts backend (Python SSE server on port 8000) and frontend (React dev server on port 3000) with logging
- **Frontend only**: `npm start` - Runs React development server on port 3000
- **Backend only**: `python3 backend.py` - Runs Python SSE server on port 8000
- **Build production**: `npm run build` - Creates optimized production build in `build/` directory
- **Run tests**: `npm test` - Runs Jest tests in watch mode
- **Install dependencies**: `npm install` - Installs all npm packages

### Process Management
- **Kill servers**: Use the PIDs printed by `run.sh`, e.g., `kill $BACKEND_PID $FRONTEND_PID`
- **View logs**: Logs are saved in `logs/` directory with timestamps, e.g., `tail -f logs/backend_TIMESTAMP.log`

## Architecture

This is a React-based Server-Sent Events (SSE) demonstration application with a Python backend.

### Backend (`backend.py`)
- Pure Python HTTP server using only built-in libraries (no external dependencies)
- Serves SSE stream at `/events` endpoint
- Sends JSON messages with `timestamp`, `message`, and `image` fields
- Fetches random cat images from The Cat API
- Messages sent at random intervals (1-5 seconds)
- CORS headers enabled for cross-origin requests

### Frontend (React + Tailwind CSS)
- **App.js**: Main component that establishes SSE connection and manages message state
- **ChatMessage.js**: Renders individual messages with text, image, and timestamp
- Uses EventSource API to consume SSE stream from backend
- Auto-scrolls to new messages when images load
- Tailwind CSS for styling with modern, rounded corners design
- Read-only chat interface (no sending capability)

### Key Implementation Details
- Frontend connects to `http://localhost:8000/events` for SSE stream
- Messages are displayed in chronological order with local timestamp formatting
- Images have fallback error handling with graceful degradation
- Both servers run in background using `nohup` with separate log files per session