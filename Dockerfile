FROM node:14.16

WORKDIR /usr/src/cedar-groves-site

COPY ./package*.json ./

RUN npm install

COPY . .

ENV HOST 127.0.0.1
ENV PORT 3010

CMD [ "npm", "start" ]