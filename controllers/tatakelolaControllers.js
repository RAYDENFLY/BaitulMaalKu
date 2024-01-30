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

exports.getTataKelola = (req, res) => {
    res.render('homePage/tataKelola/legalFormat');
};
