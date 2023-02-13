import {
  NEXT,
  CANCEL,
  SETUP_SECURE_PHRASE,
  WRITE_DOWN_PHRASE,
  ANYONE_WARNING,
  YOU_WILL_ASKED_PHRASE,
} from '@/constants/strings';
import { proceedSeedPhase, selectCreateHDWMnemonic } from '@/store/slices/createWalletSlice';
import { breakFlow, stepBack } from '@/store/slices/flowSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const SeedPhrase = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const mnemonic = useSelector(selectCreateHDWMnemonic);

  const onProceed = () => {
    dispatch(proceedSeedPhase());
    router.push('confirm-seed-phrase');
  };

  const onCancel = () => {
    dispatch(stepBack());
    router.push('/', undefined, { shallow: true });
  };

  return (
    <>
      <div className='mb-4'>
        <h1>{SETUP_SECURE_PHRASE}</h1>
        <p>
          {WRITE_DOWN_PHRASE}
          <b>${ANYONE_WARNING}</b> {YOU_WILL_ASKED_PHRASE}
        </p>
      </div>
      <ol className='my-4 grid grid-rows-6 grid-flow-col gap-4 mx-auto'>
        {mnemonic.map((word, index) => (
          <li className='bg-white p-2 rounded-lg' key={word}>
            {index + 1}. {word}
          </li>
        ))}
      </ol>

      <div className='float-right'>
        <button role='button' className='btn-text mr-2' onClick={onCancel}>
          {CANCEL}
        </button>
        <button role='button' className='btn-contained' onClick={onProceed}>
          {NEXT}
        </button>
      </div>
    </>
  );
};

export default SeedPhrase;
