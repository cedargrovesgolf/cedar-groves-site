FROM node:14.16

# Set the working directory
WORKDIR /usr/src/cedar-groves-site

# Copy package.json and package-lock.json
COPY ./app/package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY ./app .

# Listen on localhost and port 3010
ENV HOST 127.0.0.1
ENV PORT 3010

# Start the app
CMD [ "npm", "start" ]
