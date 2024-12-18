# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install curl
RUN apk add --no-cache curl

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Fix vulnerabilities
RUN npm audit fix --force

# Build the application
RUN npm run build

# Make init script executable
RUN chmod +x /app/docker/scripts/init-ollama.sh

# Expose the port the app runs on
EXPOSE 8080

# Start the application with init script
CMD ["/bin/sh", "-c", "/app/docker/scripts/init-ollama.sh && npm start"]
