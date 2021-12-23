FROM golang:1.16-alpine AS speedtest-exporter

RUN apk -U upgrade
RUN apk add git make bash curl

WORKDIR /app

RUN git clone https://github.com/nlamirault/speedtest_exporter.git .
RUN make build

CMD [ "/app/speedtest_exporter" ]


FROM node:gallium-bullseye-slim AS bitcoin-exporter

RUN apt update && apt dist-upgrade -y
WORKDIR /app
COPY bitcoin .

RUN npm install

CMD ["node", "index.js"]
