const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/campaign_system.db');

// Function to handle errors
const handleError = (err, message) => {
  if (err) {
    console.error(`${message}:`, err);
  } else {
    console.log(`${message} succeeded.`);
  }
};

db.serialize(() => {
  // Check existing tables for debugging (Optional)
  db.all(`PRAGMA table_info(donations)`, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Table Info:', rows);
    }
  });

  // Add payment_method column to donations table (if it doesn't exist)
  db.run(`
    ALTER TABLE donations ADD COLUMN payment_method TEXT;
  `, (err) => handleError(err, 'Adding payment_method column to donations table'));

  // Add campaign_title column to donations table (if it doesn't exist)
  db.run(`
    ALTER TABLE donations ADD COLUMN campaign_title TEXT;
  `, (err) => handleError(err, 'Adding campaign_title column to donations table'));

  // Create or verify other tables (existing code)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `, (err) => handleError(err, 'Creating or verifying users table'));

  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      imgSrc TEXT,
      progressPercentage INTEGER,
      amountCollected INTEGER,
      goalAmount INTEGER,
      created_by INTEGER,
      FOREIGN KEY(created_by) REFERENCES users(id)
    )
  `, (err) => handleError(err, 'Creating or verifying campaigns table'));

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
  `, (err) => handleError(err, 'Creating or verifying logs table'));

  db.run(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      amount INTEGER NOT NULL,
      payment_method TEXT,
      message TEXT,
      campaign_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(campaign_id) REFERENCES campaigns(id)
    )
  `, (err) => handleError(err, 'Creating or verifying donations table'));
});

module.exports = db;
