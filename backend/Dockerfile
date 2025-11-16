# Używamy oficjalnego obrazu Node.js w wersji Alpine (lekki)
FROM node:22-alpine

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy pliki package*.json
COPY package*.json ./

# Instalujemy tylko produkcyjne zależności
RUN npm ci --omit=dev

# Kopiujemy resztę plików aplikacji
COPY . .

# Ustawiamy zmienną środowiskową dla portu
ENV PORT=8080

# Eksponujemy port 8080
EXPOSE 8080

# Uruchamiamy aplikację
CMD ["npm", "start"]
