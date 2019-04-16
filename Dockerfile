FROM node:latest as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.docker.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app
RUN rm -rf ./ethereumjs-testrpc-sc rxjs ./truffle ./rxjs ./yeoman-environment ./listr ./ganache-cli ./prettier ./solc ./core-js ./sha3 ./date-fns ./solidity-coverage ./solidity-parser-sc ./handlebars ./webpack-addons ./flow-parser ./yeoman-generator ./jscodeshift ./babel-core ./istanbul ./webpack-cli ./fast-glob ./ajv ./babel-runtime ./babel-generator ./babel-register ./snapdragon ./source-map ./neo-async ./uglify-js ./escodegen
RUN sed -i 's/localhost/blockchain/g' node_modules/ewf-coo/build/ts/Deployment.js
CMD ["node", "server.js"]
