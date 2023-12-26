// database.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'baitulmaalku',
    password: 'Programbmku2023',
    database: 'nodelogin',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Create 'accounts' table if it doesn't exist
    connection.query(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `, (error) => {
        if (error) {
            console.error('Error creating table:', error);
        } else {
            console.log('Table created successfully');
        }
    });
});

module.exports = connection;
