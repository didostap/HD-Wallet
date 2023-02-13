import { decryptWallet, selectAuthState, setAuthState } from '@/store/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { wrapper } from '@/store/store';
import { createHDW } from '@/store/slices/createWalletSlice';
import { useRouter } from 'next/router';
import { encryptHDWMnemonic, genHDWallet } from '@/utils/web3/wallet';
import { useEffect, useState } from 'react';
import { ENC_SEED } from '@/constants/storage';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';

const Home = () => {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();

  const [encryptedMnemonic, setEncryptedMnemonic] = useState('');
  const [password, setPasswrod] = useState('');

  useEffect(() => {
    const encSeed = localStorage.getItem(ENC_SEED);
    // console.log(12312312, encSeed);
    if (encSeed) setEncryptedMnemonic(encSeed);
  }, []);

  const createAccount = () => {
    dispatch(createHDW());
    router.push('/create-wallet/seed-phrase');
  };

  const onDecryptWallet = () => {
    dispatch(decryptWallet(password));
  };

  return (
    <>
      <div>
        {authState ? (
          <>
            <input value={password} onChange={e => setPasswrod(e.target.value)} />
            <button role='button' onClick={onDecryptWallet}>Decrypt Wallet</button>
          </>
        ) : (
          <button role='button' onClick={createAccount}>Create Wallet</button>
        )}
        <div>{authState ? 'Logged in' : 'Not Logged In'}</div>

        <button role='button' onClick={() => (authState ? dispatch(setAuthState(false)) : dispatch(setAuthState(true)))}>
          {authState ? 'Logout' : 'LogIn'}
        </button>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async context => {
  const cookies = parse(context.req.headers.cookie || '');
  store.dispatch(setAuthState(!!cookies?.[ENC_SEED]));
});
