# Use a Node 20.x runtime that satisfies Next.js >=20.9.0 requirement
# We pin to 20.9.0 explicitly to match Next's minimum; adjust if you prefer a newer patch.
FROM node:20.9.0-bullseye-slim AS builder

WORKDIR /app

# Copy package manifests and install dependencies first for better caching
COPY package*.json ./
# Try a clean install first; if npm ci fails inside the build environment, fall back to npm install
# using flags to skip audit/funding prompts and ignore peer deps issues that can break non-interactive builds.
RUN bash -lc "npm ci --silent || npm install --no-audit --no-fund --legacy-peer-deps --silent"

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:20.9.0-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what we need from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# next.config may be .mjs in this project
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["npm", "start"]
