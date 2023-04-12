FROM node:latest

WORKDIR /usr/src/cedar-groves-site

COPY ./package*.json ./

RUN npm install

COPY app ./app

ENV HOST 127.0.0.1

CMD [ "npm", "start" ]