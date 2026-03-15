# 🚀 ResumeAI – AI-Powered Resume Analyzer & Interview Prep

A full-stack platform that analyzes resumes, calculates ATS scores, detects skill gaps, and runs AI mock interviews.

---

## 📁 Folder Structure

```
resume-analyzer/
├── frontend/                   # React + Tailwind CSS app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js       # Sidebar + main layout
│   │   ├── context/
│   │   │   └── ResumeContext.js # Global state
│   │   ├── pages/
│   │   │   ├── Landing.js      # Home page
│   │   │   ├── Dashboard.js    # Analysis results
│   │   │   ├── ResumeUpload.js # PDF upload
│   │   │   ├── JobMatch.js     # JD comparison
│   │   │   ├── InterviewPrep.js# Question bank
│   │   │   └── MockInterview.js# AI mock session
│   │   ├── utils/
│   │   │   └── api.js          # Axios API calls
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
├── backend/                    # Node.js + Express API
│   ├── routes/
│   │   ├── health.js           # GET /api/health
│   │   ├── resume.js           # POST /api/resume/*
│   │   └── interview.js        # POST /api/interview/*
│   ├── utils/
│   │   ├── openai.js           # GPT wrapper
│   │   ├── resumeParser.js     # PDF parse + AI extract
│   │   ├── jobMatcher.js       # Job match scoring
│   │   ├── interviewGenerator.js # Q gen + feedback
│   │   └── store.js            # In-memory session store
│   ├── server.js               # Express entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── vercel.json                 # Vercel deploy config
├── package.json                # Root monorepo scripts
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js v18+ (`node --version`)
- npm v9+
- OpenAI API key (https://platform.openai.com/api-keys)

### Step 1 – Clone / extract the project
```bash
# If cloned from GitHub:
git clone https://github.com/YOUR_USERNAME/resume-analyzer.git
cd resume-analyzer

# Or if you have the zip:
unzip resume-analyzer.zip
cd resume-analyzer
```

### Step 2 – Install dependencies
```bash
# Install all at once (requires root package.json devDep)
npm install
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### Step 3 – Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Open .env and set your OpenAI key:
# OPENAI_API_KEY=sk-...
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Default is already set to http://localhost:5000/api
# No changes needed for local dev
```

### Step 4 – Run the app
```bash
# From root — runs both backend and frontend:
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:3000
```

Open http://localhost:3000 in your browser. ✅

---

## 🌐 Deployment (Free Hosting)

### Option A: Render.com (Recommended – 100% Free)

**Deploy Backend to Render:**

1. Go to https://render.com → Sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Name:** `resume-ai-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variable:
   - `OPENAI_API_KEY` = your key
   - `NODE_ENV` = `production`
6. Click **Create Web Service**
7. Copy your backend URL: `https://resume-ai-backend.onrender.com`

**Deploy Frontend to Vercel:**

1. Go to https://vercel.com → Sign up with GitHub
2. Click **New Project** → Import your repo
3. Set:
   - **Framework:** `Create React App`
   - **Root Directory:** `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://resume-ai-backend.onrender.com/api`
5. Click **Deploy**
6. Your live URL: `https://resume-ai.vercel.app` ✨

---

### Option B: Railway.app (Backend) + Vercel (Frontend)

**Backend on Railway:**
```bash
npm install -g @railway/cli
cd backend
railway login
railway init
railway up
# Set env var: OPENAI_API_KEY in Railway dashboard
```

---

### Option C: Vercel Serverless (Full-stack on Vercel)

The `vercel.json` at project root is already configured. Just:
```bash
npm install -g vercel
vercel login
vercel          # follow prompts
# Set OPENAI_API_KEY in Vercel dashboard → Settings → Environment Variables
```

---

## 📤 Push to GitHub

```bash
# Step 1: Create repo on github.com (don't init with README)

# Step 2: From project root:
git init
git add .
git commit -m "feat: initial commit – ResumeAI platform"

# Step 3: Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/resume-analyzer.git
git branch -M main
git push -u origin main
```

> ⚠️ NEVER commit your `.env` file. The `.gitignore` already excludes it.

---

## 🔗 Adding Live Link to Your Resume

Once deployed, add this to the **Projects** section of your resume:

```
ResumeAI – AI Resume Analyzer & Interview Platform
Tech: React, Node.js, OpenAI GPT-3.5, Tailwind CSS
Live: https://your-app.vercel.app
Code: https://github.com/YOUR_USERNAME/resume-analyzer
```

For portfolio/LinkedIn, use a short description:
> "Built a full-stack AI platform that parses resumes, calculates ATS scores using GPT, detects skill gaps vs job descriptions, and runs AI-powered mock interviews with scored feedback."

---

## 🔑 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health check |
| POST | `/api/resume/upload` | Upload PDF, returns resumeId |
| POST | `/api/resume/analyze` | AI parse + ATS score |
| POST | `/api/resume/job-match` | Compare with job description |
| POST | `/api/interview/generate-questions` | Generate interview questions |
| POST | `/api/interview/feedback` | Score a mock answer |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 4, Multer |
| AI | OpenAI GPT-3.5-turbo |
| PDF | pdf-parse |
| Charts | Recharts, react-circular-progressbar |
| Hosting | Vercel (frontend) + Render (backend) |

---

## 🐛 Troubleshooting

**"Resume session not found"** – Sessions expire after 2 hours. Re-upload the PDF.

**"OPENAI_API_KEY not set"** – Make sure your `.env` file exists in `/backend` and has the key.

**PDF text extraction fails** – The PDF must be text-based (not a scanned image). Use a PDF editor to export as text-based PDF.

**CORS errors in browser** – Set `CLIENT_URL` in backend `.env` to your frontend URL.

**Render free tier cold start** – First request may take 30-60 seconds as the server spins up.

---

## 📄 License

MIT – free to use, modify, and deploy.
