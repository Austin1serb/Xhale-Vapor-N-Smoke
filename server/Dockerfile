# Use an official Node.js image
FROM node:20.16.0-slim

# Set working directory inside the container
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app is listening on (default Fly.io is 8080)
EXPOSE 8000

# Start the app using the 'start' script from package.json
CMD [ "npm", "start" ]
