# use double copy to make image smaller
# runcmd and package are injected from outside
FROM node:12.18-alpine AS builder
WORKDIR /app

COPY package.json.swp ./package.json
COPY yarn.lock ./yarn.lock

RUN npm install


FROM node:12.18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./package.json
COPY config ./config
COPY lib ./lib

ARG BUILD_COMMIT=unknown
ARG BUILD_TIME=unknown
ARG BUILD_AUTHOR=unknown
ARG BUILD_ID=unknown
ENV BUILD_COMMIT ${BUILD_COMMIT}
ENV BUILD_TIME ${BUILD_TIME}
ENV BUILD_AUTHOR ${BUILD_AUTHOR}
ENV BUILD_ID ${BUILD_ID}

EXPOSE 3000

CMD npm start
