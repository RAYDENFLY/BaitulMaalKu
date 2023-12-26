const bcrypt = require('bcrypt');
const connection = require('../database');

exports.getLogin = (req, res) => {
    res.render('admin/login');
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await connection.execute('SELECT * FROM accounts WHERE username = ?', [username]);
        const rows = result[0];

        if (rows && rows.length > 0) {
            const account = rows[0];
            const passwordMatch = await bcrypt.compare(password, account.password);

            if (passwordMatch) {
                req.session.accountLoggedIn = true;
                // Redirect to the dashboard upon successful login
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/admin/login');
            }
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// adminControllers.js
exports.getDashboard = (req, res) => {
    if (req.session.accountLoggedIn) {
        res.render('admin/dashboard/dashboardAdmin');
    } else {
        res.redirect('/admin/login');
    }
};


exports.getRegister = (req, res) => {
    res.render('admin/dashboard/register');
};

exports.postRegister = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};