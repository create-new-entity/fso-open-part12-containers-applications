FROM node:20

ARG MONGO_URL
ARG REDIS_URL

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV MONGO_URL=${MONGO_URL}
ENV REDIS_URL=${REDIS_URL}

CMD npm run start