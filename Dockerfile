FROM mhart/alpine-node:10.15.3

WORKDIR /app

# Extra tools for native dependencies
RUN apk add --no-cache make gcc g++ python

COPY . .

RUN npm ci

EXPOSE 3000
CMD ["node", "dist/main.js"]
