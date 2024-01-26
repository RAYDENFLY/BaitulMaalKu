const fs = require('fs');
const path = require('path');

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
        const title = path.basename(filename, path.extname(filename));
        const imageUrl = path.join('assets','img', 'portfolio', category.toLowerCase(), filename);
        return { title, category, imageUrl };
    });

    return categoryImageData;
}

exports.getIndex = (req, res) => {
    const dokumentasi = require('../json/dokumentasi.json');

    const categories = ['Pintara', 'Akademi Berdaya', 'Lainnya']; // Ganti dengan kategori yang diinginkan
    const imageData = generateImageData(categories);

    // Tampilkan hasil
    console.log(JSON.stringify(imageData, null, 2));

    res.render('index', { imageData, dokumentasi });
};

exports.getDokumentasi = (req, res) => {
    const dokumentasi = require('../json/dokumentasi.json');

    const categories = ['Pintara', 'Akademi Berdaya', 'Lainnya']; // Ganti dengan kategori yang diinginkan
    const imageData = generateImageData(categories);

    // Tampilkan hasil
    console.log(JSON.stringify(imageData, null, 2));
    res.render('homePage/dokumentasi', {imageData, dokumentasi});
};



exports.getMitraKami = (req, res) => {
    res.render('homePage/mitra-kami');
};
exports.getKonfirmasiDonasi = (req, res) => {
    res.render('homePage/konfirmasiDonasi');
};

exports.getTataKelola = (req, res) => {
    res.render('homePage/tataKelola');
};
