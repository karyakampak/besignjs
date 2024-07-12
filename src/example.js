const BeSign = require('./BeSign'); // Assuming BeSign class is exported from class.js

const pdf_path = __dirname+'/input/example.pdf';
const image_path = __dirname+'/input/visualku.png';
const output_path = __dirname+'/output/output.pdf';
const p12Path = __dirname+'/input/usertesting.p12';
const nik = "6372032607970001";
const passphraseBSrE = "333GokuBuild!";
const passphraseCert = "123456";
const page = 1;
const visibility = 1;
const x = 100;
const y = 100;
const width = 128;
const height = 45.374;
const id = 'L3IqxuKvTRHKUvHim2YPXBEj7U0a';
const secret = 'oAH8f9DGsWd4XJLZZiKGhlaRk2ca';
const isLTV = 0;
const isSeal = 0;

// Assuming BeSign class is defined in class.js
const besign = new BeSign({pdf_path: pdf_path, output_path: output_path, nik: nik, passphraseBSrE: passphraseBSrE, id: id, secret: secret});

// Assuming embededSign method is defined in BeSign class
// besign.detachedSign();
besign.sign();
// besign.signWithCertificate();
