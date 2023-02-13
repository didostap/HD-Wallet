import Header from '@/components/layout/Header';
import { wrapper } from '@/store/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <>
      <Head>
        <title>Wallet</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Provider store={store}>
        <Header />
        <main className='container mx-auto my-8'>
          <Component {...props.pageProps} />
        </main>
      </Provider>
    </>
  );
}
