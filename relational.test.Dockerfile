FROM node:23.11.0-alpine AS deps
LABEL com.janlibal.image.stage="deps" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"

WORKDIR /usr/src/app

RUN apk add --no-cache bash && \
     yarn global add @nestjs/cli typescript ts-node

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN yarn install --frozen-lockfile

FROM node:23.11.0-alpine AS builder
LABEL com.janlibal.image.stage="builder" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

RUN npx prisma generate

RUN echo "" > .env && cp .env.test .env


FROM node:23.11.0-alpine AS runner
LABEL com.janlibal.image.stage="runner" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY --from=builder /usr/src/app ./

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.test.sh /opt/startup.relational.test.sh

RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.test.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.test.sh

CMD ["/opt/startup.relational.test.sh"]
