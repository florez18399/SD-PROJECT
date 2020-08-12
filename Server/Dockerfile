FROM node:12
WORKDIR /usr/src/app
#RUN npm install nodemon -g
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "appS.js"]