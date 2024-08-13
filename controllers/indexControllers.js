const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const projectsPath = path.join(__dirname, '../json/dokumentasi.json');

function generateImageData(categories) {
    const allImageData = [];

    categories.forEach(category => {
        const folderPath = `public/assets/img/portfolio/${category.toLowerCase()}`;
        const categoryImageData = generateCategoryData(folderPath, category);
        allImageData.push(...categoryImageData);
    });

    return allImageData;
}
function generateCategoryData(folderPath, category) {
    const imageFiles = fs.readdirSync(folderPath);

    const categoryImageData = imageFiles.map((filename, index) => {
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
    const dokumentasi = require('../json/dokumentasi.json');

    const categories = ['Pintara', 'Akademi-CIMB', 'QurbanKu', 'Akademi-MNK']; // Ganti dengan kategori yang diinginkan
    const imageData = generateImageData(categories);

    // Tampilkan hasil
    console.log(JSON.stringify(imageData, null, 2));

    res.render('index', { imageData, dokumentasi });
};

exports.getDokumentasi = (req, res) => {
    const dokumentasi = require('../json/dokumentasi.json');

    const categories = ['Pintara', 'Akademi-CIMB', 'QurbanKu', 'Akademi-MNK']; // Ganti dengan kategori yang diinginkan
    const imageData = generateImageData(categories);

    // Tampilkan hasil
    console.log(JSON.stringify(imageData, null, 2));
    res.render('homePage/dokumentasi', {imageData, dokumentasi});
};

exports.getMitraKami = (req, res) => {
    res.render('homePage/mitra-kami');
};

exports.getTataKelola = (req, res) => {
    res.render('homePage/tataKelola');
};

