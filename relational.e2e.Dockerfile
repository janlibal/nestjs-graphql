FROM node:22.11.0-alpine
LABEL maintainer="jan.libal@yahoo.com"
LABEL build_date="2024-11-26"

RUN apk add --no-cache bash
RUN yarn global add @nestjs/cli typescript ts-node

ARG NODE_ENV="prod"
ENV NODE_ENV="${NODE_ENV}"

COPY package*.json /tmp/app/
RUN cd /tmp/app && yarn install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh
RUN chmod +x /opt/startup.relational.ci.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.ci.sh

WORKDIR /usr/src/app
RUN echo "" > .env
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi

RUN yarn run prisma:generate
RUN yarn run rebuild

CMD ["/opt/startup.relational.ci.sh"]
