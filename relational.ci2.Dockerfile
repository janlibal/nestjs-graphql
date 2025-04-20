FROM node:22.11.0-alpine AS builder
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

WORKDIR /usr/src/app

RUN apk add --no-cache bash curl

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma:generate
RUN yarn rebuild

RUN yarn tsc prisma/seeds/seed.ts --outDir dist/prisma/seeds

FROM node:22.11.0-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/src/schema-v1.gql ./src/schema-v1.gql

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./wait-for-graphql.sh /opt/wait-for-graphql.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh

RUN chmod +x /opt/*.sh && \
    sed -i 's/\r//g' /opt/*.sh

CMD ["/opt/startup.relational.ci.sh"]
