FROM node:14.17.5-alpine AS dependencies

RUN apk add --no-cache libc6-compat
WORKDIR /app/

COPY tsconfig.json ./
COPY package.json ./

RUN yarn install

FROM node:14.17.5-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS
ARG NEXT_PUBLIC_OPENDRM721_ADDRESS
ARG NEXT_PUBLIC_BOB_ADDRESS

ENV NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS=$NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS
ENV NEXT_PUBLIC_OPENDRM721_ADDRESS=$NEXT_PUBLIC_OPENDRM721_ADDRESS
ENV NEXT_PUBLIC_BOB_ADDRESS=$NEXT_PUBLIC_BOB_ADDRESS

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/yarn.lock ./yarn.lock
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:14.17.5-alpine AS prod
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

#!/bin/sh

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["node_modules/.bin/next"]
CMD [ "start" ]