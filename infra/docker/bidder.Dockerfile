# syntax=docker/dockerfile:1.6
FROM golang:1.22.2-alpine AS build
WORKDIR /src
COPY apps/bidder/go.mod .
RUN go mod download
COPY apps/bidder/ ./
RUN go test ./...
RUN go build -o bidder

FROM alpine:3.19
WORKDIR /app
COPY --from=build /src/bidder ./bidder
EXPOSE 8080
CMD ["./bidder"]
