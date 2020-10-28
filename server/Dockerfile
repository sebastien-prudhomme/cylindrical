FROM node:12.16.2-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY config/ ./config/
COPY public/ ./public/
COPY src/ ./src/

USER node
EXPOSE 3030
CMD [ "npm", "run", "start" ]
