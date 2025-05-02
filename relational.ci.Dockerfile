FROM node:23.11.0-alpine AS deps
LABEL com.janlibal.image.stage="deps" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"

WORKDIR /usr/src/app

RUN apk add --no-cache bash curl && \
     yarn global add @nestjs/cli typescript ts-node

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* /usr/src/app/

RUN yarn install --frozen-lockfile

FROM node:23.11.0-alpine AS builder
LABEL com.janlibal.image.stage="builder" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY --from=deps /usr/src/app/node_modules /usr/src/app

COPY . /usr/src/app/

RUN yarn run prisma:generate
RUN yarn run rebuild

FROM node:23.11.0-alpine AS runner
LABEL com.janlibal.image.stage="runner" \
      com.janlibal.image.title="backend-nest-api-graphql" \
      com.janlibal.image.created="2025-05-01" \
      com.janlibal.image.authors="Jan Libal <jan.libal@yahoo.com>"

WORKDIR /usr/src/app

RUN apk add --no-cache bash curl

COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/yarn.lock /usr/src/app/yarn.lock
COPY --from=builder /usr/src/app/prisma /usr/src/app/prisma
COPY --from=builder /usr/src/app/tests /usr/src/app/tests

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./wait-for-graphql.sh /opt/wait-for-graphql.sh
COPY ./startup.relational.prod.sh /opt/startup.relational.ci.sh

RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh && \
sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.ci.sh

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

CMD ["/opt/startup.relational.ci.sh"]


# FROM node:22.11.0-alpine AS build

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
