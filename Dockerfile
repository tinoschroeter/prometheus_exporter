FROM golang:1.16-alpine AS speedtest-exporter

# https://pkgs.alpinelinux.org/packages
RUN apk add --update git=2.34.1-r1 make=4.3-r0 bash=5.1.8-r0 curl=7.80.0-r0

WORKDIR /app

RUN git clone https://github.com/nlamirault/speedtest_exporter.git .
RUN make build

CMD [ "/app/speedtest_exporter" ]


FROM node:gallium-bullseye-slim AS bitcoin-exporter

WORKDIR /app
COPY bitcoin .

RUN npm install

CMD ["node", "index.js"]
