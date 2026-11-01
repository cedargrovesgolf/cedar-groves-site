FROM node:26-slim

WORKDIR /usr/src/cedar-groves-site

COPY ./package*.json ./

RUN npm ci

COPY app ./app

ENV HOST 127.0.0.1

USER node

CMD [ "npm", "start" ]