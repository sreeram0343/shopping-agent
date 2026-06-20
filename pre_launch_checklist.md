# Production Deployment & Pre-Launch Checklist

This checklist guarantees a stable, secure, and fully verified launch of the zero-gravity AI shopping assistant. Follow these steps sequentially to complete frontend (Vercel) and backend (Render/Docker) deployments.

---

## 📋 1. Environment Variable Setup

### Backend (Render / GCP)
Ensure the following variables are configured in your backend host dashboard:
- `PORT` = `8000`
- `GROQ_API_KEY` = `gsk_...` (valid Groq API key)
- `GOOGLE_API_KEY` = `AIzaSy...` (valid Google/Gemini API key for vision tasks)
- `ALLOWED_ORIGINS` = `https://<your-frontend>.vercel.app` (comma-separated list of permitted origins, e.g. Vercel deployment URLs)
- `PYTHONUNBUFFERED` = `1`

### Frontend (Vercel)
Ensure the Vercel dashboard environment variables include:
- `VITE_API_URL` = `https://<your-backend-service>.onrender.com` (points to the Render web service URL)

---

## 🚀 2. Frontend Deployment (Vercel)

### Step-by-Step Linking
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Select your GitHub repository `sreeram0343/shopping-agent` and click **Import**.
3. In the project settings configuration:
   * **Framework Preset**: `Vite` (automatically detected).
   * **Root Directory**: `frontend` (change this since the frontend codebase is in the `frontend/` subdirectory).
   * **Build Command**: `npm run build`.
   * **Output Directory**: `dist`.
4. Open the **Environment Variables** accordion and add `VITE_API_URL` pointing to your deployed backend URL.
5. Click **Deploy**. Vercel will build and trigger deployments on every push to `main`.

---

## 🐳 3. Backend Deployment (Render via Docker)

### Step-by-Step Blueprint Deploy
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **Blueprint**.
3. Link your GitHub repository `sreeram0343/shopping-agent`.
4. Render will read the `render.yaml` file in the root directory and configure the service automatically:
   * It will build the service using the `Dockerfile`.
   * It will provision a persistent disk `uploads-disk` (Starter plan) at `/app/uploads` to store uploaded image matches.
5. Input the values for `GROQ_API_KEY` and `GOOGLE_API_KEY` when prompted by Render.
6. Click **Apply**. The container will compile and seed `store.db` automatically on deploy.

---

## 🔒 4. Pre-Launch Verification Procedures

### Check 1: Health Status Endpoint
- **Action**: Open `https://<your-backend>.onrender.com/api/health` in a browser.
- **Expected Outcome**: Returns `{"status": "ok"}` with a `200 OK` status code.

### Check 2: CORS Rejection Check
- **Action**: Run a terminal request from an unauthorized local origin:
  ```bash
  curl -i -H "Origin: https://unauthorized-domain.com" \
       -H "Access-Control-Request-Method: POST" \
       -X OPTIONS https://<your-backend>.onrender.com/api/chat
  ```
- **Expected Outcome**: The response header should **not** contain `Access-Control-Allow-Origin: https://unauthorized-domain.com` and must block/reject the pre-flight request.

### Check 3: Rate Limiter Verification
- **Action**: Script multiple concurrent calls to the chat API:
  ```bash
  for i in {1..20}; do 
    curl -s -o /dev/null -w "%{http_code}\n" -X POST \
      -H "Content-Type: application/json" \
      -d '{"messages":[{"role":"user","content":"test"}]}' \
      https://<your-backend>.onrender.com/api/chat
  done
  ```
- **Expected Outcome**: The first 15 requests return `200 OK`. The 16th and subsequent requests within the minute must return `429 Too Many Requests`.

### Check 4: Payload Size Hard Limits
- **Action**: Attempt to upload a file larger than 5MB (e.g. a 7MB image) or send a query longer than 3000 characters.
- **Expected Outcome**: Server returns:
  * `413 Payload Too Large` for large files or excessive transcripts.
  * `400 Bad Request` for messages over 3000 characters.

### Check 5: Log Telemetry Review
- **Action**: Trigger a chat search request for headphones on the live app and inspect Render server log outputs.
- **Expected Outcome**: Log streams should display timestamped metrics:
  ```text
  2026-06-20 18:10:00 [INFO] shopping_agent: Executing search_products: query='headphones'...
  2026-06-20 18:10:01 [INFO] shopping_agent: Finished search_products. Matches found: 4. Latency: 120.45ms
  ```
