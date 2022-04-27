FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# install modules before adding code, so that modules are not every time built
# on code change
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

# build frontend and backend
RUN npm run build

RUN mkdir ../neno-data
RUN mv tools/users.json.demo ../neno-data/users.json

# start server
CMD [ "npm", "run", "start-server" ]