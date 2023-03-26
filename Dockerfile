FROM node:14.16

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Define environment variables
ENV NODE_ENV production
ENV HOST 127.0.0.1
ENV PORT 3010

# Run app.js when the container launches
CMD ["npm", "start"]