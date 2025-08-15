# Build stage
FROM node:18-alpine AS builder

# Declare build-time args
ARG VITE_APPWRITE_PROJECT_ID
ARG VITE_APPWRITE_PUBLIC_ENDPOINT
ARG VITE_APP_TOLGEE_API_URL
ARG VITE_APP_TOLGEE_API_KEY
ARG VITE_TRANSLATION_BUCKET_URL
ARG VITE_TRANSLATION_DELIVERY_ID
# Make them available as env vars during build
ENV VITE_APPWRITE_PROJECT_ID=${VITE_APPWRITE_PROJECT_ID}
ENV VITE_APPWRITE_PUBLIC_ENDPOINT=${VITE_APPWRITE_PUBLIC_ENDPOINT}
ENV VITE_APP_TOLGEE_API_URL=${VITE_APP_TOLGEE_API_URL}
ENV VITE_APP_TOLGEE_API_KEY=${VITE_APP_TOLGEE_API_KEY}
ENV VITE_TRANSLATION_BUCKET_URL=${VITE_TRANSLATION_BUCKET_URL}
ENV VITE_TRANSLATION_DELIVERY_ID=${VITE_TRANSLATION_DELIVERY_ID}

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
