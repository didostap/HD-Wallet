import { CookieSerializeOptions, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

interface NextResponse extends NextApiResponse {
  cookie(name: string, value: string, options?: CookieSerializeOptions): void;
}

type Props = {
  res: NextResponse;
  name: string;
  value: string;
  options?: CookieSerializeOptions;
};

export const setCookie = ({ res, name, value, options }: Props) => {
  const cookie = serialize(name, value, options);
  res.setHeader('Set-Cookie', cookie);
};
