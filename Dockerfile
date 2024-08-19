# Gunakan image base Node.js versi terbaru
FROM node:latest

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file dependensi dan file package.json
COPY package*.json ./

# Install dependensi
RUN npm install


# Salin kode aplikasi ke dalam container
COPY . .

# Port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
