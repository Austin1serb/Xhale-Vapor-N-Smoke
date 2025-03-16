# Step 1: Use an official Node.js image as a base
FROM node:18-alpine

# Step 2: Set the working directory to /server
WORKDIR /server

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) files to install dependencies
COPY server/package*.json ./

# Step 4: Install the server dependencies
RUN npm install

# Step 5: Copy the rest of the server-side code into the container
COPY server/ .

# Step 6: Expose the port that your app will use (assuming port 8080 for Fly.io)
EXPOSE 8080

# Step 7: Start the app using the server.js file
CMD ["node", "server.js"]
