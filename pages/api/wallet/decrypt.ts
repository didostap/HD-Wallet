import { SEED } from '@/constants/storage';
import { setCookie } from '@/utils/cookie';
import { encryptData } from '@/utils/cryptography/encodeData';
import { decryptHDWMnemonic } from '@/utils/web3/wallet';
import { CookieSerializeOptions } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

interface NextRequest extends NextApiRequest {
  body: {
    password: string;
    encryptedData: string;
  };
}

type Data = {
  message: string;
};

interface NextResponse<T> extends NextApiResponse<T> {
  cookie(name: string, value: string, options?: CookieSerializeOptions): void;
}

export default function handler(req: NextRequest, res: NextResponse<Data>) {
  const { password, encryptedData } = req.body;
  const { encryptedSeedPhrase, iv, salt, iterations } = JSON.parse(encryptedData);
  const decryptedSeed = decryptHDWMnemonic(encryptedSeedPhrase, iv, salt, iterations, password);
  const cookieSeed = encryptData(decryptedSeed);

  setCookie({
    res,
    name: SEED,
    value: cookieSeed,
    options: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 86400 * 1000), // expires in 24 hours
    },
  });

  res.status(200).json({ message: 'success' });
}
