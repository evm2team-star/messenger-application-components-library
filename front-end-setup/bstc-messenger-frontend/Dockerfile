# Build stage (install deps and prepare)
FROM node:25-alpine3.22 AS builder
WORKDIR /app

RUN npm install -g npm@latest

# Copy package files and install dependencies
COPY package*.json ./
# Clean install for reproducibility
RUN npm install

# Copy source code
COPY . .

# Optional: Build for production (comment out for dev)
# RUN npm run build

# Runtime stage
FROM node:25-alpine3.22

WORKDIR /app

# Copy from builder
COPY --from=builder /app .

# Install additional libs if needed for Electron GUI in container (rarely useful without forwarding)
# RUN apk add --no-cache libgtk-3-0 libnss3 libxss1 libasound2

# Vite dev port (if separate)
EXPOSE 5173

CMD ["npm", "run", "build", "&&", "npm", "run", "preview"]