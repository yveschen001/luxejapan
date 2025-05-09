FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express && apk add --no-cache curl
EXPOSE 3000
CMD ["node", "index.js"]
