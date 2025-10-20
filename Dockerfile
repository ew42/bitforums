# Build frontend
FROM node:20-bullseye AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend ./
RUN npm run build

# Install backend deps
FROM node:20-bullseye AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Final image
FROM node:20-bullseye
WORKDIR /app

# Copy backend source
COPY backend /app/backend

# Copy backend app and installed node_modules
COPY --from=backend-deps /app/backend/node_modules /app/backend/node_modules

# Copy compiled frontend into backend expected path
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

ENV NODE_ENV=production

# Ports used by prodServer.js
EXPOSE 80 443

WORKDIR /app/backend
CMD ["node", "prodServer.js"]
