FROM node:20

ARG MONGO_URL

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV MONGO_URL=${MONGO_URL}

CMD npm run start