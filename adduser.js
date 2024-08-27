const db = require('./database');
const bcrypt = require('bcrypt');

// Daftar pengguna yang ingin ditambahkan
const users = [
  {
    username: '',
    password: ''
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
