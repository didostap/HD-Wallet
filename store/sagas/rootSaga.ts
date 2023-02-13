import authFlow from '@/store/sagas/authSaga';
import createWalletFlow from '@/store/sagas/createWalletSaga';
import { spawn } from 'redux-saga/effects';

export default function* rootSaga() {
  yield spawn(createWalletFlow);
  yield spawn(authFlow);
}
