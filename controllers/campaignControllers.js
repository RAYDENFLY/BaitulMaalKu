const db = require('../database');

// Fungsi untuk memformat mata uang
function formatCurrency(amount) {
    return `Rp. ${parseInt(amount).toLocaleString('id-ID')}`;
}

// Menampilkan semua log
exports.getAllLogs = (req, res) => {
    db.all('SELECT * FROM logs ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error(err);  // Debugging
            return res.status(500).json({ message: 'Gagal mengambil data log.' });
        }
        res.render('logs', { logs: rows });
    });
};

// Menampilkan semua kampanye
exports.getAllCampaigns = (req, res) => {
    db.all(`SELECT * FROM campaigns`, (err, rows) => {
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
    db.all(`SELECT * FROM campaigns`, (err, campaigns) => {
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

            console.log('Campaigns:', campaigns); // Log data kampanye
            console.log('Logs:', logs); // Log data log

            res.render('campaigns', {
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

