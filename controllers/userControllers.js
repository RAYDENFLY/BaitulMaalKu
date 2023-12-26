exports.getLogin = (req, res) => {
    res.render('user/login');
};

exports.postLogin = (req, res) => {
    // Handle user login logic
    req.session.userLoggedIn = true;
    res.redirect('/user/dashboard');
};

exports.getDashboard = (req, res) => {
    if (req.session.userLoggedIn) {
        res.render('user/dashboard/dashboardUser');
    } else {
        res.redirect('/user/login');
    }
};

exports.getRegister = (req, res) => {
    // Handle user registration logic
    res.render('user/register');
};

exports.postRegister = (req, res) => {
    // Handle user registration logic
    res.redirect('/user/dashboard');
};
