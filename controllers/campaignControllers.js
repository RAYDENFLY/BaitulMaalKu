const db = require('../database');

const { Parser } = require('json2csv');
const XLSX = require('xlsx');

// Fungsi untuk memformat mata uang
function formatCurrency(amount) {
    return `Rp. ${parseInt(amount).toLocaleString('id-ID')}`;
}

// Menampilkan semua kampanye
exports.getAllCampaigns = (req, res) => {
    db.all('SELECT * FROM campaigns', (err, rows) => {
        if (err) {
            console.error(err);  // Debugging
            return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
        }

        // Format mata uang
        rows.forEach(campaign => {
            campaign.amountCollected = formatCurrency(campaign.amountCollected);
            campaign.goalAmount = formatCurrency(campaign.goalAmount);
        });

        res.render('campaigns', { campaigns: rows });
    });
};

// Menampilkan dashboard dengan semua kampanye dan logs
exports.showDashboard = (req, res) => {
    db.all('SELECT * FROM campaigns', (err, campaigns) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
        }

        campaigns.forEach(campaign => {
            campaign.amountCollected = formatCurrency(campaign.amountCollected);
            campaign.goalAmount = formatCurrency(campaign.goalAmount);
        });

        db.all('SELECT * FROM logs ORDER BY created_at DESC', (err, logs) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Gagal mengambil data log.' });
            }

            res.render('dashboard', {
                campaigns: campaigns,
                logs: logs
            });
        });
    });
};

// Menambahkan kampanye baru
exports.addCampaign = (req, res) => {
    try {
        const { imgSrc, title, description, progressPercentage, amountCollected, goalAmount } = req.body;
        const userId = req.session.user.id;

        if (!imgSrc || !title || !description || !progressPercentage || !amountCollected || !goalAmount) {
            return res.status(400).json({ message: "Semua kolom wajib diisi." });
        }

        // Menambahkan kampanye baru ke database
        db.run(
            `INSERT INTO campaigns (imgSrc, title, description, progressPercentage, amountCollected, goalAmount) VALUES (?, ?, ?, ?, ?, ?)`,
            [imgSrc, title, description, progressPercentage, amountCollected, goalAmount],
            function(err) {
                if (err) {
                    console.error('Error adding campaign:', err);
                    return res.status(500).json({ message: 'Gagal menambahkan kampanye.' });
                }

                // Tambahkan log untuk operasi ini
                db.run(
                    `INSERT INTO logs (user_id, action, campaign_id) VALUES (?, 'add', ?)`,
                    [userId, this.lastID],  // this.lastID adalah ID kampanye yang baru ditambahkan
                    (logErr) => {
                        if (logErr) {
                            console.error('Error adding log:', logErr);
                        }
                    }
                );

                res.redirect('/campaigns');
            }
        );
    } catch (error) {
        console.error('Error adding campaign:', error);
        res.status(500).send('Server Error');
    }
};

// Mengedit kampanye
exports.editCampaign = (req, res) => {
    const { id, imgSrc, title, progressPercentage, amountCollected, goalAmount } = req.body;
    const userId = req.session.user.id;

    db.run(
        `UPDATE campaigns SET imgSrc = ?, title = ?, progressPercentage = ?, amountCollected = ?, goalAmount = ? WHERE id = ?`,
        [imgSrc, title, progressPercentage, amountCollected, goalAmount, id],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Gagal mengedit kampanye.' });
            }

            // Tambahkan log untuk operasi ini
            db.run(
                `INSERT INTO logs (user_id, action, campaign_id) VALUES (?, 'edit', ?)`,
                [userId, id],
                (logErr) => {
                    if (logErr) {
                        console.error('Error adding log:', logErr);
                    }
                }
            );

            res.redirect('/campaigns');
        }
    );
};

// Menghapus kampanye
exports.deleteCampaign = (req, res) => {
    const { id } = req.body;
    const userId = req.session.user.id;

    db.run(`DELETE FROM campaigns WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Gagal menghapus kampanye.' });
        }

        // Tambahkan log untuk operasi ini
        db.run(
            `INSERT INTO logs (user_id, action, campaign_id) VALUES (?, 'delete', ?)`,
            [userId, id],
            (logErr) => {
                if (logErr) {
                    console.error('Error adding log:', logErr);
                }
            }
        );

        res.redirect('/campaigns');
    });
};

// Mengupdate donasi yang dikonfirmasi
exports.updateCollected = (req, res) => {
    const { id, amount } = req.body;

    if (!id || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).send('Invalid data');
    }

    db.run(
        `UPDATE campaigns SET amountCollected = amountCollected + ? WHERE id = ?`,
        [amount, id],
        function(err) {
            if (err) {
                return res.status(500).send('Error updating campaign');
            }
            res.redirect('/campaigns/datacrm'); // Redirect or render a success page
        }
    );
};

// Menolak donasi
exports.rejectDonation = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('Invalid data');
    }

    db.run(
        `UPDATE donations SET status = 'Rejected' WHERE id = ?`,
        [id],
        function(err) {
            if (err) {
                return res.status(500).send('Error rejecting donation');
            }
            res.redirect('/campaigns/datacrm'); // Redirect or render a success page
        }
    );
};

exports.getCRMData = (req, res) => {
    db.all(`
        SELECT d.id, d.name, d.phone, d.email, d.amount, d.message, d.status, c.title AS campaign_title, d.created_at
        FROM donations d
        LEFT JOIN campaigns c ON d.campaign_id = c.id
        ORDER BY d.created_at DESC
    `, (err, rows) => {
        if (err) {
            console.error('Error retrieving CRM data:', err);
            return res.status(500).json({ message: 'Gagal mengambil data CRM.' });
        }

        console.log('CRM Data:', rows); // Debugging output
        res.render('datacrm', { donations: rows });
    });
};



exports.downloadDonationsCSV = (req, res) => {
    db.all(`
        SELECT d.id, d.name, d.phone, d.email, d.amount, d.message, d.status, c.title AS campaign_title, d.created_at
        FROM donations d
        LEFT JOIN campaigns c ON d.campaign_id = c.id
        ORDER BY d.created_at DESC
    `, (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ message: 'Gagal mengambil data.' });
        }

        const fields = ['id', 'name', 'phone', 'email', 'amount', 'message', 'status', 'campaign_title', 'created_at'];
        const opts = { fields };

        try {
            const parser = new Parser(opts);
            const csv = parser.parse(rows);

            res.header('Content-Type', 'text/csv');
            res.attachment('donations.csv');
            res.send(csv);
        } catch (err) {
            console.error('Error generating CSV:', err);
            res.status(500).json({ message: 'Gagal membuat file CSV.' });
        }
    });
};

exports.downloadDonationsExcel = (req, res) => {
    db.all(`
        SELECT d.id, d.name, d.phone, d.email, d.amount, d.message, d.status, c.title AS campaign_title, d.created_at
        FROM donations d
        LEFT JOIN campaigns c ON d.campaign_id = c.id
        ORDER BY d.created_at DESC
    `, (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ message: 'Gagal mengambil data.' });
        }

        try {
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Donations');

            const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('donations.xlsx');
            res.send(buf);
        } catch (err) {
            console.error('Error generating Excel file:', err);
            res.status(500).json({ message: 'Gagal membuat file Excel.' });
        }
    });
};
