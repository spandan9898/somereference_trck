FROM node:16.13.1-alpine3.13 as base

WORKDIR /consumerapp
COPY package*.json /
EXPOSE 9000

FROM base as production
ENV NODE_ENV=production
RUN npm install --only=prod
COPY . /
CMD ["node", "index"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["node", "index"]
