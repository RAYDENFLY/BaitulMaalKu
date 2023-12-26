

function changeZakatCategory() {
    var category = document.getElementById('category').value;

    // Sembunyikan semua opsi terkait Jumlah (IDR) terlebih dahulu
    document.getElementById('amount').style.display = 'none';
    document.getElementById('income-options').style.display = 'none';
    document.getElementById('savings-options').style.display = 'none';
    document.getElementById('trade-options').style.display = 'none';
    document.getElementById('gold-options').style.display = 'none';

    // Tampilkan opsi sesuai dengan kategori yang dipilih
    switch (category) {
        case 'income':
            document.getElementById('amount').style.display = 'block';
            document.getElementById('income-options').style.display = 'block';
            break;
        case 'savings':
            document.getElementById('amount').style.display = 'block';
            document.getElementById('savings-options').style.display = 'block';
            break;
        case 'trade':
            document.getElementById('amount').style.display = 'block';
            document.getElementById('trade-options').style.display = 'block';
            break;
        case 'gold':
            document.getElementById('gold-options').style.display = 'block';
            break;
        default:
            document.getElementById('amount').style.display = 'block';
            break;
    }
}

function calculateZakat() {
    var category = document.getElementById('category').value;
    var amount = parseFloat(document.getElementById('amount').value);

    // Variabel tambahan sesuai dengan kategori
    var otherIncome = parseFloat(document.getElementById('other-income').value) || 0;
    var expenses = parseFloat(document.getElementById('expenses').value) || 0;
    var interest = parseFloat(document.getElementById('interest').value) || 0;
    var capital = parseFloat(document.getElementById('capital').value) || 0;
    var profit = parseFloat(document.getElementById('profit').value) || 0;
    var tradeDebt = parseFloat(document.getElementById('trade-debt').value) || 0;
    var dueDebt = parseFloat(document.getElementById('due-debt').value) || 0;
    var loss = parseFloat(document.getElementById('loss').value) || 0;
    var goldAmount = parseFloat(document.getElementById('gold-amount').value) || 0;
    
    // Inisialisasi zakatAmount di luar switch statement
    var zakatAmount = 0;

    // Lakukan perhitungan sesuai dengan kategori yang dipilih
    switch (category) {
        case 'income':
            var incomeType = document.getElementById('income-type').value;
    
            // Logika perhitungan untuk Zakat Penghasilan
            // Sesuaikan logika perhitungan berdasarkan aturan zakat yang berlaku
            // Contoh: zakatAmount = amount * 0.025;
            zakatAmount = amount * 0.025;
            break;
        case 'savings':
            // Logika perhitungan untuk Zakat Tabungan
            // Sesuaikan logika perhitungan berdasarkan aturan zakat yang berlaku
            // Contoh: zakatAmount = (amount + interest) * 0.025;
            zakatAmount = (amount + interest) * 0.025;
            break;
        case 'trade':
            // Logika perhitungan untuk Zakat Perdagangan
            // Sesuaikan logika perhitungan berdasarkan aturan zakat yang berlaku
            // Contoh: zakatAmount = (profit - loss) * 0.025;
            zakatAmount = (profit - loss) * 0.025;
            break;
        case 'gold':
            // Logika perhitungan untuk Zakat Emas
            // Sesuaikan logika perhitungan berdasarkan aturan zakat yang berlaku
            // Contoh: zakatAmount = goldAmount * 0.025;
            var goldAmount = 1017693
            zakatAmount = goldAmount * 0.025;
            break;
        default:
            // Logika default atau kesalahan
            break;
    }

    // Tampilkan hasil atau lakukan sesuatu sesuai kebutuhan
    console.log('Zakat Amount:', zakatAmount);
    document.getElementById('result').innerHTML = 'Hasil Perhitungan Zakat: ' + zakatAmount + ' IDR';
}
