const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const projectsPath = path.join(__dirname, '../json/dokumentasi.json');

// Fungsi untuk membaca dan memparsing file JSON
function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error membaca file JSON di ${filePath}:`, error);
        throw error;
    }
}

function generateImageData(categories) {
    const allImageData = [];

    categories.forEach(category => {
        const folderPath = path.join(__dirname, '../public/assets/img/portfolio', category.toLowerCase());
        console.log('Mencoba untuk membaca folder:', folderPath);
        if (fs.existsSync(folderPath)) {
            const categoryImageData = generateCategoryData(folderPath, category);
            allImageData.push(...categoryImageData);
        } else {
            console.error('Folder tidak ditemukan:', folderPath);
        }
    });

    return allImageData;
}

function generateCategoryData(folderPath, category) {
    let imageFiles = [];

    try {
        imageFiles = fs.readdirSync(folderPath);
    } catch (error) {
        console.error(`Error membaca folder di ${folderPath}:`, error);
        return [];
    }

    const categoryImageData = imageFiles.map((filename) => {
        const title = capitalizeFirstLetter(category); // Menggunakan fungsi untuk mengubah huruf pertama menjadi besar
        const imageUrl = path.join('assets', 'img', 'portfolio', category.toLowerCase(), filename);
        return { title, category, imageUrl };
    });

    return categoryImageData;
}

function capitalizeFirstLetter(word) {
    // Membagi kata menjadi array kata
    const words = word.split(' ');
    // Mengubah huruf pertama setiap kata menjadi besar
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    // Menggabungkan kembali kata-kata menjadi satu string
    return capitalizedWords.join(' ');
}

exports.getIndex = (req, res) => {
    try {
        const dokumentasi = require('../json/dokumentasi.json');
        const campaignsPath = path.join(__dirname, '../json/campaigns.json');

        const categories = ['Pintara', 'Akademi-CIMB', 'QurbanKu', 'Akademi-MNK']; // Ganti dengan kategori yang diinginkan
        const imageData = generateImageData(categories);
        const campaigns = readJSONFile(campaignsPath);

        // Tampilkan hasil
        console.log('Image Data:', JSON.stringify(imageData, null, 2));

        res.render('index', { imageData, dokumentasi, campaigns });
    } catch (error) {
        console.error('Error di getIndex:', error);
        res.status(500).send('Terjadi kesalahan di server.');
    }
};

exports.getDokumentasi = (req, res) => {
    try {
        const dokumentasi = require('../json/dokumentasi.json');

        const categories = ['Pintara', 'Akademi-CIMB', 'QurbanKu', 'Akademi-MNK']; // Ganti dengan kategori yang diinginkan
        const imageData = generateImageData(categories);

        // Tampilkan hasil
        console.log('Image Data:', JSON.stringify(imageData, null, 2));
        res.render('homePage/dokumentasi', { imageData, dokumentasi });
    } catch (error) {
        console.error('Error di getDokumentasi:', error);
        res.status(500).send('Terjadi kesalahan di server.');
    }
};

exports.getMitraKami = (req, res) => {
    res.render('homePage/mitra-kami');
};

exports.getTataKelola = (req, res) => {
    res.render('homePage/tataKelola');
};
