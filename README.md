# 🚀 PrepAI - AI Mock Interview & Career Assessment Platform

A full-stack, industry-standard AI Mock Interview platform designed to simulate end-to-end technical, behavioral (HR), and Group Discussion (GD) interview rounds with real-time voice recognition, AI evaluation, and detailed PDF feedback reporting.

---

## 📌 Project Overview

PrepAI provides candidates with a realistic practice environment featuring:
- **Technical Round Master (50 Q&A)**: Full-stack concepts (React, JavaScript, Node.js, Express, SQL, MongoDB, System Architecture).
- **HR Behavioral Round (30 Q&A)**: STAR framework-guided questions and model answers.
- **Group Discussion Master (20 Topics)**: Analytical arguments, opening strategies, and conclusion summaries.
- **Real-Time Voice Typing**: Hardware-resilient Web Speech API integration with instant mute/unmute controls and zero text leakage.
- **AI Correctness Evaluation**: Generative AI scoring (0–100%), gap detection, and model solution generation.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite 5, Lucide React, Web Speech API (`webkitSpeechRecognition`, `speechSynthesis`).
- **Backend**: Node.js, Express.js, Concurrently, CORS, Body-Parser.
- **AI Engines**: Google Gemini API (`@google/generative-ai`), OpenAI ChatGPT API (`openai`).
- **Database & Storage**: Embedded Lowdb / JSON Data Engine (`db.json`) supporting Mongoose/MongoDB drivers.

---

## 📂 Folder Structure

```
AI_Interview_Project/
│
├── frontend/                     # Client-side React Application
│   ├── public/                   # Static public assets
│   ├── src/                      # Components, utils, styles & application logic
│   │   ├── components/           # React UI components (InterviewRoom, HrGdMaster, etc.)
│   │   ├── utils/                # API client discovery & speechUtils helper modules
│   │   ├── App.jsx               # Root application component
│   │   └── main.jsx              # Application entry point
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration with API proxy target
│
├── backend/                      # Server-side Express API
│   ├── config/                   # Database configuration (db.js, db.json)
│   ├── controllers/              # Request handlers (interview, questions, resume, etc.)
│   ├── data/                     # Question vaults (presetQuestions.json)
│   ├── routes/                   # API modular route definitions
│   ├── services/                 # AI Service (aiService.js), PDF parsing
│   ├── index.js                  # Main server entry point (Port 6000 fallback)
│   └── package.json              # Backend dependencies and scripts
│
├── README.md                     # Root project documentation
└── package.json                  # Root monorepo workspace scripts
```

---

## ⚙️ Installation Instructions

1. **Clone or Navigate to the Repository**:
   ```bash
   cd AI_Interview_Project
   ```

2. **Install Root Dependencies**:
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

---

## 🚀 Startup Commands

### Run Frontend and Backend Concurrently (Recommended):
From the root directory:
```bash
npm start
```
*Frontend runs on `http://localhost:3000/` and Backend runs on `http://localhost:6000/`.*

### Run Backend Independently:
From the root directory:
```bash
npm run backend
```
Or directly inside the `backend/` folder:
```bash
cd backend
npm start
```

### Run Frontend Independently:
From the root directory:
```bash
npm run frontend
```
Or directly inside the `frontend/` folder:
```bash
cd frontend
npm run dev
```

---

## 🔑 Environment Variable Configuration

Create a `.env` file in the `backend/` directory to configure API keys:

```env
# Backend Server Port
PORT=6000

# Google Gemini AI API Key (Optional / Enabled in aiService.js)
GEMINI_API_KEY=your_google_gemini_api_key_here

# OpenAI ChatGPT API Key (Optional / Enabled in aiService.js)
OPENAI_API_KEY=your_openai_api_key_here
```

---

## ✅ Verification & Status

- **Frontend Build**: Verified via `npm run build` inside `frontend/`.
- **Backend API**: Verified via healthcheck endpoint `http://localhost:6000/api/health`.
- **Speech Engine**: Verified Web Speech API continuous mode with instant mute/unmute.
