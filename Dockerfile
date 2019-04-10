FROM node:latest as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . /usr/src/app
RUN npm install --silent
RUN sed -i 's/localhost/blockchain/g' node_modules/ewf-coo/build/ts/Deployment.js
CMD ["node", "server.js"]
