# hadolint ignore=DL3006
FROM golang:1.16-alpine AS speedtest-exporter

# https://pkgs.alpinelinux.org/packages
RUN apk add --no-cache git make bash curl

WORKDIR /app

RUN git clone https://github.com/nlamirault/speedtest_exporter.git . && \
make build

CMD [ "/app/speedtest_exporter" ]


FROM node:gallium-bullseye-slim AS bitcoin-exporter

WORKDIR /app
COPY bitcoin .

RUN npm install

CMD ["node", "index.js"]
