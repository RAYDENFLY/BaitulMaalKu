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

// Function to update donations with the correct campaign_id
const updateDonationsWithCampaignId = () => {
  db.serialize(() => {
    // Update donations with the correct campaign_id where it is currently null
    db.run(`
      UPDATE donations
      SET campaign_id = (SELECT id FROM campaigns WHERE title = 'Bantu Kuatkan Palestina')
      WHERE campaign_id IS NULL
    `, function(err) {
      if (err) {
        console.error('Error updating donations:', err);
        return;
      }

      console.log('Donations updated with campaign_id where it was null.');
    });
  });
};

// Call the function to update donations
updateDonationsWithCampaignId();

// Close the database connection when done
db.close((err) => {
  handleError(err, 'Closing database connection');
});
