
FROM node:20 AS build

WORKDIR /app


RUN npm install -g @angular/cli@15


COPY package*.json ./


RUN npm install


COPY . .


RUN ng build --configuration production
RUN ls -al /app/dist

FROM nginx:alpine
COPY --from=build /app/dist/events-project-front /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
