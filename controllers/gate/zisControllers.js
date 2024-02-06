const fs = require('fs').promises;
const path = require('path');
const midtransClient = require('midtrans-client');

const projectsPath = path.join(__dirname, '../json/dokumentasi.json');

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'Mid-server-_Sklw5LDZ2-RPuhdQC0kazX-',
});



// Function to generate a unique order ID
function generateUniqueOrderId() {
    return Math.floor(Math.random() * 1000000000);
}

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



const createSnapTransaction = async (parameter) => {
    try {
        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;
        return transactionToken;
    } catch (error) {
        console.error('Error creating Snap transaction:', error);
        throw error;
    }
};

exports.getPaymentInfaq = (req, res) => {
    res.render('payment/homeInfaq');
};

exports.getPaymentZakat = async (req, res) => {
    try {
        // Call the function to get the transactionToken
        const nominal = req.body.nominal;
        const nama = req.body.nama;
        const wa = req.body.wa;
        const email = req.body.email;

        // Prepare transaction details for Midtrans
        const transactionDetails = {
            order_id: generateUniqueOrderId(),
            gross_amount: nominal,
            items: [{
                name: 'Zakat Payment',
                price: nominal,
                quantity: 1,
            }],
            customer_details: {
                first_name: nama,
                email: email,
                phone: wa,
            },
            credit_card: {
                secure: true
            }  // Adding credit_card details as per your parameter
        };
        const transactionToken = await createSnapTransaction(transactionDetails);

        // Render the EJS template and pass the transactionToken as a local variable
        res.render('payment/homeZakat', { transactionToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering Zakat payment page.');
    }
};
