# Use Node.js LTS version as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose port 80 instead of 3000 since that's what we're using
EXPOSE 80

# Set port to 80 internally
ENV PORT=80
CMD ["sh", "-c", "npm start -- -p 80"]
