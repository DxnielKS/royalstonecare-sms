# Use Node.js LTS version as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose port for HTTP
EXPOSE 443 80

# Start the app with port mapping
ENV PORT=3000
CMD ["sh", "-c", "npm start -- -p 3000"]
