import hdkey from 'hdkey';
// import createHash from 'create-hash';
import bs58check from 'bs58check';
import { createHash } from 'crypto';

export const genBtcFromHDW = (masterKey: hdkey) => {
  const btcChildKey = masterKey.derive("m/44'/0'/0'/0/0");
  const btcPublicKey = btcChildKey.publicKey;
  const btcPrivateKey = btcChildKey.privateKey;

  const btcHash = createHash('sha256').update(btcPublicKey).digest();
  const btcRipemd = createHash('rmd160').update(btcHash).digest();

  const btcVersion = Buffer.allocUnsafe(21);
  btcVersion.writeUint8(0x00, 0);

  btcRipemd.copy(btcVersion, 1);

  const address = bs58check.encode(btcVersion);

  return {
    address,
    publicKey: btcPublicKey.toString('hex'),
    privateKey: btcPrivateKey.toString('hex'),
  };
};
