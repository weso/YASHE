FROM node:12.18.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY .  /usr/src/app

# Serve app
CMD [ "npm", "start" ]