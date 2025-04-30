FROM node:23.11.0-slim AS deps
LABEL stage="deps"
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    curl \
    ca-certificates \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

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

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN echo "" > .env && cp .env.test .env

FROM node:23.11.0-slim AS runner
LABEL stage="runner"
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.test.sh /opt/startup.relational.test.sh

RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.test.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.test.sh

RUN npx prisma generate

CMD ["/opt/startup.relational.test.sh"]
