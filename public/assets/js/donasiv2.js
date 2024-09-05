document.getElementById('submitDonation').addEventListener('click', function () {
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phoneNumber').value;
    const message = document.getElementById('message').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
  
    // Validate fields
    if (!name || !phone) {
      alert('Nama dan Nomor WhatsApp harus diisi.');
      return;
    }
  
    $('#invoiceModal').one('shown.bs.modal', function () {
      // Retrieve the total amount and campaign title from the invoice modal
      const totalWithCodeText = document.getElementById('totalWithCode').textContent.trim();
      const campaignTitle = document.getElementById('programNameHidden').textContent.trim(); // Program name from invoice
  
      // Clean and parse the amount
      const cleanedText = totalWithCodeText
        .replace('Rp', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();
  
      const amount = parseFloat(cleanedText);
  
      console.log('Parsed Amount:', amount);
      console.log('Campaign Title:', campaignTitle);
  
      if (isNaN(amount) || amount <= 0) {
        alert('Silakan masukkan jumlah donasi yang valid.');
        return;
      }
  
      // Send donation data to the server
      fetch('/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          name: name,
          phone: phone,
          message: message,
          paymentMethod: paymentMethod,
          campaign_title: campaignTitle, // Ensure campaign title is included
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log('Donasi berhasil.');
          } else {
            alert('Terjadi kesalahan: ' + data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Terjadi kesalahan.');
        });
    });
  
    $('#invoiceModal').modal('show');
  });
  