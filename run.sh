#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Generate unique timestamp for log files
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Log file paths
BACKEND_LOG="logs/backend_${TIMESTAMP}.log"
FRONTEND_LOG="logs/frontend_${TIMESTAMP}.log"

echo "Starting React SSE Demo..."
echo "================================"

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start backend server
echo "Starting backend server..."
nohup python3 backend.py > "$BACKEND_LOG" 2>&1 &
export BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo "Backend log: $BACKEND_LOG"

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo ""
echo "Starting frontend server..."
PORT=3000 nohup npm start > "$FRONTEND_LOG" 2>&1 &
export FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
echo "Frontend log: $FRONTEND_LOG"

echo ""
echo "================================"
echo "Servers are running!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend SSE: http://localhost:8000/events"
echo ""
echo "To stop the servers, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "To view logs:"
echo "  tail -f $BACKEND_LOG"
echo "  tail -f $FRONTEND_LOG"
echo "================================"