import os
import uuid
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional

from shopping_agent import agent

app = FastAPI(title="AI Shopping Assistant API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def chat(request: ChatRequest):
    try:
        # Convert request messages to format expected by agent
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Invoke agent
        result = agent.invoke({"messages": messages_dict})
        
        # Extract the assistant's reply
        response_text = result["messages"][-1].content.replace("`", "")
        
        return {"role": "assistant", "content": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
def upload_image(file: UploadFile = File(...)):
    try:
        # Ensure it's an image
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format. Supported formats: jpg, jpeg, png, webp")
        
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
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
