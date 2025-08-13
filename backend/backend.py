#!/usr/bin/env python3
import asyncio
import json
import logging
import os
import random
from datetime import datetime
from typing import AsyncGenerator

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Hardcoded greetings
GREETINGS = [
    "Hello there!",
    "Meow! How are you?",
    "Purrfect day, isn't it?",
    "Welcome to the cat chat!",
    "Feline fine today?",
    "Hope you're having a pawsome day!",
    "Cats rule, dogs drool!",
    "Time for some kitty love!",
    "Whiskers and purrs to you!",
    "Cat-tastic greetings!"
]

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_cat_image_url() -> str:
    """Fetch a random cat image URL from The Cat API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get('https://api.thecatapi.com/v1/images/search')
            data = response.json()
            if data and len(data) > 0:
                return data[0]['url']
    except Exception as e:
        logging.error(f"Error fetching cat image: {e}")
    return "https://cataas.com/cat"  # Fallback URL

async def generate_events() -> AsyncGenerator[str, None]:
    """Generate SSE events"""
    try:
        # Send initial connection event
        yield f"data: {json.dumps({'type': 'connected', 'timestamp': datetime.now().isoformat()})}\n\n"
        
        while True:
            # Wait random 1-5 seconds between messages
            await asyncio.sleep(random.randint(1, 5))
            
            # Generate random message
            message = random.choice(GREETINGS)
            image = await get_cat_image_url()
            timestamp = datetime.now().isoformat()
            
            # Create JSON data
            data = {
                'timestamp': timestamp,
                'message': message,
                'image': image
            }
            
            # Send SSE formatted message
            sse_data = f"data: {json.dumps(data)}\n\n"
            logging.info(f"Sending SSE event: message='{message}', image='{image}'")
            yield sse_data
            
    except asyncio.CancelledError:
        logging.info("Client disconnected")
        raise
    finally:
        logging.info("Cleaning up SSE connection")

@app.get("/events")
async def events():
    """SSE endpoint"""
    return StreamingResponse(
        generate_events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Cat Chat SSE Server"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)