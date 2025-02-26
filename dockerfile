FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_ENV production

RUN npm run build --legacy-peer-deps

EXPOSE 8080

CMD ["npm", "start"]