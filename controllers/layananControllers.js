const fs = require('fs').promises;
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
    return fs.readdir(folderPath)
        .then(imageFiles => {
            const categoryImageData = imageFiles.map((filename, index) => {
                const title = path.basename(filename, path.extname(filename));
                const imageUrl = path.join('assets', 'img', 'portfolio', category.toLowerCase(), filename);
                return { title, category, imageUrl };
            });

            return categoryImageData;
        })
        .catch(error => {
            console.error('Error reading image files:', error.message);
            return [];
        });
}

// Baca data JSON dari file secara asynchronous
const jsonDataPath = path.join(__dirname, '../json/dataPelayanankantor.json');
let jsonData = [];

async function readJsonData() {
    try {
        const data = await fs.readFile(jsonDataPath, 'utf8');
        jsonData = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error.message);
    }
}

exports.getKonfirmasiDonasi = (req, res) => {
    res.render('homePage/layanan/konfirmasiDonasi');
};

exports.getKantorLayanan = async (req, res) => {
    await readJsonData();
    res.render('homePage/layanan/kantorPelayanan', { data: jsonData });
};
