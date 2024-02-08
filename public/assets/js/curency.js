document.addEventListener('DOMContentLoaded', function() {
    const nominalInput = document.getElementById('nominal');
    const warningMessage = document.getElementById('warning');

    nominalInput.addEventListener('input', function() {
        const nominalValue = nominalInput.value;
        if (nominalValue < 10000) {
            warningMessage.style.display = 'block';
            nominalInput.setCustomValidity('Nominal harus lebih besar dari atau sama dengan Rp 10.000.');
        } else {
            warningMessage.style.display = 'none';
            nominalInput.setCustomValidity('');
        }
    });
    document.addEventListener("DOMContentLoaded", function() {
        const nominalInput = document.getElementById("nominal");
    
        // Fungsi untuk menambahkan format "Rp." saat input kehilangan fokus
        nominalInput.addEventListener("blur", function() {
            const value = parseFloat(nominalInput.value.replace(/\D/g, ''));
            nominalInput.value = value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
        });
    
        // Fungsi untuk memastikan bahwa input hanya menerima angka
        nominalInput.addEventListener("input", function() {
            nominalInput.value = nominalInput.value.replace(/\D/g, '');
        });
    });
    
    // Hapus "Rp." sebelum mengirim data ke backend
    const zakatForm = document.querySelector('#zakat-form');
    zakatForm.addEventListener('submit', function(event) {
        const rawNominalValue = nominalInput.value;
        const nominalValue = parseInt(rawNominalValue.replace('Rp. ', '').replace('.', ''));
        nominalInput.value = nominalValue; // Update input value dengan angka saja
    });
});