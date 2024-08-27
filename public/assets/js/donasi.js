document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript Loaded");

    // Handle form submission and show invoice
    document.getElementById('submitDonation').addEventListener('click', function() {
        const emailInput = document.getElementById("email");
        const email = emailInput.value.trim();

        // Debugging logs
        console.log("Email Input Element:", emailInput);
        console.log("Email Value:", email);
        console.log("Email Length:", email.length);

        const selectedNominal = document.getElementById("customNominal").value.trim();
        const paymentMethod = document.getElementById("paymentMethod").value;
        const fullName = document.getElementById("fullName").value.trim();
        const phoneNumber = document.getElementById("phoneNumber").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validasi semua input wajib diisi
        if (!selectedNominal) {
            alert("Silakan masukkan nominal donasi.");
            return;
        }

        if (!fullName) {
            alert("Silakan masukkan nama lengkap.");
            return;
        }

        if (!phoneNumber) {
            alert("Silakan masukkan nomor WhatsApp.");
            return;
        }

        // Jika semua validasi berhasil, lanjutkan proses
        const uniqueCode = generateUniqueCode();
        const totalAmount = parseInt(selectedNominal) + uniqueCode;

        // Update modal content
        const programNameElement = document.getElementById('programName');
        const totalAmountElement = document.getElementById('totalAmount');
        const donationAmountElement = document.getElementById('donationAmount');
        const uniqueCodeElement = document.getElementById('uniqueCode');
        const totalWithCodeElement = document.getElementById('totalWithCode');
        const bankInfoElement = document.getElementById('bankInfo');

        // Check and update elements if they exist
        if (programNameElement) {
            programNameElement.textContent = document.querySelector('button[data-bs-target="#donasiModal"]').getAttribute('data-campaign');
        }
        if (totalAmountElement) {
            totalAmountElement.textContent = `Rp ${totalAmount}`;
        }
        if (donationAmountElement) {
            donationAmountElement.textContent = `Rp ${selectedNominal}`;
        }
        if (uniqueCodeElement) {
            uniqueCodeElement.textContent = uniqueCode;
        }
        if (totalWithCodeElement) {
            totalWithCodeElement.textContent = `Rp ${totalAmount}`;
        }

        // Determine bank info based on payment method
        let bankInfoHtml = '';
        switch (paymentMethod) {
            case 'BSI':
                bankInfoHtml = `
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg" alt="BSI Logo" class="bank-logo">
                    712.897.5677 a.n. Baitulmaalku (BSI)
                `;
                break;
            case 'CIMB':
                bankInfoHtml = `
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/CIMB_Bank.svg" alt="CIMB Logo" class="bank-logo">
                    7631-0876-8400 a.n. Baitulmaalku (CIMB)
                `;
                break;
            case 'QRIS':
                bankInfoHtml = `
                    <div class="qris-container text-center">
                <img src="../assets/img/qris/qris.PNG" alt="QRIS Logo" class="qris-image" style="margin-left: 60px;>
                <p class="mt-3" style="text-alight:center;"><br></p>
            </div>
                `;
                bankInfoClass = 'qris-center';
                break;
            default:
                bankInfoHtml = 'Metode pembayaran tidak valid.';
                break;
        }

        if (bankInfoElement) {
            bankInfoElement.innerHTML = bankInfoHtml;
        }

        // Close the form modal
        const donasiModal = bootstrap.Modal.getInstance(document.getElementById('donasiModal'));
        if (donasiModal) {
            donasiModal.hide();
        }

        // Show the invoice modal
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
    });

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

    // Refresh the page when closing the invoice modal
    document.getElementById('closeInvoice').addEventListener('click', function() {
        location.reload();
    });
});

// Function to generate a unique code
function generateUniqueCode() {
    return Math.floor(100 + Math.random() * 900); // Generates a 3-digit code
}
