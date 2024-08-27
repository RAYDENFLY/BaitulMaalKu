const db = require('../database');
const bcrypt = require('bcrypt');

// Fungsi Registrasi Pengguna
exports.register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Registrasi gagal, username sudah ada.' });
            }
            res.status(200).json({ message: 'Registrasi berhasil!' });
        }
    );
};

// Fungsi Login Pengguna
exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Username tidak ditemukan.' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Password salah.' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
        };

        return res.redirect('/campaigns');
    });
};

// Fungsi Logout Pengguna
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal logout.' });
        }
        res.redirect('/login');
    });
};
