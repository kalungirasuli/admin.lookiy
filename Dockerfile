# ============================================
# TRAVO - Web Admin Dashboard
# Multi-stage Docker build (Next.js)
# ============================================

# --- Stage 1: Build shared package ---
FROM node:20-alpine AS shared-build
WORKDIR /build/shared
COPY shared/package.json shared/tsconfig.json ./
COPY shared/index.ts ./
COPY shared/types ./types
COPY shared/constants ./constants
COPY shared/utils ./utils
RUN npm install && npm run build

# --- Stage 2: Build Next.js app ---
FROM node:20-alpine AS app-build
WORKDIR /build/app
COPY apps/web-admin/package.json ./
COPY --from=shared-build /build/shared /build/shared
RUN npm install && npm install /build/shared
COPY apps/web-admin/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 3: Production ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=app-build /build/app/.next/standalone ./
COPY --from=app-build /build/app/.next/static ./.next/static
COPY --from=app-build /build/app/public ./public

EXPOSE 3080
ENV PORT=3080
CMD ["node", "server.js"]
