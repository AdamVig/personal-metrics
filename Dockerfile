FROM node:10-alpine as builder

ENV NODE 10
ENV PLATFORM alpine
ENV ARCH x64
ENV PKG_CACHE_PATH .pkg-cache

WORKDIR /app

# Extra tools for native dependencies
RUN apk add --no-cache make gcc g++ python

# Pre-fetch Node base binaries for pkg
RUN npx pkg-fetch -n node${NODE} -p ${PLATFORM} -a ${ARCH}

# Only copy package files (npm ci will only run when they have changed)
COPY package* ./
RUN npm ci

# Only copy files needed for building
COPY tsconfig.json .
COPY src src
RUN npm run build:single
RUN npx pkg --public --target node${NODE}-${PLATFORM}-${ARCH} --output dist/personal-metrics .

FROM node:10-alpine
EXPOSE 9000
COPY --from=builder /app/dist/personal-metrics .
CMD ["./personal-metrics"]
