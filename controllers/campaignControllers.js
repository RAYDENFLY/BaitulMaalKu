const db = require('../database');
const useragent = require('useragent');
const ipinfo = require('ipinfo'); // Layanan untuk mendapatkan geolokasi dari IP
const ws = require('../middlewares/webSocket'); // Import the WebSocket server
const WebSocket = require('ws'); // Import WebSocket class (optional if needed)


const { Parser } = require('json2csv');
const XLSX = require('xlsx');

// Fungsi untuk memformat mata uang
function formatCurrency(amount) {
    return `Rp. ${parseInt(amount).toLocaleString('id-ID')}`;
}

// Menampilkan semua kampanye
exports.getAllCampaigns = (req, res) => {
    // Ambil semua data kampanye
    db.all('SELECT * FROM campaigns', (err, rows) => {
        if (err) {
            console.error('Error fetching campaigns:', err);
            return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
        }

        // Format mata uang untuk setiap kampanye
        rows.forEach(campaign => {
            campaign.amountCollected = formatCurrency(campaign.amountCollected);
            campaign.goalAmount = formatCurrency(campaign.goalAmount);
        });

        // Ambil semua data logs
        db.all('SELECT * FROM logs ORDER BY timestamp DESC', (err, logs) => {
            if (err) {
                console.error('Error fetching logs:', err);
                return res.status(500).json({ message: 'Gagal mengambil data log.' });
            }

            // Render view campaigns dengan data kampanye dan logs
            res.render('campaigns', { campaigns: rows, logs: logs });
        });
    });
};


// Menampilkan dashboard dengan semua kampanye dan logs
exports.showDashboard = (req, res) => {
    // Ambil semua data kampanye
    db.all('SELECT * FROM campaigns', (err, campaigns) => {
        if (err) {
            console.error('Error fetching campaigns:', err);
            return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
        }

        // Format mata uang untuk setiap kampanye
        campaigns.forEach(campaign => {
            campaign.amountCollected = formatCurrency(campaign.amountCollected);
            campaign.goalAmount = formatCurrency(campaign.goalAmount);
        });

        // Ambil semua data logs
        db.all('SELECT * FROM logs ORDER BY timestamp DESC', (err, logs) => {
            if (err) {
                console.error('Error fetching logs:', err);
                return res.status(500).json({ message: 'Gagal mengambil data log.' });
            }

            // Render view dashboard dengan data kampanye dan logs
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

    console.log('Attempting to delete campaign with ID:', id); // Debugging

    db.run(`DELETE FROM campaigns WHERE id = ?`, [id], function(err) {
        if (err) {
            console.error('Error deleting campaign:', err);
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
        SELECT d.id, d.name, d.phone, d.amount, d.message, d.status, c.title AS campaign_title, d.created_at
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
        SELECT d.id, d.name, d.phone, d.amount, d.message, d.status, c.title AS campaign_title, d.created_at
        FROM donations d
        LEFT JOIN campaigns c ON d.campaign_id = c.id
        ORDER BY d.created_at DESC
    `, (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ message: 'Gagal mengambil data.' });
        }

        const fields = ['id', 'name', 'phone', 'amount', 'message', 'status', 'campaign_title', 'created_at'];
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
        SELECT d.id, d.name, d.phone, d.amount, d.message, d.status, c.title AS campaign_title, d.created_at
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

// Menampilkan form donasi untuk kampanye tertentu
exports.showDonationForm = (req, res) => {
    const campaignId = req.params.id;

    db.get('SELECT * FROM campaigns WHERE id = ?', [campaignId], (err, campaign) => {
        if (err) {
            console.error('Error retrieving campaign:', err);
            return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
        }

        if (!campaign) {
            return res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
        }

        // Render form donasi dengan data kampanye
        res.render('donationForm', { campaign });
    });
};


// Menyimpan data donasi dari form
exports.submitDonation = (req, res) => {
    const { name, phone, amount, message, campaign_id } = req.body;

    if (!name || !phone || !amount || !campaign_id) {
        return res.status(400).send('Semua kolom wajib diisi.');
    }

    // Simpan donasi ke dalam database
    db.run(
        `INSERT INTO donations (name, phone, amount, message, status, campaign_id) 
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [name, phone, amount, message, campaign_id],
        function(err) {
            if (err) {
                console.error('Error submitting donation:', err);
                return res.status(500).json({ message: 'Gagal mengirim donasi.' });
            }

            // Broadcast the new donation to all connected WebSocket clients
            ws.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        action: 'new_donation',
                        donation: { name, phone, amount, message, campaign_id }
                    }));
                }
            });

            res.redirect(`/campaigns/${campaign_id}/donate`);
        }
    );
};
// Menghapus donasi
exports.deleteDonation = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('Invalid data');
    }

    db.run(
        `DELETE FROM donations WHERE id = ?`,
        [id],
        function(err) {
            if (err) {
                console.error('Error deleting donation:', err);
                return res.status(500).send('Error deleting donation');
            }
            res.redirect('/campaigns/datacrm'); // Redirect to CRM data page after deletion
        }
    );
};

// Route untuk mengunduh database
exports.downloadDatabase = (req, res) => {
    const filePath = path.join(__dirname, '..', 'models', 'campaign_system.db');  // Path ke file database

    res.download(filePath, 'campaign_system.db', (err) => {
        if (err) {
            console.error('Error downloading database file:', err);
            res.status(500).json({ message: 'Gagal mengunduh file.' });
        }
    });
};



exports.showCampaignPage = (req, res) => {
    const campaignId = req.params.id;
    // Mendapatkan User-Agent untuk informasi perangkat dan browser
    const agent = useragent.parse(req.headers['user-agent']);
     // Mendapatkan alamat IP pengguna
     const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

     // Mengambil data geolokasi dari IP menggunakan IPInfo atau layanan lain
    ipinfo(ipAddress, (err, cLoc) => {
        if (err) {
            console.error('Error getting geolocation:', err);
        } else {
            const location = cLoc ? `${cLoc.city}, ${cLoc.region}, ${cLoc.country}` : 'Unknown';

            // Simpan informasi ke database atau log file
            const logData = {
                ip: ipAddress,
                browser: agent.toString(), // Informasi tentang browser dan OS
                location: location,
                timestamp: new Date().toISOString(),
                campaign_id: campaignId,
            };

            // Simpan log ke dalam tabel logs_access
            db.run(
                `INSERT INTO logs_access (ip, browser, location, timestamp, campaign_id) VALUES (?, ?, ?, ?, ?)`,
                [logData.ip, logData.browser, logData.location, logData.timestamp, logData.campaign_id],
                (logErr) => {
                    if (logErr) {
                        console.error('Error logging access:', logErr);
                    }
                }
            );
        }
    }
)


    
    db.get('SELECT * FROM campaigns WHERE id = ?', [campaignId], (err, campaign) => {
        if (err) {
            console.error('Error retrieving campaign:', err);
            return res.status(500).json({ message: 'Gagal mengambil data kampanye.' });
        }

        if (!campaign) {
            return res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
        }

        // Menyertakan URL halaman dalam data
        const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        
        // Render template dengan URL
        res.render('donationForm', { 
            campaign,
            pageUrl,
            logs: logs
        });
    });
};

