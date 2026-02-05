FROM node:18-alpine AS build
WORKDIR /app/demo
COPY demo/package*.json ./
RUN npm install
COPY demo/src ./src
COPY demo/public ./public
COPY demo/vite.config.js ./
COPY demo/index.html ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/demo/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
