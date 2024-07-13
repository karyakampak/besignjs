
Copy code
# BeSign

BeSign adalah library Node.js yang dirancang untuk memudahkan penambahan tanda tangan digital pada dokumen PDF. Dengan BeSign, Anda dapat menandatangani dokumen PDF secara programatik, memberikan fleksibilitas tinggi untuk aplikasi Anda dalam mengelola dan mengotentikasi dokumen.

## Fitur Utama

- **Tanda Tangan Digital**: Tambahkan tanda tangan digital ke dokumen PDF dengan mudah.
- **Dukungan Berbagai Format**: Mendukung berbagai format tanda tangan dan konfigurasi.
- **Fleksibilitas Penempatan**: Konfigurasi posisi dan ukuran tanda tangan sesuai kebutuhan.
- **Validasi Jangka Panjang (LTV)**: Mendukung tanda tangan dengan validasi jangka panjang.
- **Tanda Tangan Segel (Seal Signature)**: Dukungan untuk tanda tangan segel untuk keamanan tambahan.

## Instalasi

Untuk menginstal BeSign, gunakan npm dengan menjalankan perintah berikut di terminal:

```sh
npm install besign
```
## Penggunaan
Berikut adalah contoh cara menggunakan BeSign dalam proyek Node.js Anda:


```sh

const BeSign = require('besign');

// Membuat instance BeSign dengan konfigurasi yang dibutuhkan
const besign = new BeSign({
  pdf_path: 'path/to/pdf',
  image_path: 'path/to/image',
  output_path: 'path/to/output',
  p12Path: 'path/to/p12',
  nik: 'your-nik',
  passphraseBSrE: 'your-passphrase-bsre',
  passphraseCert: 'your-passphrase-cert',
  page: 1,
  visibility: true,
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  id: 'your-id',
  secret: 'your-secret',
  isLTV: true,
  isSeal: false
});

// Menandatangani dokumen PDF
besign.sign()
  .then(() => {
    console.log('Dokumen berhasil ditandatangani.');
  })
  .catch(error => {
    console.error('Gagal menandatangani dokumen:', error);
  });
```
