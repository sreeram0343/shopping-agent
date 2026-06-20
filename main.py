import os
import uuid
import shutil
import time
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional

from shopping_agent import agent

# ---------------------------------------------------------------------------
# API Key and Environment Variable Validation
# ---------------------------------------------------------------------------
def validate_env_variables():
    # If running in production (or generally), check if key is set and not a placeholder
    groq_key = os.getenv("GROQ_API_KEY", "")
    google_key = os.getenv("GOOGLE_API_KEY", "")
    
    warnings = []
    if not groq_key or "your_" in groq_key:
        warnings.append("GROQ_API_KEY is not set or contains default placeholder.")
    if not google_key or "your_" in google_key:
        warnings.append("GOOGLE_API_KEY is not set or contains default placeholder.")
        
    if warnings:
        print("[WARNING] Production Environment Incomplete:")
        for w in warnings:
            print(f" - {w}")

validate_env_variables()

app = FastAPI(
    title="AI Shopping Assistant API",
    description="Secure, production-hardened API for zero-gravity AI shopping assistant."
)

# ---------------------------------------------------------------------------
# Production-Hardened CORS Configuration
# ---------------------------------------------------------------------------
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

# Local development fallback
if not allowed_origins:
    allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    print(f"[INFO] CORS configured for Development: {allowed_origins}")
else:
    print(f"[INFO] CORS configured for Production: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True if "*" not in allowed_origins else False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# ---------------------------------------------------------------------------
# Sliding-Window Rate Limiter (No external dependency)
# ---------------------------------------------------------------------------
class SlidingWindowRateLimiter:
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.client_records = {} # IP -> list of timestamps

    def check_limit(self, client_ip: str) -> bool:
        now = time.time()
        if client_ip not in self.client_records:
            self.client_records[client_ip] = []
        
        # Keep only timestamps within window
        self.client_records[client_ip] = [
            t for t in self.client_records[client_ip]
            if now - t < self.window_seconds
        ]
        
        if len(self.client_records[client_ip]) >= self.requests_limit:
            return False
            
        self.client_records[client_ip].append(now)
        return True

# Rate limits: 15 chat calls/min, 5 image uploads/min
chat_limiter = SlidingWindowRateLimiter(requests_limit=15, window_seconds=60)
upload_limiter = SlidingWindowRateLimiter(requests_limit=5, window_seconds=60)

# Directory to store uploaded images
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve uploads folder static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Serve resources folder static files
RESOURCE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resources")
app.mount("/resources", StaticFiles(directory=RESOURCE_DIR), name="resources")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest, fastapi_req: Request):
    # Rate Limit Check
    client_ip = fastapi_req.headers.get("x-forwarded-for") or (fastapi_req.client.host if fastapi_req.client else "127.0.0.1")
    client_ip = client_ip.split(",")[0].strip()
    if not chat_limiter.check_limit(client_ip):
         raise HTTPException(
             status_code=429, 
             detail="Too many chat requests. Please wait a minute and try again."
         )

    # Input Payload Sanitization & Length Check
    total_len = sum(len(msg.content) for msg in request.messages)
    if total_len > 10000:
        raise HTTPException(status_code=413, detail="Chat transcript payload too large.")
        
    for msg in request.messages:
        if len(msg.content) > 3000:
            raise HTTPException(status_code=400, detail="Individual message exceeds maximum length of 3000 characters.")
        # Basic sanitization: strip any leading null bytes or malicious characters
        msg.content = msg.content.replace("\x00", "").strip()

    try:
        # Convert request messages to format expected by agent
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Invoke agent
        result = agent.invoke({"messages": messages_dict})
        
        # Extract the assistant's reply
        response_text = result["messages"][-1].content.replace("`", "")
        
        return {"role": "assistant", "content": response_text}
    except Exception as e:
        # Mask raw LLM error traces in production logs
        print(f"[ERROR] LLM/Agent call failed: {e}")
        raise HTTPException(
            status_code=503, 
            detail="The AI Shopping Assistant is currently experiencing high load or connection issues. Please try again shortly."
        )

@app.post("/api/upload")
def upload_image(fastapi_req: Request, file: UploadFile = File(...)):
    # Rate Limit Check
    client_ip = fastapi_req.headers.get("x-forwarded-for") or (fastapi_req.client.host if fastapi_req.client else "127.0.0.1")
    client_ip = client_ip.split(",")[0].strip()
    if not upload_limiter.check_limit(client_ip):
         raise HTTPException(
             status_code=429, 
             detail="Too many upload attempts. Please wait a minute and try again."
         )

    try:
        # Ensure it's an image
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format. Supported formats: jpg, jpeg, png, webp")
        
        # Validate File Size (Max 5MB)
        MAX_FILE_SIZE = 5 * 1024 * 1024
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413, 
                detail="File size exceeds the maximum limit of 5MB."
            )

        # Create a unique filename
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file to uploads folder
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Absolute path on disk for LangChain to read
        abs_path = os.path.abspath(file_path)
        
        # URL for frontend to access/display the image
        url_path = f"/uploads/{filename}"
        
        return {
            "image_path": abs_path,
            "image_url": url_path,
            "filename": file.filename
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"[ERROR] Upload processing failed: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to process image upload. Please verify file integrity."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
