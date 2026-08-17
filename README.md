# AI Resume Analyzer

An AI-powered resume analyzer built with FastAPI + React + Claude API.
Paste any job description and your resume — get a fit score, keyword gap analysis, tailored resume summary, and cover letter opening instantly.

---

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # API key template
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── InputPanel.jsx
│   │       ├── InputPanel.css
│   │       ├── ResultPanel.jsx
│   │       └── ResultPanel.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── start.sh                 # One-command startup
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Anthropic API key → https://console.anthropic.com

---

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Create an account / log in
3. Go to API Keys → Create Key
4. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Set up the backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env

# Open .env and paste your API key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

### Step 3 — Set up the frontend

```bash
cd frontend
npm install
```

---

### Step 4 — Run the app

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

### Or use the one-command startup script (Mac/Linux)

```bash
chmod +x start.sh
./start.sh
```

---

## How it works

1. You paste a job description and your resume
2. The React frontend sends both to the FastAPI backend
3. FastAPI calls Claude API with a structured prompt
4. Claude returns a JSON analysis with scores, gaps, and rewrites
5. The frontend renders the results with copy-paste buttons

---

## Features

- **Fit score** (1–10) with 4 sub-scores: skills, experience, keywords, impact
- **Keyword gap analysis** — matching vs missing keywords highlighted
- **5 specific recommendations** on what to fix before applying
- **Tailored resume summary** — rewritten for that exact JD
- **Cover letter opening** — 3 paragraphs personalized to the role

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | FastAPI + Python |
| AI | Anthropic Claude Sonnet |
| Styling | Pure CSS (no framework) |

---

## Deploying online (optional)

- **Frontend**: Deploy to Vercel — drag the `frontend` folder, done
- **Backend**: Deploy to Railway or Render — connect GitHub, set `ANTHROPIC_API_KEY` env var
- Update the Vite proxy in `vite.config.js` to point to your deployed backend URL
