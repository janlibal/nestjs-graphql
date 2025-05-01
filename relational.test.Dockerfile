FROM node:23.11.0-slim AS deps
LABEL com.janlibal.image.stage="deps" \
      com.janlibal.image.title="Backend-Nestjs-Graphql-API" \
      com.janlibal.image.description="A simple web service built with Node.js" \
      com.janlibal.image.version="1.0.0" \
      com.janlibal.image.url="https://github.com/janlibal/nestjs-graphql" \
      com.janlibal.image.source="https://github.com/janlibal/nestjs-graphql.git" \
      com.janlibal.image.build_data="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>" \
      com.janlibal.image.licenses="MIT"

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
LABEL com.janlibal.image.stage="builder" \
      com.janlibal.image.title="Backend-Nestjs-Graphql-API" \
      com.janlibal.image.description="A simple web service built with Node.js" \
      com.janlibal.image.version="1.0.0" \
      com.janlibal.image.url="https://github.com/janlibal/nestjs-graphql" \
      com.janlibal.image.source="https://github.com/janlibal/nestjs-graphql.git" \
      com.janlibal.image.build_data="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>" \
      com.janlibal.image.licenses="MIT"

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN echo "" > .env && cp .env.test .env

FROM node:23.11.0-slim AS runner
LABEL com.janlibal.image.stage="runner" \
      com.janlibal.image.title="Backend-Nestjs-Graphql-API" \
      com.janlibal.image.description="A simple web service built with Node.js" \
      com.janlibal.image.version="1.0.0" \
      com.janlibal.image.url="https://github.com/janlibal/nestjs-graphql" \
      com.janlibal.image.source="https://github.com/janlibal/nestjs-graphql.git" \
      com.janlibal.image.build_data="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>" \
      com.janlibal.image.licenses="MIT"

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

# Redundant?
RUN npx prisma generate

CMD ["/opt/startup.relational.test.sh"]
