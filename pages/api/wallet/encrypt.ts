import { ENC_SEED } from '@/constants/storage';
import { setCookie } from '@/utils/cookie';
import { decryptData } from '@/utils/cryptography/encodeData';
import { encryptHDWMnemonic } from '@/utils/web3/wallet';
import { CookieSerializeOptions, serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

interface NextRequest extends NextApiRequest {
  body: {
    encryptedPassword: string;
    encryptedSeedPhrase: string;
  };
}

type Data = {
  encryptedWallet: string;
};

interface NextResponse<T> extends NextApiResponse<T> {
  cookie(name: string, value: string, options?: CookieSerializeOptions): void;
}

export default function handler(req: NextRequest, res: NextResponse<Data>) {
  const { encryptedPassword, encryptedSeedPhrase } = req.body;
  const password = decryptData(encryptedPassword);
  const seedPhrase = decryptData(encryptedSeedPhrase);

  const encryptedWallet = encryptHDWMnemonic(password, seedPhrase);

  

  setCookie({
    res,
    name: ENC_SEED,
    value: encryptedSeedPhrase,
    options: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 86400 * 1000), // expires in 24 hours
    },
  });
  res.status(200).json({ encryptedWallet });
}
