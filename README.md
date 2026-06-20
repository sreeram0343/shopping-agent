# 🌌 RUNE AI: Luxury Glassmorphism Shopping Assistant

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/Agent-LangChain-3F51B5?style=for-the-badge&logo=chainlink&logoColor=white)](https://python.langchain.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

An advanced, AI-powered shopping assistant built with a **zero-gravity luxury aesthetic**. The interface is composed of translucent, frosted glassmorphism panels floating against a pristine, light-themed workspace with champagne gold, platinum, and charcoal details.

Powered by **Gemini (via Google API) & Groq LLMs** orchestrated with **LangChain**, this agent handles product searches, rating analysis, customer reviews aggregation, image description, and instant checkouts through an interactive chat interface.

---

## 🔮 Interactive UI/UX Masterpiece

- **Light Glassmorphism**: Translucent frosted crystal panels styled with a high-contrast white border, intense backdrop blur, and soft golden drop shadows.
- **Golden Gravity Core (Right Panel)**: An interactive HTML5 canvas rendering a cosmic golden light singularity. Features swirling gold and silver dust particles, orbiting 3D data nodes representing search criteria, and vector links that deflect gravitationally toward the user's cursor.
- **Suspended 3D Product Cards**: Zero-gravity hover animations where the product icons (e.g. headphones) float upward and rotate out of their container cards.
- **Spec Radar Chart**: An SVG-based hexagonal chart comparing audio specifications (ANC, Bass, Treble, Stage, Comfort, Battery) dynamically across candidate headphones.
- **Lotus of Serenity**: A pristine white breathing vector lotus flower drifting in the bottom left corner.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Desktop Optimized)
* **Framework**: React 19 (via Vite)
* **Styling**: Tailwind CSS v4 + Custom light glassmorphism variables
* **Animations**: Framer Motion + CSS Keyframes
* **Charts**: Recharts (Price Sparkline) + Custom Interactive SVG (Hexagonal Radar)

### Backend (Agentic Engine)
* **Framework**: FastAPI (Uvicorn server)
* **AI Orchestration**: LangChain (Groq-driven ChatLLM + Google Vision model)
* **Database**: SQLite (local schema tracking products, reviews, and checkout orders)

---

## 🔒 Production-Hardened Security

- **Custom Sliding-Window Rate Limiter**: Zero-dependency IP-based limiter protecting endpoints from abuse (15 chat requests/min, 5 uploads/min).
- **Strict Payload Validations**: Restricts queries to 3000 chars, chat transcripts to 10KB, and file uploads to a max of 5MB.
- **Dynamic CORS controls**: Dynamically loads allowed origins from an `ALLOWED_ORIGINS` environment variable.
- **API Error Masking**: Logs system exceptions internally while returning clean user-facing error details.
- **Structured Latency Logging**: Tracks execution timings and metrics for agent tools.

---

## 🚀 Step-by-Step Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sreeram0343/shopping-agent.git
cd shopping-agent
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Initialize & Seed Database
```bash
python setup_db.py
```

### 4. Run the Backend (FastAPI)
```bash
# Install dependencies
pip install -r requirements.txt

# Start uvicorn server
python main.py
```
The API documentation is accessible at `http://127.0.0.1:8000/docs`.

### 5. Run the Frontend (Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to interact with the dashboard.

---

## 🐳 Docker Containerization
Build and run the backend service locally using Docker:
```bash
# Build Image
docker build -t shopping-agent-backend .

# Run Container
docker run -p 8000:8000 --env-file .env shopping-agent-backend
```

---

## ☁️ Deployment Configurations

### Frontend (Vercel)
Link your repository to Vercel and specify:
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` pointing to your deployed backend API server.

### Backend (Render Blueprint)
Deploys automatically using the `render.yaml` blueprint. It provisions a Starter Web Service building from the `Dockerfile` and attaches a 1GB persistent storage disk at `/app/uploads` to store upload images securely.
