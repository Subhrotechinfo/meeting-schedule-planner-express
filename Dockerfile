FROM node:10.12.0-alpine 

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]






