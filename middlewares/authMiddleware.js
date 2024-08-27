function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // Pengguna terautentikasi, lanjutkan ke rute berikutnya
    } else {
        res.redirect('/auth/login'); // Pengguna tidak terautentikasi, arahkan ke halaman login
    }
}

module.exports = { isAuthenticated };
