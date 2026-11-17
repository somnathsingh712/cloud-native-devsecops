
FROM nginx:alpine

# Upgrade vulnerable Alpine packages
RUN apk upgrade --no-cache libxslt zlib

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
