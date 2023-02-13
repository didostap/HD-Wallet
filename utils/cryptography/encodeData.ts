import NodeRSA from 'node-rsa';

const cookiePublicKey = process.env.NEXT_PUBLIC_COOKIE_PUBLIC_KEY || '';
const cookiePrivateKey = process.env.COOKIE_PRIVATE_KEY || '';

export const encryptData = (data: string) => {
  const clientPublicKey = new NodeRSA(cookiePublicKey, 'pkcs8-public-pem');
  const encryptedData = clientPublicKey.encrypt(data, 'base64');
  return encryptedData;
};

export const decryptData = (data: string) => {
  const serverPrivateKey = new NodeRSA(cookiePrivateKey, 'pkcs1-private-pem');
  const decryptedData = serverPrivateKey.decrypt(data, 'utf8');
  return decryptedData;
};
