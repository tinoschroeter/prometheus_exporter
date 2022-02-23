# hadolint ignore=DL3006
LABEL version="0.0.2"

FROM node:16-alpine AS speedtest-exporter

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
