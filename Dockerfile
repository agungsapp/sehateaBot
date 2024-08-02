# Gunakan image dasar Node.js
FROM node:18

# Set direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Expose port
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
