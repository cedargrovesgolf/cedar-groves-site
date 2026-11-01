FROM node:26-slim

WORKDIR /usr/src/cedar-groves-site

COPY ./package*.json ./

RUN npm ci

COPY app ./app

USER node

CMD [ "npm", "start" ]