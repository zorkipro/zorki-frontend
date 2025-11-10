FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3005
ENV NODE_ENV=production
ENV HOST=0.0.0.0

CMD ["npm", "run", "preview", "--", "--port", "3005", "--host", "0.0.0.0", "--strictPort"]
