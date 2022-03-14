# hadolint ignore=DL3006
FROM node:16-alpine AS speedtest-exporter

LABEL version="0.0.4"

RUN apk add --no-cache git curl make gcc g++ python3

WORKDIR /app

RUN git clone https://github.com/tinoschroeter/breitbandmessung.git . && \
    npm install

CMD [ "node", "index.js" ]


FROM node:gallium-bullseye-slim AS bitcoin-exporter

WORKDIR /app
COPY bitcoin .

RUN npm install

CMD ["node", "index.js"]

FROM node:gallium-bullseye-slim AS ping-check-exporter

WORKDIR /app
COPY ping_check .

RUN npm install

CMD ["node", "index.js"]
