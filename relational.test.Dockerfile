FROM node:22.11.0-alpine AS build

RUN apk add --no-cache bash

RUN yarn global add @nestjs/cli typescript ts-node

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

RUN echo "" > .env && cp .env.test .env

# (Optional) If you build or compile TypeScript ahead of time, do it here
# RUN yarn run build

FROM node:22.11.0-alpine AS runtime

RUN apk add --no-cache bash

ARG NODE_ENV="test"
ENV NODE_ENV="${NODE_ENV}"

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.test.sh /opt/startup.relational.test.sh
RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.test.sh && \
    sed -i 's/\r//g' /opt/wait-for-it.sh /opt/startup.relational.test.sh

CMD ["/opt/startup.relational.test.sh"]
