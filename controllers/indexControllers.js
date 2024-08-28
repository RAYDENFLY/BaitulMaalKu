const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('../database'); // Pastikan Anda menghubungkan database Anda

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
    const words = word.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ');
}

exports.getIndex = (req, res) => {
    try {
        const dokumentasi = require('../json/dokumentasi.json');

        const categories = ['Pintara', 'Akademi-CIMB', 'QurbanKu', 'Akademi-MNK']; // Ganti dengan kategori yang diinginkan
        const imageData = generateImageData(categories);

        // Fungsi untuk memformat mata uang
        function formatCurrency(amount) {
            return `Rp. ${parseInt(amount).toLocaleString('id-ID')}`;
        }
        // Ambil data campaigns dari database
        db.all('SELECT * FROM campaigns', (err, campaigns) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
            }

            // Format mata uang untuk setiap campaign
            campaigns.forEach(campaign => {
                campaign.amountCollected = formatCurrency(campaign.amountCollected);
                campaign.goalAmount = formatCurrency(campaign.goalAmount);
            });

            // Tampilkan hasil
            res.render('index', { imageData, dokumentasi, campaigns });
        });

    } catch (error) {
        console.error('Error di getIndex:', error);
        res.status(500).send('Terjadi kesalahan di server.');
    }
};


exports.getDokumentasi = (req, res) => {
    try {
        const dokumentasi = readJSONFile(path.join(__dirname, '../json/dokumentasi.json'));
        const categories = ['Pintara', 'Akademi-CIMB', 'QurbanKu', 'Akademi-MNK'];
        const imageData = generateImageData(categories);

        // Tampilkan hasil di console (untuk debugging)
        console.log('Image Data:', JSON.stringify(imageData, null, 2));
        res.render('homePage/dokumentasi', { imageData, dokumentasi });
    } catch (error) {
        console.error('Error di getDokumentasi:', error);
        res.status(500).send('Terjadi kesalahan di server.');
    }
};

exports.getMitraKami = (req, res) => {
    try {
        res.render('homePage/mitra-kami');
    } catch (error) {
        console.error('Error di getMitraKami:', error);
        res.status(500).send('Terjadi kesalahan di server.');
    }
};

exports.getTataKelola = (req, res) => {
    try {
        res.render('homePage/tataKelola');
    } catch (error) {
        console.error('Error di getTataKelola:', error);
        res.status(500).send('Terjadi kesalahan di server.');
    }
};

exports.saveInvoiceLog = (req, res) => {
    const { programName, donationAmount, uniqueCode, totalWithCode, userId } = req.body;

    db.run(`INSERT INTO invoice_logs (user_id, program_name, donation_amount, unique_code, total_with_code) VALUES (?, ?, ?, ?, ?)`,
        [userId, programName, donationAmount, uniqueCode, totalWithCode],
        function(err) {
            if (err) {
                console.error('Error saving invoice log:', err);
                return res.status(500).json({ message: 'Gagal menyimpan log invoice.' });
            }
            res.status(200).json({ message: 'Log invoice berhasil disimpan.' });
        }
    );
};


exports.handleDonations = (req, res) => {
    const { amount, name, phone, message, paymentMethod, campaign_title } = req.body;

    console.log('Received donation data:', { amount, name, phone, message, paymentMethod, campaign_title });

    // Validasi input
    if (!amount || !name || !phone || isNaN(amount) || amount <= 0) {
        console.log('Validation failed:', { amount, name, phone });
        return res.status(400).json({ success: false, message: 'Data tidak lengkap atau tidak valid.' });
    }

    // Ambil campaign_id berdasarkan campaign_title
    db.get(`SELECT id FROM campaigns WHERE title = ?`, [campaign_title], (err, row) => {
        if (err) {
            console.error('Error fetching campaign ID:', err);
            return res.status(500).json({ success: false, message: 'Gagal mengambil ID kampanye.' });
        }

        const campaign_id = row ? row.id : null;
        const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();
        const totalWithCode = parseFloat(amount) + 5000;

        db.run(`
            INSERT INTO donations (amount, name, phone, message, payment_method, campaign_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [amount, name, phone, message, paymentMethod, campaign_id], function(err) {
            if (err) {
                console.error('Error inserting donation:', err);
                return res.status(500).json({ success: false, message: 'Gagal menyimpan data.' });
            }

            console.log('Donation data inserted successfully.');
            res.json({
                success: true,
                programName: campaign_title,
                amount: amount,
                uniqueCode: uniqueCode,
                totalWithCode: totalWithCode,
                bankInfo: '<div>Informasi Bank</div>',
                whatsappNumber: '08123456789'
            });
        });
    });
};



