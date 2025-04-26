FROM node:22.11.0-alpine
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2026-04-26"

# Build Stage
FROM node:22.11.0-alpine AS build

COPY package*.json /usr/src/app/
WORKDIR /usr/src/app

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run prisma:generate
RUN yarn run rebuild

# Runtime Stage
FROM node:22.11.0-alpine AS runtime

WORKDIR /usr/src/app

RUN apk add --no-cache bash curl

COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.prod.sh /opt/startup.relational.prod.sh

RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.prod.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.prod.sh

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

CMD ["/opt/startup.relational.prod.sh"]
