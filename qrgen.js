const QRCode = require('qrcode');
const Jimp = require('jimp');

// URL yang ingin diubah menjadi QR Code
const url = 'https://baitulmaalku.com/go';

// Fungsi untuk membuat QR Code
QRCode.toFile('baitulmaalku_qr_code.png', url, {
  color: {
    dark: '#2198B8',  // Warna kustom untuk QR Code
    light: '#0000'    // Transparan untuk latar belakang
  }
}, function (err) {
  if (err) throw err;

  // Baca gambar QR Code yang baru saja dibuat
  Jimp.read('baitulmaalku_qr_code.png', (err, qrImage) => {
    if (err) throw err;

    // Pastikan warna QR Code cukup kontras dengan latar belakang
    qrImage.scan(0, 0, qrImage.bitmap.width, qrImage.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // Jika pixelnya putih, ubah menjadi transparan
      if (red === 255 && green === 255 && blue === 255) {
        this.bitmap.data[idx + 3] = 0; // Ubah alpha menjadi 0 (transparan)
      }
    });

    // Simpan gambar dengan latar belakang transparan
    qrImage.write('baitulmaalku_qr_code_transparent.png', (err) => {
      if (err) throw err;
      console.log('QR Code berhasil dibuat dan disimpan sebagai baitulmaalku_qr_code_transparent.png');
    });
  });
});
