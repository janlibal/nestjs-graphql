FROM node:23.11.0-alpine AS deps


WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM node:23.11.0-alpine AS builder
LABEL com.janlibal.image.stage="builder" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"


RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

RUN \
  if [ -f package-lock.json ]; then npm run prisma:generate && npm run rebuild; \
  elif [ -f yarn.lock ]; then yarn run prisma:generate && yarn run rebuild; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run prisma:generate && pnpm run rebuild; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev && npm cache clean --force; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile --prod; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM node:23.11.0-slim AS runner
LABEL stage="runner"
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

WORKDIR /usr/src/app

USER root

RUN apk add --no-cache bash

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ./wait-for-it.sh /opt/wait-for-it.sh
COPY --chown=node:node ./startup.relational.prod.sh /opt/startup.relational.prod.sh

RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.prod.sh && \
sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.prod.sh

ARG ENV_FILE_CONTENT
RUN echo "$ENV_FILE_CONTENT" | base64 -d > .env && chown node:node .env

RUN chown -R node:node /usr/src/app/*

USER node

CMD ["/opt/startup.relational.prod.sh"]



# FROM node:23.11.0-slim AS deps
# LABEL stage="deps"
# LABEL maintainer="jan.libal@yahoo.com"
# LABEL build_date="2025-04-20"

# WORKDIR /usr/src/app

# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# RUN \
#   if [ -f package-lock.json ]; then npm ci; \
#   elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# FROM node:23.11.0-slim AS builder
# LABEL stage="builder"
# LABEL maintainer="jan.libal@yahoo.com"
# LABEL build_date="2025-04-20"


# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     bash \
#     openssl \
#     ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /usr/src/app

# COPY --from=deps /usr/src/app/node_modules ./node_modules

# COPY . .

# RUN \
#   if [ -f package-lock.json ]; then npm run prisma:generate && npm run rebuild; \
#   elif [ -f yarn.lock ]; then yarn run prisma:generate && yarn run rebuild; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run prisma:generate && pnpm run rebuild; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# RUN \
#   if [ -f package-lock.json ]; then npm ci --omit=dev && npm cache clean --force; \
#   elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile --prod; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# FROM node:23.11.0-slim AS runner
# LABEL stage="runner"
# LABEL maintainer="jan.libal@yahoo.com"
# LABEL build_date="2025-04-20"

# WORKDIR /usr/src/app

# USER root

# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     bash \
#     openssl \
#     ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
# COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules

# COPY --chown=node:node ./wait-for-it.sh /opt/wait-for-it.sh
# COPY --chown=node:node ./startup.relational.prod.sh /opt/startup.relational.prod.sh

# RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.prod.sh && \
# sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.prod.sh

# ARG ENV_FILE_CONTENT
# RUN echo "$ENV_FILE_CONTENT" | base64 -d > .env && chown node:node .env

# RUN chown -R node:node /usr/src/app/*

# USER node

# CMD ["/opt/startup.relational.prod.sh"]
