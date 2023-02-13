import { CONTINUE, ENTER_FOLLOWING_WORDS, START_OVER, VERIFY_PHRASE } from '@/constants/strings';
import { checkMnemonic, getSeedWordsRandomNumbers, selectCreateHDWError } from '@/store/slices/createWalletSlice';
import { startOver, stepBack } from '@/store/slices/flowSlice';
import { getRandomNumbers } from '@/utils/getRandomNumber';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

type FormInput = {
  [key: string]: string;
};

const ConfirmSeedPhrase = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const seedWordsNumbs = useSelector(getSeedWordsRandomNumbers);
  const error = useSelector(selectCreateHDWError);

  const { register, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      [seedWordsNumbs[0]]: '',
      [seedWordsNumbs[1]]: '',
      [seedWordsNumbs[2]]: '',
      [seedWordsNumbs[3]]: '',
    },
  });

  const onSubmit: SubmitHandler<FormInput> = words => {
    console.log(words);
    const checkMatch = (success: boolean) => success && router.push('create-password');
    dispatch(checkMnemonic({ words, checkMatch }));
  };

  const onStartOver = () => {
    dispatch(startOver());
    router.push('seed-phrase');
  };

  return (
    <div className='bg-white p-4 rounded-xl w-1/2 mx-auto'>
      <h1>{VERIFY_PHRASE}</h1>
      <p>{ENTER_FOLLOWING_WORDS}</p>
      <form className='grid' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 gap-3 my-10'>
          {seedWordsNumbs.map(num => (
            <input key={num} placeholder={`Word #${num}`} {...register(`${num}`, { required: true })} />
          ))}
        </div>
        <p className={`${error ? 'error' : 'invisible'}`}>{error}</p>
        <div className='justify-self-end'>
          <button role='button' className='btn-text' onClick={onStartOver}>
            {START_OVER}
          </button>
          <button role='button' className='btn-contained' type='submit'>
            {CONTINUE}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmSeedPhrase;
