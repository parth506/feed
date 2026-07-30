# ─────────────────────────────────────────────
# Stage 1 – Base
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app
ENV NODE_ENV=development

# ─────────────────────────────────────────────
# Stage 2 – Dependencies
# ─────────────────────────────────────────────
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# ─────────────────────────────────────────────
# Stage 3 – Development server
# ─────────────────────────────────────────────
FROM deps AS dev

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
