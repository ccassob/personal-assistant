FROM node:22-alpine AS build
ARG BUILD_CONFIG=docker
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN node node_modules/@angular/cli/bin/ng.js build --configuration ${BUILD_CONFIG}

FROM nginx:alpine AS runtime
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/personal-assistant-web/browser /usr/share/nginx/html
EXPOSE 80
