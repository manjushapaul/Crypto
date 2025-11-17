#!/bin/bash

# Crypto Dashboard - Clean Start Script
# Run this whenever you need to start the dev server on port 3000

echo "🧹 Cleaning up processes and caches..."

# Kill all Node processes and free ports
kill -9 $(lsof -ti:3000) 2>/dev/null
kill -9 $(lsof -ti:3002) 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 2

# Remove build cache
rm -rf .next
echo "✅ Cache cleared"

# Verify port is free
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "❌ Port 3000 still in use. Please close other applications using this port."
    exit 1
fi

echo "✅ Port 3000 is free"
echo "🚀 Starting server on http://localhost:3000..."
echo ""

# Start development server
npm run dev



