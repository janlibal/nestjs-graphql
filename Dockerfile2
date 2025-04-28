FROM node:22.11.0-alpine AS build
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-19"

RUN apk add --no-cache bash

WORKDIR /usr/src/app

RUN yarn global add @nestjs/cli typescript ts-node

COPY package*.json /usr/src/app/

RUN yarn install --frozen-lockfile

COPY . /usr/src/app/

RUN yarn run prisma:generate
RUN yarn run rebuild


FROM node:22.11.0-alpine AS runtime
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-19"

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY --from=build /usr/src/app /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.prod.sh /opt/startup.relational.prod.sh

RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.prod.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.prod.sh

ARG ENV_FILE_CONTENT
RUN echo "$ENV_FILE_CONTENT" | base64 -d > .env

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

RUN chown -R node:node /usr/src/app/*
USER node

CMD ["/opt/startup.relational.prod.sh"]
