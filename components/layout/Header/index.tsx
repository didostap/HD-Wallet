import { CREATE_WALLET, DECRYPT_WALLET, WALLET } from '@/constants/strings';
import { decryptWallet, selectAuthState } from '@/store/slices/authSlice';
import { createHDW } from '@/store/slices/createWalletSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector(selectAuthState);
  const onCreateWallet = () => {
    dispatch(createHDW());
    router.push('/create-wallet/seed-phrase');
  };

  const onDecryptWallet = () => {
    dispatch(decryptWallet(''));
  };

  return (
    <header className='bg-white'>
      <div className='container mx-auto grid grid-cols-2 content-start'>
        <p className='uppercase font-medium tracking-widest self-center'>{WALLET}</p>
        <button
          role='button'
          onClick={authState ? onDecryptWallet : onCreateWallet}
          className='btn bg-gradient-to-tr from-fuchsia-100 to-slate-200 px-6 py-4 rounded-full -mr-4 uppercase justify-self-end'
        >
          {authState ? DECRYPT_WALLET : CREATE_WALLET}
        </button>
      </div>
    </header>
  );
};

export default Header;
