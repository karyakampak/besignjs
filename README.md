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

const pdf_path = 'path/to/pdf;
const image_path = 'path/to/image;
const output_path = 'path/to/output';
const p12Path = 'path/to/p12/certificate';
const tokenApi = 'your-token-api';
const cmsApi = 'yout-cms-api';
const nik = 'your-nik';
const passphraseBSrE = 'your-BSrE-passphrase';
const passphraseCert = 'your-p12-passphrase';
const page = 1;
const visibility = 1;
const x = 100;
const y = 100;
const width = 128;
const height = 45.374;
const id = 'your-id';
const secret = 'your-secret';
const isLTV = 0;
const isSeal = 0;

// Tandatangan dengan hit API diluar shared library
const besignDetached = new BeSign({pdf_path: pdf_path, output_path: output_path, nik: nik, passphraseBSrE: passphraseBSrE, id: id, secret: secret, tokenApi: tokenApi, cmsApi: cmsApi});
besignDetached.detachedSign();

// Tandatangan dengan hit API dalam shared library
const besignSign = new BeSign({pdf_path: pdf_path, output_path: output_path, nik: nik, passphraseBSrE: passphraseBSrE, id: id, secret: secret});
besignSign.sign();

// Tandatangan dengan sertifikat P12
const besignWithCertificate = new BeSign({pdf_path: pdf_path, output_path: output_path, p12Path: p12Path, passphraseCert: passphraseCert});
besignWithCertificate.signWithCertificate();
```
