# Stage 1
FROM node:20-alpine as build-step

ARG APP_NAME

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm ci
# Install nx globally
RUN npm install -g nx
# Set NX_DAEMON environment variable to false to prevent nx from running in daemon mode
ENV NX_DAEMON=false
RUN nx run ${APP_NAME}:build:production

RUN rm -rf node_modules

# Stage 2
FROM nginx:1.26.0-alpine

ARG APP_NAME

## extensions
RUN apk add brotli nginx-mod-http-brotli
RUN sed -i '1i load_module /usr/lib/nginx/modules/ngx_http_brotli_filter_module.so;' /etc/nginx/nginx.conf
RUN sed -i '1i load_module /usr/lib/nginx/modules/ngx_http_brotli_static_module.so;' /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-step /app/dist/apps/${APP_NAME} /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080