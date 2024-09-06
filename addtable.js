const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/campaign_system.db');

// Function to modify the donations table
function alterDonationsTable() {
    db.serialize(() => {
        // Step 1: Create a new table with email column allowing NULL
        db.run(`PRAGMA foreign_keys = OFF`, (err) => {
            if (err) {
                console.error('Error disabling foreign keys:', err);
            } else {
                console.log('Foreign keys disabled.');
            }
        });

        db.run(`
            CREATE TABLE donations_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT, -- Email can now be NULL
                amount REAL NOT NULL,
                message TEXT,
                 status TEXT NOT NULL DEFAULT 'pending',
                campaign_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `, (err) => {
            if (err) {
                console.error('Error creating new donations table:', err);
            } else {
                console.log('New donations table created.');
            }
        });

        // Step 2: Copy data from the old donations table to the new one
        db.run(`
            INSERT INTO donations_new (id, name, phone, email, amount, message, status, campaign_id, created_at)
            SELECT id, name, phone, email, amount, message, status, campaign_id, created_at
            FROM donations;
        `, (err) => {
            if (err) {
                console.error('Error copying data to new donations table:', err);
            } else {
                console.log('Data copied to new donations table.');
            }
        });

        // Step 3: Drop the old donations table
        db.run(`DROP TABLE donations;`, (err) => {
            if (err) {
                console.error('Error dropping old donations table:', err);
            } else {
                console.log('Old donations table dropped.');
            }
        });

        // Step 4: Rename the new donations table to the original name
        db.run(`ALTER TABLE donations_new RENAME TO donations;`, (err) => {
            if (err) {
                console.error('Error renaming new donations table:', err);
            } else {
                console.log('New donations table renamed to donations.');
            }
        });

        // Step 5: Re-enable foreign keys
        db.run(`PRAGMA foreign_keys = ON`, (err) => {
            if (err) {
                console.error('Error enabling foreign keys:', err);
            } else {
                console.log('Foreign keys enabled.');
            }
        });
    });
}

// Call the function to modify the donations table
alterDonationsTable();

// Close the database connection when done
db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err);
    } else {
        console.log('Database connection closed.');
    }
});
