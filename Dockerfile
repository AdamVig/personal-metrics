FROM node:10-alpine as builder

WORKDIR /app

# Extra tools for native dependencies
RUN apk add --no-cache make gcc g++ python

# Only copy package files (npm ci will only run when they have changed)
COPY package* ./
RUN npm ci

# Only copy files needed for building
COPY tsconfig.json .
COPY src src
RUN npm run build:single
RUN npx pkg --public --target "node10-alpine-x64" --output dist/personal-metrics dist/main.js

FROM alpine

WORKDIR /app

RUN apk add --no-cache g++

COPY --from=builder /app/dist/personal-metrics .

EXPOSE 3000
CMD ["./personal-metrics"]
