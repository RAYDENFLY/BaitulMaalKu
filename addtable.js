const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/campaign_system.db');

db.serialize(() => {
  // Menambahkan kolom yang hilang
  db.run(`ALTER TABLE campaigns ADD COLUMN progressPercentage INTEGER`, (err) => {
    if (err) {
      console.error('Error adding progressPercentage column:', err.message);
    } else {
      console.log('Added progressPercentage column');
    }
  });

  db.run(`ALTER TABLE campaigns ADD COLUMN amountCollected TEXT`, (err) => {
    if (err) {
      console.error('Error adding amountCollected column:', err.message);
    } else {
      console.log('Added amountCollected column');
    }
  });

  db.run(`ALTER TABLE campaigns ADD COLUMN goalAmount TEXT`, (err) => {
    if (err) {
      console.error('Error adding goalAmount column:', err.message);
    } else {
      console.log('Added goalAmount column');
    }
  });
});

db.close();
