const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/campaign_system.db');

db.serialize(() => {
  // (Opsional) Memeriksa tabel untuk memastikan struktur
  db.all(`PRAGMA table_info(campaigns)`, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Table Info:', rows);
    }
  });

  // Membuat tabel users jika belum ada
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Membuat tabel campaigns dengan kolom yang benar
  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      imgSrc TEXT,
      progressPercentage INTEGER,
      amountCollected TEXT,
      goalAmount TEXT,
      created_by INTEGER,
      FOREIGN KEY(created_by) REFERENCES users(id)
    )
  `);

  // Membuat tabel logs jika belum ada
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      campaign_id INTEGER,
      user_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(campaign_id) REFERENCES campaigns(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// SQL untuk membuat tabel logs
const createLogsTable = `
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    campaign_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.run(createLogsTable, (err) => {
  if (err) {
      console.error('Error creating logs table:', err);
  } else {
      console.log('Logs table created or already exists.');
  }
});

module.exports = db;
