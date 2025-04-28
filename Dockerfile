# ---------- Stage 1: Dependency installation ----------
    FROM node:23.11.0-slim AS deps

    WORKDIR /usr/src/app

    # Copy only the lockfiles and package descriptor
    COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

    # Install dependencies based on the lockfile
    RUN \
      if [ -f package-lock.json ]; then npm ci; \
      elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
      else echo "Lockfile not found." && exit 1; \
      fi

    # ---------- Stage 2: Build ----------
    FROM node:23.11.0-slim AS builder

    # Use apt instead of apk since this is Debian-based
    RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

    WORKDIR /usr/src/app

    # Copy installed deps
    COPY --from=deps /app/node_modules ./node_modules

    # Copy rest of the app
    COPY . .

    # Build the project (based on lockfile)
    RUN \
      if [ -f package-lock.json ]; then npm run build; \
      elif [ -f yarn.lock ]; then yarn run build; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
      else echo "Lockfile not found." && exit 1; \
      fi

    # Generate Prisma artifacts and rebuild if needed
    RUN \
      if [ -f package-lock.json ]; then npm run prisma:generate && npm run rebuild; \
      elif [ -f yarn.lock ]; then yarn run prisma:generate && yarn run rebuild; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run prisma:generate && pnpm run rebuild; \
      else echo "Lockfile not found." && exit 1; \
      fi

    # Reinstall prod dependencies (clean install)
    RUN \
      if [ -f package-lock.json ]; then npm ci --omit=dev && npm cache clean --force; \
      elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
      elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile --prod; \
      else echo "Lockfile not found." && exit 1; \
      fi

    # ---------- Stage 3: Runtime ----------
    FROM node:23.11.0-slim AS runner

    WORKDIR /usr/src/app

    # Use non-root user for better security
    RUN chown -R node:node /usr/src/app/*
    USER node

    # Copy only runtime code and dependencies
    COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
    COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules

    # Copy and prepare startup scripts
    COPY --chown=node:node ./wait-for-it.sh /opt/wait-for-it.sh
    COPY --chown=node:node ./startup.relational.prod.sh /opt/startup.relational.prod.sh

    RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.prod.sh && \
        sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.prod.sh

    # Inject the .env file content
    ARG ENV_FILE_CONTENT
    RUN echo "$ENV_FILE_CONTENT" | base64 -d > .env && chown node:node .env

    CMD ["/opt/startup.relational.prod.sh"]
