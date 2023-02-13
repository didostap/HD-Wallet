import { ENC_SEED } from '@/constants/storage';
import { decryptWallet } from '@/store/slices/authSlice';
import axios from 'axios';
import { call, take } from 'redux-saga/effects';

function* encryptWorker() {
  const { payload: password } = yield take(decryptWallet);
  const encryptedData = localStorage.getItem(ENC_SEED);
  const response: { data: any } = yield call(axios.post, '/api/wallet/decrypt', { password, encryptedData });
  console.log('res', response);
}

export default function* authFlow() {
  yield call(encryptWorker);
}
