Create a demo app using react server side events.

Create a bare-bones backend using Python's built-in HTTP libraries. Do not use any python dependencies. The backend sends a stream of messages in JSON with three fields: timestamp, message, and image. Create a hardcoded list of greeting strings and URLs to cats and cat gifs on the web. Save the images Send messages in this loop: wait a random amount of time between 0.5 to 5 seconds, and generate a random message by choosing a string and a cat image URL.

Choose a React library for a chat interface that supports rich content. The chat interface has sending disabled, but will display both the string, cat image, and timestamp. Format the timestamp to local time and display it under the chat bubble. Inside the chat bubble, create two sub-bubbles for the text and for the cat image border. Use rounded corners. Use tailwind.css for a modern look.

Write a run.sh script that starts both backend and frontend servers. Make them run in the background using the nohup ... & technique. The script will create unique log files on each run. Export BACKEND_PID and FRONTEND_PID variables, and print out the PIDs, so we can kill them later. Print where the log files are saved.

# Test Plan
Execute run.sh. Read the log output created. Fix any errors. Finish when both frontend and backend run without errors.
