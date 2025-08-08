#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Full Stack Application...${NC}"

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to install dependencies if node_modules doesn't exist
install_dependencies() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${YELLOW}Installing $name dependencies...${NC}"
        cd "$dir"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install $name dependencies${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}$name dependencies already installed${NC}"
    fi
}

# Install dependencies for server
echo -e "${BLUE}Checking server dependencies...${NC}"
install_dependencies "$SCRIPT_DIR/server" "server"

# Install dependencies for client
echo -e "${BLUE}Checking client dependencies...${NC}"
install_dependencies "$SCRIPT_DIR/client" "client"

echo -e "${GREEN}All dependencies are ready!${NC}"
echo -e "${BLUE}Starting server and client...${NC}"

# Function to cleanup background processes on script exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down server and client...${NC}"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    wait $SERVER_PID $CLIENT_PID 2>/dev/null
    echo -e "${GREEN}Application stopped.${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start the server in background
echo -e "${GREEN}Starting server on port 3000...${NC}"
cd "$SCRIPT_DIR/server"
npm run dev &
SERVER_PID=$!

# Wait a bit for the server to start
sleep 3

# Start the client in background
echo -e "${GREEN}Starting React client (Vite dev server)...${NC}"
cd "$SCRIPT_DIR/client"
npm run dev &
CLIENT_PID=$!

# Wait a bit for the client to start
sleep 2

echo -e "${GREEN}✅ Application is starting up!${NC}"
echo -e "${BLUE}Server: http://localhost:3000${NC}"
echo -e "${BLUE}Client: http://localhost:5173${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both server and client${NC}"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
