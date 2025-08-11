# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package manifest files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the project (adjust if your build output is different)
RUN pnpm run build

# Stage 2: Production with Nginx
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder stage (assuming Vite default build output)
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
