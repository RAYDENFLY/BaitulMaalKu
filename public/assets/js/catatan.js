var modal = document.getElementById("catatanModal");

// Ambil tombol yang membuka modal
var btn = document.getElementById("catatanButton");

// Ambil elemen span yang menutup modal
var span = document.getElementsByClassName("close")[0];

// Ketika pengguna mengklik tombol, buka modal
btn.onclick = function() {
  modal.style.display = "block";
}

// Ketika pengguna mengklik (x), tutup modal
span.onclick = function() {
  modal.style.display = "none";
}

// Ketika pengguna mengklik di luar modal, tutup modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Ambil formulir kalkulator zakat
var form = document.getElementById("zakatCalculator");

// Ketika formulir disubmit, hitung zakat sesuai dengan jenisnya
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Hindari pengiriman formulir

  var zakatType = document.getElementById("zakatType").value;
  var nominal = parseInt(document.getElementById("nominal").value);
  var additionalInfo = document.getElementById("additionalInfo").value;

  var zakat;
  switch (zakatType) {
    case "maal":
      // Hitung zakat maal (2.5% dari total kekayaan setelah mencapai nisab)
      zakat = (2.5 / 100) * nominal;
      break;
    case "fitrah":
      // Hitung zakat fitrah sesuai dengan ketentuan di daerah Anda
      // Misalnya, zakat fitrah ditentukan berdasarkan harga beras
      // Anda dapat menambahkan logika perhitungan di sini
      zakat = calculateFitrah(nominal);
      break;
    case "penghasilan":
      // Hitung zakat penghasilan (2.5% dari total penghasilan selama satu tahun)
      zakat = (2.5 / 100) * nominal;
      break;
    case "emas-perak":
      // Hitung zakat emas dan perak (2.5% dari total kepemilikan emas dan perak selama satu tahun)
      zakat = (2.5 / 100) * nominal;
      break;
    case "perniagaan":
      // Hitung zakat perniagaan (2.5% dari total pendapatan atau keuntungan usaha perdagangan selama satu tahun)
      zakat = (2.5 / 100) * nominal;
      break;
    case "pendidikan":
      // Hitung zakat pendidikan berdasarkan program-program yang didukung
      // Anda dapat menambahkan logika perhitungan di sini
      zakat = calculateEducationZakat(nominal);
      break;
    case "kesehatan":
      // Hitung zakat kesehatan berdasarkan program-program yang didukung
      // Anda dapat menambahkan logika perhitungan di sini
      zakat = calculateHealthZakat(nominal);
      break;
    case "sosial":
      // Hitung zakat sosial berdasarkan program-program yang didukung
      // Anda dapat menambahkan logika perhitungan di sini
      zakat = calculateSocialZakat(nominal);
      break;
    default:
      zakat = 0; // Default jika tidak ada jenis zakat yang dipilih
  }

  // Tampilkan hasil di dalam div "result"
  document.getElementById("result").innerHTML = "Jumlah Zakat yang Harus Dibayar: Rp " + zakat;
});

// Fungsi untuk menghitung zakat fitrah
function calculateFitrah(nominal) {
  // Misalnya, hitung berdasarkan harga beras
  // Anda dapat menambahkan logika perhitungan sesuai dengan ketentuan di daerah Anda
  var hargaBeras = 10000; // Contoh harga beras per kilogram
  var jumlahBeras = nominal / hargaBeras; // Hitung jumlah beras yang harus dibayar
  return jumlahBeras; // Return jumlah zakat fitrah
}

// Fungsi-fungsi untuk menghitung zakat pendidikan, kesehatan, dan sosial
// Anda dapat menambahkan logika perhitungan sesuai dengan program-program yang didukung di sini
function calculateEducationZakat(nominal) {
  // Contoh perhitungan zakat pendidikan
  return (5 / 100) * nominal; // Misalnya, 5% dari nominal
}

function calculateHealthZakat(nominal) {
  // Contoh perhitungan zakat kesehatan
  return (3 / 100) * nominal; // Misalnya, 3% dari nominal
}

function calculateSocialZakat(nominal) {
  // Contoh perhitungan zakat sosial
  return (2 / 100) * nominal; // Misalnya, 2% dari nominal
}
