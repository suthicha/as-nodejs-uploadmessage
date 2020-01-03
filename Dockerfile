FROM node:10.15.3-alpine

RUN apk add --no-cache tzdata
ENV TZ Asia/Bangkok

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/config
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

EXPOSE 8000

CMD ["npm", "start"]