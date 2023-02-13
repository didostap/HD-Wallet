import { genBtcFromHDW } from '@/utils/web3/genBtcFromHDW';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import hdkey from 'hdkey';
import crypto from 'crypto';

export const genHDWMnemonic = () => generateMnemonic(256);

export const encryptHDWMnemonic = (password: string, seedPhrase: string) => {
  const keyLength = 32;
  const digest = 'sha256';
  const iterations = 100000;
  const salt = crypto.randomBytes(16);

  const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);

  const iv = crypto.randomBytes(16);
  // Create a new cipher object
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  // Encrypt the seed phrase
  let encryptedSeedPhrase = cipher.update(seedPhrase, 'utf8', 'hex');
  encryptedSeedPhrase += cipher.final('hex');

  console.log(`Encrypted seed phrase: ${encryptedSeedPhrase}`);
  console.log(`IV: ${iv.toString('hex')}`);

  const result = { encryptedSeedPhrase, iv: iv.toString('hex'), salt: salt.toString('hex'), iterations };
  return JSON.stringify(result);
  // dencryptHDWMnemonic(encryptedSeedPhrase, iv.toString('hex'), salt.toString('hex'), iterations, password);

  // console.log(encryptedSeedPhrase, iv.toString('hex'), salt.toString('hex'), iterations);
  // return { encryptedSeedPhrase, iv: iv.toString('hex'), salt: salt.toString('hex'), iterations };
};

export const decryptHDWMnemonic = (
  encryptedSeedPhrase: string,
  _iv: string,
  _salt: string,
  iterations: number,
  password: string
) => {
  const keyLength = 32;
  const digest = 'sha256';
  const iv = Buffer.from(_iv, 'hex');
  const salt = Buffer.from(_salt, 'hex');

  // Create a key from the password
  const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
  // const key = crypto.createHash(digest).update(password).digest();

  // Create a new decipher object
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  // Decrypt the seed phrase
  let decryptedSeedPhrase = decipher.update(encryptedSeedPhrase, 'hex', 'utf8');
  decryptedSeedPhrase += decipher.final('utf8');

  return decryptedSeedPhrase;
};

export const genHDWallet = async () => {
  const mnemonic = generateMnemonic(256);
  const seedBuffer = await mnemonicToSeed(mnemonic);

  const masterKey = hdkey.fromMasterSeed(seedBuffer);
  console.log('masterKey', masterKey);
  console.log(genBtcFromHDW(masterKey));
};
