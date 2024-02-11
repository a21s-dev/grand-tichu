FROM node:14 as build-step

WORKDIR /usr/src/app

COPY dist .

FROM nginx:1.17.1-alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /usr/src/app/ /usr/share/nginx/html
