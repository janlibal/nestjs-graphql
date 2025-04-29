FROM node:23.11.0-slim AS deps
LABEL com.janlibal.image.title="nestjs-graphql" \
      com.janlibal.image.version="1.0.0" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>" \
      com.janlibal.image.description="backend-nest-api-graphql" \
      com.janlibal.image.licenses="MIT"
LABEL stage="deps"
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

WORKDIR /usr/src/app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM node:23.11.0-slim AS builder
LABEL stage="builder"
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"


RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ./wait-for-it.sh /opt/wait-for-it.sh
COPY --chown=node:node ./startup.relational.ci.sh /opt/startup.relational.ci.sh
COPY --chown=node:node ./wait-for-graphql.sh /opt/wait-for-graphql.sh

RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh && \
sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.ci.sh /opt/wait-for-graphql.sh

ARG ENV_FILE_CONTENT
RUN echo "$ENV_FILE_CONTENT" | base64 -d > .env && chown node:node .env

RUN chown -R node:node /usr/src/app/*

USER node

CMD ["/opt/startup.relational.ci.sh"]
# FROM node:22.11.0-alpine AS build
# LABEL maintainer="jan.libal@yahoo.com"
# LABEL build_date="2025-04-20"

# RUN apk add --no-cache bash curl

# WORKDIR /usr/src/app

# RUN yarn global add @nestjs/cli typescript ts-node

# COPY package*.json /usr/src/app/

# RUN yarn install --frozen-lockfile

# COPY . /usr/src/app/

# RUN yarn run prisma:generate
# RUN yarn run rebuild

# FROM node:22.11.0-alpine AS runtime

# WORKDIR /usr/src/app

# RUN apk add --no-cache bash curl

# COPY --from=build /usr/src/app /usr/src/app

# COPY ./wait-for-it.sh /opt/wait-for-it.sh
# COPY ./wait-for-graphql.sh /opt/wait-for-graphql.sh
# COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh

# RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh

# RUN sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.ci.sh /opt/wait-for-graphql.sh

# ARG NODE_ENV="prod"
# ENV NODE_ENV="${NODE_ENV}"

# CMD ["/opt/startup.relational.ci.sh"]
