FROM node:16.13.2-alpine AS dependencies

WORKDIR /srv/

COPY tsconfig.json ./
COPY package.json ./

RUN yarn install

## Build
FROM node:16.13.2-alpine AS builder

WORKDIR /srv
COPY src ./src
COPY --from=dependencies /srv/node_modules ./node_modules
COPY --from=dependencies /srv/yarn.lock ./yarn.lock
COPY --from=dependencies /srv/package.json ./package.json
COPY --from=dependencies /srv/tsconfig.json ./tsconfig.json

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

## Production
FROM node:16.13.2-alpine AS prod
WORKDIR /srv

ENV NODE_ENV production
ENV PORT 3001

COPY --from=builder /srv/node_modules ./node_modules
COPY --from=builder /srv/package.json ./package.json
COPY --from=builder /srv/dist ./dist

EXPOSE 3001

CMD [ "yarn", "start" ]