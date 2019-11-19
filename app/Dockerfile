FROM node:lts

WORKDIR /app

# Install all dependencies.
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY public/ ./public/
COPY scrapers/ ./scrapers/
COPY views/ ./views/
COPY server.js ./

EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
