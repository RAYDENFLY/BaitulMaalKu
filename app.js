const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const connection = require('./database');
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Set views
app.set('view engine', 'ejs');
app.set('views', 'views');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const layananRoutes = require('./routes/layanan');
const tataKelolaRoutes = require('./routes/tatakelola');
const aboutRoutes = require('./routes/about')

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/layanan', layananRoutes);
app.use('/tatakelola', tataKelolaRoutes)
app.use('/about', aboutRoutes)

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
