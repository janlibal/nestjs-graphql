FROM node:22.11.0-alpine AS build
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2025-04-20"

RUN apk add --no-cache bash curl

WORKDIR /usr/src/app

RUN yarn global add @nestjs/cli typescript ts-node

COPY package*.json /usr/src/app/

RUN yarn install --frozen-lockfile

COPY . /usr/src/app/

RUN yarn run prisma:generate
RUN yarn run rebuild

FROM node:22.11.0-alpine AS runtime

WORKDIR /usr/src/app

RUN apk add --no-cache bash curl

COPY --from=build /usr/src/app /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./wait-for-graphql.sh /opt/wait-for-graphql.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh

RUN chmod +x /opt/wait-for-it.sh /opt/wait-for-graphql.sh /opt/startup.relational.ci.sh

RUN sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.ci.sh /opt/wait-for-graphql.sh

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

CMD ["/opt/startup.relational.ci.sh"]
