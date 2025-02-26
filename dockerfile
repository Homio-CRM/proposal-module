FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY .env ./

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]