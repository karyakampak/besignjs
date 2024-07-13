const ffi = require('ffi-napi');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const os = require('os');
// Define the BeSign class

class BeSign {
    // Constructor
    constructor({pdf_path, image_path = "", output_path, p12Path = "", tokenApi = "", cmsApi = "", nik = "", passphraseBSrE = "", passphraseCert = "", page = 1, visibility = 0, x = 0.0, y = 0.0, width = 0.0, height = 0.0, id = "", secret = "", isLTV = 0, isSeal = 0} = {}) {
        this.pdf_path = pdf_path;
        this.image_path = image_path;
        this.output_path = output_path;
        this.p12Path = p12Path;
        this.tokenApi = tokenApi;
        this.cmsApi = cmsApi;
        this.nik = nik;
        this.passphraseBSrE = passphraseBSrE;
        this.passphraseCert = passphraseCert;
        this.page = page;
        this.visibility = visibility;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.secret = secret;
        this.isLTV = isLTV;
        this.isSeal = isSeal;
    }

    // Method to get access token
    async getToken(id, secret) {
        const url = this.tokenApi;
        const auth = id + ":" + secret;
        const bodyData = JSON.stringify({
            grant_type: "client_credentials"
        });

        try {
            const response = await axios.post(url, bodyData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(auth).toString('base64')
                }
            });

            if (response.status !== 200) {
                throw new Error('Failed to fetch access token: ' + response.status);
            }

            const json = response.data;
            if (json.access_token) {
                return json.access_token;
            } else {
                throw new Error('Access token not found in response');
            }
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    }

    // Method to get signature
    async getSignature(bsHash, token) {
        const url = this.cmsApi;

        const jsonData = {
            nik: this.nik,
            idSubscriber: null,
            passphrase: this.passphraseBSrE,
            signaturePropertiesHashMap: {
                0: {
                    imageBase64: null,
                    tampilan: "INVISIBLE",
                    fieldId: null,
                    page: 0,
                    originX: 0.0,
                    originY: 0.0,
                    width: 0.0,
                    height: 0.0,
                    signatureLevel: "PAdES_BASELINE_LT",
                    certificationPermission: "CHANGES_PERMITTED",
                    signingDate: "2022-06-24T12:12:23.649+0000",
                    certificateChainBase64: null,
                    location: null,
                    reason: null,
                    contactInfo: null,
                    documentDigestBase64: bsHash
                }
            }
        };

        try {
            const response = await axios.post(url, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            // Check if responseData is false or undefined
            if (!response) {
                const signature = "Failed to perform request";
                console.error("Error: Failed to perform request");
                return await getSignature(bsHash, nik, passphrase, id, secret, token);
            } else {
                try {

                    const responseData = response.data;
                    const cmsSignedDataHashMap = responseData.data.cmsSignedDataHashMap;
                    if (cmsSignedDataHashMap && cmsSignedDataHashMap[0]) {
                        // Get data with key '0'
                        const signature = cmsSignedDataHashMap['0'];
                        return signature;
                    } else {
                        // Handle case where "signature" is null or not present
                        const signature = "Error: Signature data missing or null";
                        console.error("Error: Signature data missing or null");
                        const new_token = await getToken(id, secret);
                        const file_path = path.join(__dirname, '/token.json');
                        const data = {
                            token: new_token,
                            timestamp: Date.now(), // Optionally add more data
                        };
                        const json_data = JSON.stringify(data, null, 2);
                        fs.writeFile(filePath, json_data);
                        return await getSignature(bsHash, nik, passphrase, id, secret, new_token);
                    }

                } catch (e) {
                    const signature = "Error parsing JSON";
                    console.error("Error parsing JSON: ", e.message);
                    return "";
                }
            }
        } catch (error) {
            console.error('Error fetching signature:', error);
            throw error;
        }
    }

    // Method to perform signing process
    async detachedSign() {
        // Define the function signatures for the native library
        const libraryDefinition = {
            placeHolder: ['string', ['string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'int']],
            free_string: ['void', ['string']],
            place: ['string', ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string']],
            signWithP12: ['void', ['string', 'string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'string', 'string', 'int']],
            signBSrE: ['void', ['string', 'string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'string', 'string', 'string', 'string', 'int', 'int']]
        };

        let libPath;
        const platform = os.platform();
        
        if (platform === 'linux') {
            libPath = path.join(__dirname, 'lib', 'libdksign.so');
        } else if (platform === 'darwin') {
            libPath = path.join(__dirname, 'lib', 'libdksign.dylib');
        } else {
            console.error('Operating system not recognized');
            process.exit(1);
        }
        
        const sign = ffi.Library(libPath, libraryDefinition);

        const pdf_path = this.pdf_path;
        const image_path = this.image_path;
        const output_path = this.output_path;
        const p12Path = this.p12Path;
        const nik = this.nik;
        const passphraseBSrE = this.passphraseBSrE;
        const passphraseCert = this.passphraseCert;
        const page = this.page;
        const visibility = this.visibility;
        const x = this.x;
        const y = this.y;
        const width = this.width;
        const height = this.height;
        const id = this.id;
        const secret = this.secret;
        const isLTV = this.isLTV;
        const isSeal = this.isSeal;

        // Call the sign function
        var result = sign.placeHolder(
            pdf_path,
            image_path,
            page,
            visibility,
            x,
            y,
            width,
            height,
            isSeal
        );

        const data = JSON.parse(result);
        const hash = data.hash;
        const catalog = data.catalog;
        const pdfs_hex = data.pdfs;
        const byterange0 = data.byterange0;
        const byterange1 = data.byterange1;
        const byterange2 = data.byterange2;
        const byterange3 = data.byterange3;
        const pdfs = Buffer.from(pdfs_hex, 'hex');
        
        const file_path = path.join(__dirname, '/token.json');

        var signature;

        if (fs.existsSync(file_path)) {
            const json_data = fs.readFileSync(file_path, 'utf8');
            let data;
            try {
                data = JSON.parse(json_data);
            } catch (error) {
                data = null;
            }
        
            if (data !== null) {
                const token = data.token;
                // console.log("File valid ", token);
                signature = await this.getSignature(hash, token);
            } else {
                const token = await this.getToken(id, secret);
                // console.log("File null ", token);
                signature = await this.getSignature(hash, token);
                const new_data = {
                    token: token,
                    timestamp: Date.now(), // Optionally add more data
                };
                fs.writeFileSync(file_path, JSON.stringify(new_data, null, 2));
            }
        } else {
            const token = await this.getToken(id, secret);
            // console.log("Generate baru ", token);
            signature = await this.getSignature(hash, token);
            const new_data = {
                token: token,
                timestamp: Date.now(), // Optionally add more data
            };
            fs.writeFileSync(file_path, JSON.stringify(new_data, null, 2));
        }
        
        sign.place(pdfs_hex, signature, catalog, byterange0, byterange1, byterange2, byterange3, output_path);
    }

    // Method for embedded signing (if needed)
    async sign() {
        // Define the function signatures for the native library
        const libraryDefinition = {
            placeHolder: ['string', ['string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'int']],
            free_string: ['void', ['string']],
            place: ['string', ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string']],
            signWithP12: ['void', ['string', 'string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'string', 'string', 'int']],
            signBSrE: ['void', ['string', 'string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'string', 'string', 'string', 'string', 'int', 'int']]
        };

        let libPath;
        const platform = os.platform();
        
        if (platform === 'linux') {
            libPath = path.join(__dirname, 'lib', 'libdksign.so');
        } else if (platform === 'darwin') {
            libPath = path.join(__dirname, 'lib', 'libdksign.dylib');
        } else {
            console.error('Operating system not recognized');
            process.exit(1);
        }
        
        const sign = ffi.Library(libPath, libraryDefinition);

        const pdf_path = this.pdf_path;
        const image_path = this.image_path;
        const output_path = this.output_path;
        const p12Path = this.p12Path;
        const nik = this.nik;
        const passphraseBSrE = this.passphraseBSrE;
        const passphraseCert = this.passphraseCert;
        const page = this.page;
        const visibility = this.visibility;
        const x = this.x;
        const y = this.y;
        const width = this.width;
        const height = this.height;
        const id = this.id;
        const secret = this.secret;
        const isLTV = this.isLTV;
        const isSeal = this.isSeal;

        // Call the sign function
        sign.signBSrE(
            pdf_path,
            image_path,
            output_path,
            page,
            visibility,
            x,
            y,
            width,
            height,
            nik,
            passphraseBSrE,
            id,
            secret,
            isLTV,
            isSeal
        );
    }

    // Method for embedded signing (if needed)
    async signWithCertificate() {
        // Define the function signatures for the native library
        const libraryDefinition = {
            placeHolder: ['string', ['string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'int']],
            free_string: ['void', ['string']],
            place: ['string', ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string']],
            signWithP12: ['void', ['string', 'string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'string', 'string', 'int']],
            signBSrE: ['void', ['string', 'string', 'string', 'int', 'int', 'float', 'float', 'float', 'float', 'string', 'string', 'string', 'string', 'int', 'int']]
        };

        let libPath;
        const platform = os.platform();
        
        if (platform === 'linux') {
            libPath = path.join(__dirname, 'lib', 'libdksign.so');
        } else if (platform === 'darwin') {
            libPath = path.join(__dirname, 'lib', 'libdksign.dylib');
        } else {
            console.error('Operating system not recognized');
            process.exit(1);
        }
        
        const sign = ffi.Library(libPath, libraryDefinition);

        const pdf_path = this.pdf_path;
        const image_path = this.image_path;
        const output_path = this.output_path;
        const p12Path = this.p12Path;
        const nik = this.nik;
        const passphraseBSrE = this.passphraseBSrE;
        const passphraseCert = this.passphraseCert;
        const page = this.page;
        const visibility = this.visibility;
        const x = this.x;
        const y = this.y;
        const width = this.width;
        const height = this.height;
        const id = this.id;
        const secret = this.secret;
        const isLTV = this.isLTV;
        const isSeal = this.isSeal;

        // Call the sign function
        sign.signWithP12(
            pdf_path,
            image_path,
            output_path,
            page,
            visibility,
            x,
            y,
            width,
            height,
            p12Path,
            passphraseCert,
            isSeal
        );
    }
}

module.exports = BeSign;