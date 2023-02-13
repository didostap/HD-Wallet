// @ts-ignore
const NodeRSA = require('node-rsa');

const key = new NodeRSA({ b: 512 });

const privateKey = key.exportKey('pkcs1-private-pem');
const publicKey = key.exportKey('pkcs8-public-pem');
console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
