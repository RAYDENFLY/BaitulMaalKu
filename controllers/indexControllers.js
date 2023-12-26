exports.getIndex = (req, res) => {
    res.render('index');
};

exports.getDokumentasi = (req, res) => {
    res.render('homePage/dokumentasi');
};

exports.getMitraKami = (req, res) => {
    res.render('homePage/mitra-kami');
};

exports.getTataKelola = (req, res) => {
    res.render('homePage/tataKelola');
};
