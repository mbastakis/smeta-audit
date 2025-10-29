#!/bin/bash

echo "========================================"
echo "  SMETA Compliance Platform"
echo "  Starting application..."
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js detected:"
node --version
echo ""

# Navigate to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"

# Check if backend is built
if [ ! -f "dist/server.js" ]; then
    echo "ERROR: Backend not built!"
    echo ""
    echo "Please run the following commands first:"
    echo "  cd backend"
    echo "  npm run build"
    echo ""
    exit 1
fi

# Set environment to production
export NODE_ENV=production

# Start the server
echo "Starting server on http://localhost:5001..."
echo ""
node dist/server.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check if server is still running
if ! ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "ERROR: Server failed to start!"
    echo "Check the logs above for error details."
    exit 1
fi

# Open browser
echo "Opening browser..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5001 2>/dev/null
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5001 2>/dev/null || echo "Please open http://localhost:5001 in your browser"
fi

echo ""
echo "========================================"
echo "  Platform is running!"
echo "========================================"
echo ""
echo "The application is now running at:"
echo "http://localhost:5001"
echo ""
echo "Server PID: $SERVER_PID"
echo "Press Ctrl+C to stop the server."
echo ""

# Handle Ctrl+C gracefully
trap "echo ''; echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null; echo 'Server stopped.'; exit" INT TERM

# Wait for server process
wait $SERVER_PID
