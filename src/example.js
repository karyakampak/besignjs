const BeSign = require('./BeSign'); // Assuming BeSign class is exported from class.js

const pdf_path = __dirname+'/input/example.pdf';
const image_path = __dirname+'/input/visualku.png';
const output_path = __dirname+'/output/output.pdf';
const p12Path = __dirname+'/input/usertesting.p12';
const tokenApi = "";
const cmsApi = "";
const nik = "";
const passphraseBSrE = "";
const passphraseCert = "123456";
const page = 1;
const visibility = 1;
const x = 100;
const y = 100;
const width = 128;
const height = 45.374;
const id = '';
const secret = '';
const isLTV = 0;
const isSeal = 0;

// Tandatangan dengan hit API diluar shared library
// const besignDetached = new BeSign({pdf_path: pdf_path, output_path: output_path, nik: nik, passphraseBSrE: passphraseBSrE, id: id, secret: secret, tokenApi: tokenApi, cmsApi: cmsApi});
// besignDetached.detachedSign();

// Tandatangan dengan hit API dalam shared library
// const besignSign = new BeSign({pdf_path: pdf_path, output_path: output_path, nik: nik, passphraseBSrE: passphraseBSrE, id: id, secret: secret});
// besignSign.sign();

// Tandatangan dengan sertifikat P12
const besignWithCertificate = new BeSign({pdf_path: pdf_path, output_path: output_path, p12Path: p12Path, passphraseCert: passphraseCert});
besignWithCertificate.signWithCertificate();
