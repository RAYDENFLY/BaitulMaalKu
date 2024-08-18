// Function to generate a random unique code
function generateUniqueCode() {
    return Math.floor(Math.random() * 900) + 1; // Generates a number between 1 and 900
}

// Handle form submission and show invoice
document.getElementById('submitDonation').onclick = function() {
    const selectedNominal = document.getElementById("customNominal").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!selectedNominal) {
        alert("Silakan masukkan nominal donasi.");
        return;
    }

    // Generate unique code and total amount
    const uniqueCode = generateUniqueCode();
    const totalAmount = parseInt(selectedNominal) + uniqueCode;

    // Update modal content
    document.getElementById('programName').textContent = document.querySelector('button[data-target="#donasiModal"]').getAttribute('data-campaign');
    document.getElementById('totalAmount').textContent = `Rp ${totalAmount}`;
    document.getElementById('donationAmount').textContent = selectedNominal;
    document.getElementById('uniqueCode').textContent = uniqueCode;
    document.getElementById('totalWithCode').textContent = `Rp ${totalAmount}`;

    // Determine bank info based on payment method
    let bankInfoHtml = '';
    switch (paymentMethod) {
        case 'BSI':
            bankInfoHtml = `
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg" alt="BSI Logo" class="bank-logo">
                Zakat: 712-8975-675 a.n. Baitulmaalku (BSI)
            `;
            break;
        case 'CIMB':
            bankInfoHtml = `
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/CIMB_Bank.svg" alt="CIMB Logo" class="bank-logo">
                Zakat: 7631-0876-8400 a.n. Baitulmaalku (CIMB)
            `;
            break;
        case 'QRIS':
            bankInfoHtml = `
                <img src="path/to/qris.png" alt="QRIS Logo" class="bank-logo">
                QRIS (QRCode)
            `;
            break;
        default:
            bankInfoHtml = 'Metode pembayaran tidak valid.';
            break;
    }

    document.getElementById('bankInfo').innerHTML = bankInfoHtml;

    // Close the form modal
    $('#donasiModal').modal('hide');

    // Show the invoice modal
    $('#invoiceModal').modal('show');
}

// Update custom nominal field based on selected button
document.querySelectorAll('.nominal-option').forEach(button => {
    button.addEventListener('click', function() {
        // Get the value from the button's data attribute
        const value = this.getAttribute('data-value');
        // Set the value to the customNominal input field
        document.getElementById('customNominal').value = value;

        // Optionally, you can add or remove an active class to highlight the selected button
        document.querySelectorAll('.nominal-option').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// Update modal title based on campaign
$('#donasiModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var campaign = button.data('campaign'); // Extract campaign name from data-campaign attribute

    var modal = $(this);
    modal.find('.modal-title').text('Donasi ' + campaign);
});
