

function changeZakatCategory() {
    var category = document.getElementById('category').value;

    // Sembunyikan semua opsi terkait Jumlah (IDR) terlebih dahulu
    var elements = ['amount', 'income-options', 'savings-options', 'trade-options', 'gold-options', 'pertanian-options'];
    elements.forEach(function(id) {
        var element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Tampilkan opsi sesuai dengan kategori yang dipilih
    switch (category) {
        case 'income':
            showElement('amount');
            showElement('income-options');
            break;
        case 'savings':
            showElement('amount');
            showElement('savings-options');
            break;
        case 'trade':
            showElement('amount');
            showElement('trade-options');
            break;
        case 'gold':
            showElement('gold-options');
            break;
        case 'pertanian':
            showElement('pertanian-options');
            break;
        default:
            showElement('amount');
            break;
    }
}

function showElement(id) {
    var element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}


  function calculateZakat() {
    var category = document.getElementById("category").value;
    var resultElement = document.getElementById("result");
    
    // Reset hasil perhitungan
    resultElement.innerHTML = "";

    // Implementasikan logika perhitungan zakat sesuai dengan jenis zakat yang dipilih
    if (category === "income") {
      calculateIncomeZakat();
    } else if (category === "savings") {
      calculateSavingsZakat();
    } else if (category === "trade") {
      calculateTradeZakat();
    } else if (category === "pertanian") {
      calculateAgricultureZakat();
    } else if (category === "gold") {
      calculateGoldZakat();
    }
  }

  function calculateIncomeZakat() {
    var incomeAmount = parseFloat(document.getElementById("income-amount").value);
    var incomeType = document.getElementById("income-type").value;
    var noteElement = document.getElementById("note-income");

    // Logika perhitungan zakat penghasilan
    var nisab = 520 * 3.75; // Nisab per gram emas (contoh: 520 gram emas)
    var goldPricePerGram = 800000; // Harga emas per gram (contoh)
    var goldValue = nisab * goldPricePerGram;

    var zakatAmount = (2.5 / 100) * incomeAmount;
    if (incomeType === "yearly" && goldValue < nisab) {
      zakatAmount = 0;
    }

    // Tampilkan hasil perhitungan dan note
    displayResultAndNote(zakatAmount, noteElement);
  }

  function calculateSavingsZakat() {
    var savingsAmount = parseFloat(document.getElementById("savings-amount").value);
    var interest = parseFloat(document.getElementById("interest").value);
    var noteElement = document.getElementById("note-savings");

    // Logika perhitungan zakat tabungan
    var zakatAmount = (2.5 / 100) * savingsAmount;

    // Tampilkan hasil perhitungan dan note
    displayResultAndNote(zakatAmount, noteElement);
  }

  function calculateTradeZakat() {
    // Implementasikan logika perhitungan zakat perdagangan di sini
    // Sesuaikan dengan aturan zakat perdagangan yang Anda ikuti
    // ...

    // Contoh logika sederhana (ubah sesuai kebutuhan):
    var tradeAmount = parseFloat(document.getElementById("trade-amount").value);
    var zakatAmount = (2.5 / 100) * tradeAmount;

    var noteElement = document.getElementById("note-trade");
    // Tampilkan hasil perhitungan dan note
    displayResultAndNote(zakatAmount, noteElement);
}

// Fungsi perhitungan zakat pertanian
function calculateAgricultureZakat() {
    var agricultureAmountElement = document.getElementById("hasil-amount");
    var hasilPertanianElement = document.getElementById("hasil-pertanian");
    var noteElement = document.getElementById("note-pertanian");

    if (agricultureAmountElement && hasilPertanianElement) {
        var agricultureAmount = parseFloat(agricultureAmountElement.value);
        var jenisHasil = hasilPertanianElement.value;
        var hasilAmount = parseFloat(agricultureAmountElement.value); // Fix here

        // Add this line to get the hutang element
        var hutangElement = document.getElementById("hutang");
        var hutang = parseFloat(hutangElement.value) || 0;

        // Rest of your code remains the same
        var nisab = 653;
        var kadarTadahHujan = 0.1;
        var kadarIrigasi = 0.05;
        var zakatAmount;

        if (agricultureAmount >= nisab) {
            zakatAmount = hasilAmount * (jenisHasil === 'padi' ? kadarTadahHujan : kadarIrigasi) - hutang;
            zakatAmount = Math.max(0, zakatAmount);
        } else {
            zakatAmount = 0;
        }

        // Tampilkan hasil perhitungan dan note
        displayResultAndNote(zakatAmount, noteElement);
    }
}

function getGoldPrice() {
  var apiUrl = "https://logam-mulia-api.vercel.app/prices/hargaemas-org";

  return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          // Cek apakah data tidak undefined dan array data tidak kosong
          if (data && Array.isArray(data.data) && data.data.length > 0) {
              // Ambil harga emas dari elemen pertama array (di sini, asumsi hanya ada satu data)
              var goldPrice = data.data[0].buy; // Ubah sesuai dengan properti yang menyimpan harga emas
              return goldPrice;
          } else {
              console.error("Data harga emas tidak ditemukan atau tidak sesuai format yang diharapkan");
              return null;
          }
      })
      .catch(error => {
          console.error("Error fetching gold price data:", error);
          return null;
      });
}

function calculateGoldZakat() {
  // Panggil fungsi untuk mengambil harga emas
  getGoldPrice()
      .then(goldPrice => {
          if (goldPrice !== null) {
              var goldAmount = parseFloat(document.getElementById("gold-amount").value);
              var noteElement = document.getElementById("note-gold");

              // Logika perhitungan zakat emas
              var zakatAmount = (2.5 / 100) * goldAmount * goldPrice;

              // Tampilkan hasil perhitungan dan note
              displayResultAndNote(zakatAmount, noteElement);

              // Tampilkan catatan dengan harga emas hari ini
              var formattedGoldPrice = goldPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
              var noteText = "Harga emas hari ini: " + formattedGoldPrice;
              displayNote(noteText, noteElement);
          }
      });
}

function displayNote(noteText, noteElement) {
  // Tampilkan catatan
  if (noteElement) {
      noteElement.innerHTML = noteText;
  }
}



  function displayResultAndNote(zakatAmount, noteElement) {
    // Tampilkan hasil perhitungan
     // Tampilkan hasil perhitungan
     var resultElement = document.getElementById("result");
    
     // Format hasil perhitungan ke dalam format Rupiah
     var formattedAmount = zakatAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
     
     resultElement.innerHTML = "<strong>Jumlah Zakat:</strong> " + formattedAmount;
 }

window.onload = function () {
    changeZakatCategory();
  };
