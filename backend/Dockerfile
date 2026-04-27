# Use lightweight Node.js Alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only production dependencies to keep image small)
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Expose port 8080 (Cloud Run standard)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
