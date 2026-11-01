FROM node:26-slim@sha256:e4db4c914bf8ad241bd24804fc25d272d89bad97e68cdc8a1414862790a02c39

ENV NODE_ENV=production

WORKDIR /usr/src/cedar-groves-site

COPY ./package*.json ./

RUN npm ci

COPY app ./app

USER node

CMD [ "npm", "start" ]