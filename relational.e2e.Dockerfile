FROM node:22.11.0-alpine
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

RUN apk add --no-cache bash curl
RUN yarn global add @nestjs/cli typescript ts-node

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN yarn install

COPY . /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./wait-for-graphql.sh /opt/wait-for-graphql.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh

RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh

RUN sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.ci.sh /opt/wait-for-graphql.sh

RUN echo "" > .env && cp env-example-relational .env || true

RUN yarn run prisma:generate

RUN yarn run rebuild

CMD ["/opt/startup.relational.ci.sh"]
