# Step 1: Dependencies Stage
FROM node:23.11.0-slim AS deps
LABEL stage="deps"

WORKDIR /usr/src/app

# Copy package manager files and install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Step 2: Builder Stage
FROM node:23.11.0-slim AS builder
LABEL stage="builder"

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy node_modules from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Build Prisma client and rebuild the app (adjust based on package manager)
RUN \
  if [ -f package-lock.json ]; then npm run prisma:generate && npm run rebuild; \
  elif [ -f yarn.lock ]; then yarn run prisma:generate && yarn run rebuild; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run prisma:generate && pnpm run rebuild; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Install production dependencies (omit dev dependencies)
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev && npm cache clean --force; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile --prod; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Step 3: Runtime Stage
FROM node:23.11.0-slim AS runner
LABEL stage="runner"

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Set up the app to run as the `node` user
USER root

# Copy the compiled app and dependencies from the builder stage
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules

# Copy necessary startup and wait-for scripts
COPY --chown=node:node ./wait-for-graphql.sh /opt/wait-for-graphql.sh
COPY --chown=node:node ./wait-for-it.sh /opt/wait-for-it.sh
COPY --chown=node:node ./startup.relational.ci.sh /opt/startup.relational.ci.sh

# Make scripts executable and clean up line endings
RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.ci.sh /opt/wait-for-graphql.sh

# Set environment variable from passed ENV_FILE_CONTENT
ARG ENV_FILE_CONTENT
RUN echo "$ENV_FILE_CONTENT" | base64 -d > .env && chown node:node .env

# Ensure ownership and permissions for the app files
RUN chown -R node:node /usr/src/app/*

USER node

# Run the app using the production startup script
CMD ["/opt/startup.relational.ci.sh"]
