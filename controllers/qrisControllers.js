const path = require('path');

const qrisController = {
    getQris: (req, res) => {
        try {
            // Path to the QRIS image - gambar ada di public/assets/img/
            const qrisImagePath = '/assets/img/qrisbmku.png';
            
            res.render('qris', {
                title: 'QRIS BaitulMaal',
                qrisImage: qrisImagePath
            });
        } catch (error) {
            console.error('Error loading QRIS page:', error);
            res.status(500).render('404', { message: 'Error loading QRIS page' });
        }
    }
};

module.exports = qrisController;
