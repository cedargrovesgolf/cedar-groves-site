FROM node:14.16

# Set the working directory
WORKDIR ./app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Start the app
CMD [ "npm", "start" ]

# Listen on localhost and port 3010
ENV HOST 127.0.0.1
ENV PORT 3010