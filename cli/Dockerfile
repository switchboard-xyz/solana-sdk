FROM node:16-alpine
WORKDIR /usr/src/sbv2-cli
COPY package.json ./
RUN npm i --legacy-peer-deps
COPY tsconfig.build.json ./tsconfig.json
COPY src ./src
RUN npm run build
RUN ["node", "dist", "print", "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"]