FROM node:latest

WORKDIR /app
COPY server.js /app/server.js

RUN apt-get update && apt-get install -y sshpass
RUN npm init -y

EXPOSE 9666
CMD ["node", "server.js"]