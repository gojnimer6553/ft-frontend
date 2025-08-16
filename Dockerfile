# Build stage
FROM node:18-alpine AS builder

ARG VITE_APPWRITE_PROJECT_ID
ARG VITE_APPWRITE_PUBLIC_ENDPOINT
ARG VITE_TRANSLATION_BUCKET_URL
ARG VITE_TRANSLATION_DELIVERY_ID

ENV VITE_APPWRITE_PROJECT_ID=${VITE_APPWRITE_PROJECT_ID}
ENV VITE_APPWRITE_PUBLIC_ENDPOINT=${VITE_APPWRITE_PUBLIC_ENDPOINT}
ENV VITE_TRANSLATION_BUCKET_URL=${VITE_TRANSLATION_BUCKET_URL}
ENV VITE_TRANSLATION_DELIVERY_ID=${VITE_TRANSLATION_DELIVERY_ID}

WORKDIR /app

# Install pnpm and dependencies
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the source code
COPY . .

RUN pnpm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
