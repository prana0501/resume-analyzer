#!/bin/bash

echo "🚀 Starting AI Resume Analyzer..."

# Check API key exists
if [ ! -f backend/.env ]; then
  echo "❌ Error: backend/.env not found."
  echo "   Run: cp backend/.env.example backend/.env"
  echo "   Then add your ANTHROPIC_API_KEY to backend/.env"
  exit 1
fi

# Start backend
echo "▸ Starting FastAPI backend on port 8000..."
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -r requirements.txt -q
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
sleep 2

# Start frontend
echo "▸ Starting React frontend on port 5173..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ App is running at http://localhost:5173"
echo "   API docs at    http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

# Handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'; exit" INT
wait
