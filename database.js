const mysql = require('mysql2');
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
    host: 'cp.baitulmaalku.com', // hanya hostname
    port: 3220, // port diatur terpisah
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL');

    connection.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('The solution is: ', results[0].solution);
        }
        connection.end();
    });
});
