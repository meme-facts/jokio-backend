FROM node:latest

WORKDIR /usr/app

COPY package.json ./

RUN npm install 

COPY . .

EXPOSE 3333

RUN git clone https://github.com/vishnubob/wait-for-it.git



