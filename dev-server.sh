#!/bin/bash
# Local Development Server for CARB PWA Portal
# This script starts a simple Python HTTP server for local development

PORT=${1:-8000}

echo "🚀 Starting CARB Portal development server..."
echo "📍 Server will be available at: http://localhost:$PORT"
echo "📱 For mobile testing, use your local IP address"
echo ""
echo "💡 To test PWA features:"
echo "   1. Open in Chrome/Edge: http://localhost:$PORT"
echo "   2. Open DevTools (F12)"
echo "   3. Go to Application > Service Workers"
echo "   4. Check Manifest and Storage"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server $PORT
