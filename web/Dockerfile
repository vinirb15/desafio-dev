FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ARG API_URL
ENV API_URL=$API_URL

EXPOSE 3000
CMD ["npm", "start"]
