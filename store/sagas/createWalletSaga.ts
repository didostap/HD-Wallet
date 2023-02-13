import { ENC_SEED } from '@/constants/storage';
import {
  createHDW,
  HDWState,
  proceedSeedPhase,
  selectCreateHDWMnemonic,
  setHDWMnemonic,
  checkMnemonic,
  setUnmatchedPhrase,
  mnemonicMatched,
  createPassword,
  isMatchSeedPhrase,
} from '@/store/slices/createWalletSlice';
import { startOver, stepBack } from '@/store/slices/flowSlice';
import { encryptData } from '@/utils/cryptography/encodeData';
import { genHDWMnemonic } from '@/utils/web3/wallet';
import axios from 'axios';
import { Task } from 'redux-saga';
import { call, cancel, put, select, take, takeEvery, takeLeading } from 'redux-saga/effects';

function* genHDWMnemonicWorker() {
  const mnemonic = genHDWMnemonic();
  console.log('mnemonic', mnemonic);
  yield put(setHDWMnemonic(mnemonic.split(' ')));
}

function* proceedMnemonicWorker() {
  yield take([proceedSeedPhase]);
}

function* checkSeedPhraseWorker() {
  while (true) {
    const { payload }: ReturnType<typeof checkMnemonic> = yield take(checkMnemonic);
    const matched: boolean = yield select(isMatchSeedPhrase(payload.words));
    console.log('matched', matched);
    payload.checkMatch(matched);

    if (matched) {
      console.log('matched');
      yield put(mnemonicMatched());
      break;
    } else {
      console.log('unmatched');
      yield put(setUnmatchedPhrase());
    }
  }
}

function* createPasswordWorker() {
  const seedPhrase: HDWState['mnemonic'] = yield select(selectCreateHDWMnemonic);
  const { payload: password }: ReturnType<typeof createPassword> = yield take(createPassword);
  const encryptedSeedPhrase = encryptData(seedPhrase.join(' '));
  const encryptedPassword = encryptData(password);

  const {
    data: { encryptedWallet },
  }: { data: { encryptedWallet: string } } = yield call(axios.post, '/api/wallet/encrypt', {
    encryptedPassword,
    encryptedSeedPhrase,
  });
  localStorage.setItem(ENC_SEED, encryptedWallet);
}

function* createWalletFlow() {
  let stepIndex = 0;
  let activeLoop = true;

  const steps = [genHDWMnemonicWorker, proceedMnemonicWorker, checkSeedPhraseWorker, createPasswordWorker];

  const stepBackTask: Task = yield takeLeading(stepBack, function* () {
    stepIndex--;
    if (stepIndex === 0) {
      activeLoop = false;
      yield cancel([stepBackTask, startOverTask]);
    }
  });

  const startOverTask: Task = yield takeLeading(startOver, function* () {
    activeLoop = false;
    console.log('start over');
    yield put(createHDW());
    yield cancel([stepBackTask, startOverTask]);
  });

  while (activeLoop) {
    const actionType: string = yield call(steps[stepIndex]);
    console.log('stepIndex', stepIndex, actionType, stepBack.toString());
    stepIndex++;

    if (stepIndex >= steps.length) {
      console.log('cancel flow');
      yield cancel(stepBackTask);
      break;
    }
  }
}

export default function* createWalletSaga() {
  yield takeEvery(createHDW, createWalletFlow);
}
