FROM node:20-slim

# dependências de sistema exigidas pelo better-sqlite3 (compilação nativa)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# pasta onde o sqlite guarda os dados (pode virar volume)
RUN mkdir -p /app/data

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
