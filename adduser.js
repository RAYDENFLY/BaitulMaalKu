const db = require('./database');
const bcrypt = require('bcrypt');

// Daftar pengguna yang ingin ditambahkan
const users = [
  {
    username: 'markom.baitulmaalku',
    password: 'bmku16762019'
  }
];

// Tambahkan pengguna ke database
users.forEach(user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);

  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [user.username, hashedPassword],
    function(err) {
      if (err) {
        console.error(`Gagal menambahkan pengguna ${user.username}: ${err.message}`);
      } else {
        console.log(`Pengguna ${user.username} berhasil ditambahkan.`);
      }
    }
  );
});

// Example userId for demonstration, you should replace it with actual ID or logic
const userId = 1;

db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('User data:', row);
});
