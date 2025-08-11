# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy lock files and package.json
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install; \
    else \
      npm install; \
    fi

# Copy source code
COPY . .
COPY .env .env

# Build the app (make sure VITE_ env vars are set before this step if needed)
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Run the serve static server on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
