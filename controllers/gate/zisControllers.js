const fs = require('fs')
const path = require('path');
const midtransClient = require('midtrans-client');
require('dotenv').config();

const PDFDocument = require('pdfkit');

exports.generateInvoicePDF = (req, res) => {
    try {
        const { orderId, nama, email, nominal, jenisZakat, notelp } = req.query;

        // Create a document
        const doc = new PDFDocument();

        // Set font
        doc.font('Helvetica');

        // Add logo to header
        const logoPath = path.join(__dirname, '../../public/assets/img/bmku.png'); // Ganti 'logo.png' dengan nama file logo Anda
        doc.image(logoPath, 50, 45, { width: 130 });
        doc.fillColor('#444444')
        doc.fontSize(20)
        doc.fontSize(10)
        doc.text('JL. Ahmad Yani, Desa Dawuan Timur', 200, 65, { align: 'right' })
        doc.text('Kecamatan Cikampek, Kabupaten Karawang',200,80,{align:'right'})
        doc.text('Provinsi Jawa Barat, Indonesia, 41373', 200, 95, { align: 'right' })
        doc.moveDown();

        // Add header
        const pageWidth = doc.page.width;
        const textWidth = doc.widthOfString('Invoice');
        const textX = (pageWidth - textWidth) / 2;
        doc.moveDown(); // Move the cursor down to start a new line
        doc.text('Invoice', textX, doc.y);
        

        // Add content to the document
        function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
            doc.fontSize(10)
                .text(c1, 50, y)
                .text(c2, 150, y)
                .text(c3, 280, y, { width: 90, align: 'right' })
                .text(c4, 370, y, { width: 90, align: 'right' })
                .text(c5, 0, y, { align: 'right' });
        }

        console.log('Nominal:', nominal);

        function formatCurrency(amount) {
            return 'Rp ';
        }
        
        // Set header row
        generateTableRow(
            doc,
            330,
            'Order ID',
            'Nama',
            'Email',
            'No Telp',
            'Jenis Zakat',
            'Nominal'
        );

        // Set content row
        const position = 200 + 30;
        generateTableRow(
            doc,
            360,
            orderId,
            nama,
            email
        );
        const positionPhone = 200 + 60; // Menambah 30px untuk membuatnya terletak di bawah baris sebelumnya
        generateTableRow(
            doc,
            positionPhone,
            jenisZakat,
            notelp, // Isi kolom Nomor Telepon dengan nilai notelp
            nominal
        );
        
        // Add footer
        doc.fontSize(10).text('www.baitulmaalku.com', { align: 'center' });

        // Finalize PDF file
        doc.end();

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice.pdf"`);

        // Pipe PDF file to response
        doc.pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



// Inisialisasi Snap object menggunakan kunci dari variabel lingkungan
let snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const projectsPath = path.join(__dirname, '../json/dokumentasi.json');
const transactionsPath = path.join(__dirname, '../../json/transactions.json');
async function saveTransaction(transactionData) {
    try {
        // Baca data transaksi yang ada
        let transactions = await fs.readFile(transactionsPath, 'utf-8');
        
        // Jika file kosong atau tidak ada, inisialisasi dengan array kosong
        if (!transactions) {
            transactions = [];
        } else {
            transactions = JSON.parse(transactions);
        }
        
        // Tambahkan data transaksi baru
        transactions.push(transactionData);
        
        // Simpan kembali ke file JSON
        await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2));
        
        console.log('Transaction saved successfully.');
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}

exports.getPaymentZakat = async (req, res) => {
    try {
        // Mendapatkan transactionToken dari query string atau sesuai kebutuhan aplikasi
        const transactionToken = req.query.transactionToken;
        const clientKey = process.env.MIDTRANS_CLIENT_KEY;

        
        // Render view homeZakat dengan menyertakan transactionToken
        res.render('payment/homeZakat', { transactionToken, clientKey });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getPaymentInfaq = (req, res) => {
    res.render('payment/infaq');
};
exports.getPaymentInvoice = (req, res) => {
    try {
        // Dapatkan data dari query string atau sesuai kebutuhan aplikasi
        const { orderId, nama, email, nominal, jenisZakat, notelp } = req.query;
          // Buat objek invoiceData
          const invoiceData = {
            nama: nama,
            email: email,
            nominal: 'Rp. ' + nominal,
            jenisZakat: jenisZakat,
            notelp: notelp // Tambahkan notelp ke objek invoiceData
            // Anda dapat menambahkan data lain yang diperlukan
        };

        // Render view invoice dengan menyertakan data invoice
        res.render('payment/invoice', { orderId, nama, email, nominal, jenisZakat, notelp });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



exports.postPayment = async (req, res) => {
    try {
        // Ambil data pembayaran dari request
        const { nominal, nama, wa, email, jenisZakat } = req.body;

        // Persiapan parameter transaksi untuk Midtrans Snap
        let parameter = {
            "transaction_details": {
                "order_id": "ORDER-" + Date.now(), // Menggunakan timestamp sebagai orderId
                "gross_amount": nominal // Nominal pembayaran
            },
            "item_details": [{
                "id": "ITEM1",
                "price": nominal,
                "quantity": 1,
                "name": "zakat-" + jenisZakat, // Nama item pembayaran
                "brand": "BaitulMaalku",
                "category": "Digital",
                "merchant_name": "Zakat"
            }],
            "customer_details": {
                "first_name": nama,
                "email": email,
                "phone": wa,
            },
            "callbacks": {
                "finish": `baitulmaalku.com/gate/payment/invoice?orderId=ORDER-${Date.now()}&nama=${nama}&email=${email}&nominal=${nominal}&jenisZakat=${jenisZakat}&notelp=${wa}`
            }
            
        };
        
        
        // Buat transaksi menggunakan Midtrans Snap
        const transaction = await snap.createTransaction(parameter);

         // Ambil token transaksi dari hasil
         let transactionToken = transaction.token;
         let transactionRedirectUrl = transaction.redirect_url;
         console.log('transactionToken:', transactionToken);
         console.log('transactionRedirectUrl:', transactionRedirectUrl);
         
         await saveTransaction({
            nama: nama,
            email: email,
            nominal: nominal,
            jenisZakat: jenisZakat,
            phone: wa,
            orderId:  "ORDER-" + Date.now()
        });
         // Langsung redirect ke URL redirect
         res.redirect(transactionRedirectUrl);
    } catch (error) {
        // Tangani error jika terjadi
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
