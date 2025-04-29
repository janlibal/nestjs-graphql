# Stage 1: Dependencies
FROM node:23.11.0-slim AS deps
LABEL stage="deps"

WORKDIR /usr/src/app

# Copy only lock and manifest files to install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on lock file
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Builder
FROM node:23.11.0-slim AS builder
LABEL stage="builder"

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy installed deps from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy app source
COPY . .

# Build Prisma and app
RUN \
  if [ -f package-lock.json ]; then npm run prisma:generate && npm run rebuild; \
  elif [ -f yarn.lock ]; then yarn run prisma:generate && yarn run rebuild; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run prisma:generate && pnpm run rebuild; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Optional: clean dev deps (depends on your CI needs)
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev && npm cache clean --force; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile --prod; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 3: Runtime
FROM node:23.11.0-slim AS runner
LABEL stage="runner"

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy built app and runtime deps
COPY --from=builder /usr/src/app /usr/src/app

# Copy CI-specific scripts
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./wait-for-graphql.sh /opt/wait-for-graphql.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh

# Make scripts executable and fix line endings
RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh

# Set environment
ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

CMD ["/opt/startup.relational.ci.sh"]
