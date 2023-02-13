import { CREATE, CREATE_PASSWORD, START_OVER } from '@/constants/strings';
import { createPassword } from '@/store/slices/createWalletSlice';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { startOver } from '@/store/slices/flowSlice';

const schema = yup.object({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

type FormInput = yup.InferType<typeof schema>;

const CreatePassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormInput> = ({ password }) => {
    dispatch(createPassword(password));
    router.push('/');
  };

  const onStartOver = () => {
    dispatch(startOver());
    router.push('seed-phrase');
  };

  return (
    <div className='bg-white p-4 rounded-xl w-1/2 mx-auto'>
      <h1>{CREATE_PASSWORD}</h1>
      <form className='mt-6 grid gap-6' onSubmit={handleSubmit(onSubmit)}>
        <input
          required
          type='password'
          placeholder='Password'
          className={errors.password && 'input-error'}
          {...register('password')}
        />
        <input
          required
          type='password'
          placeholder='Confirm password'
          className={errors.confirmPassword && 'input-error'}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword?.type === 'oneOf' && <p className='error'>{errors.confirmPassword.message}</p>}
        <div className='justify-self-end'>
          <button className='btn-text' role='button' onClick={onStartOver}>
            {START_OVER}
          </button>
          <button className='btn-contained' role='submit'>
            {CREATE}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePassword;
