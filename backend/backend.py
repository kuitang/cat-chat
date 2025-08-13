#!/usr/bin/env python3
import http.server
import json
import logging
import os
import random
import time
import urllib.request
from datetime import datetime
from http import HTTPStatus

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

def get_cat_image_url():
    """Fetch a random cat image URL from The Cat API"""
    try:
        with urllib.request.urlopen('https://api.thecatapi.com/v1/images/search') as response:
            data = json.loads(response.read().decode())
            if data and len(data) > 0:
                return data[0]['url']
    except Exception as e:
        print(f"Error fetching cat image: {e}")
    return "https://cataas.com/cat"  # Fallback URL

class SSEHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/events':
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            try:
                while True:
                    # Wait random 1-5 seconds between messages
                    time.sleep(random.randint(1, 5))
                    
                    # Generate random message
                    message = random.choice(GREETINGS)
                    image = get_cat_image_url()
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
                    self.wfile.write(sse_data.encode('utf-8'))
                    self.wfile.flush()
                    
            except (BrokenPipeError, ConnectionResetError):
                # Client disconnected
                pass
            except Exception as e:
                print(f"Error streaming events: {e}")
                
        else:
            self.send_response(HTTPStatus.NOT_FOUND)
            self.end_headers()
            
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(HTTPStatus.OK)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
    def log_message(self, format, *args):
        # Override to prevent default logging to stderr
        return

def run_server(port=None):
    if port is None:
        port = int(os.environ.get('PORT', 8080))
    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, SSEHandler)
    print(f"Server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()