# Node Image -v 18
FROM node:18

ENV TZ=Africa/Cairo

# Create app directory
WORKDIR /usr/src/app

RUN apt update

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000

COPY entrypoint.sh /usr/src/app

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
