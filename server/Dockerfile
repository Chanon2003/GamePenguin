FROM node:20.18.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "start"]
