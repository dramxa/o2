FROM registry.o2.elasticcloud.ru:5000/library/node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# этап production (production-stage)
FROM registry.o2.elasticcloud.ru:5000/library/nginx:stable-alpine as production-stage
# Copy the respective nginx configuration files
COPY CONF/default.conf /etc/nginx/conf.d/default.conf
COPY CONF/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

CMD ["/bin/sh","-c", "if [ -n \"${BRAND_PATH}\" ]; then echo envsubst '${BRAND_PATH}' with ${BRAND_PATH} && envsubst '${BRAND_PATH}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf; fi ; nginx -g 'daemon off;'"]