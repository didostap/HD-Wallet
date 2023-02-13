import { AppState } from '@/store/store';
import { getRandomNumbers } from '@/utils/getRandomNumber';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HDWState {
  error: string;
  mnemonic: string[];
}

const initialState: HDWState = {
  error: '',
  mnemonic: [],
};

export const createHDW = createAction('createHDW/createHDW');
export const proceedSeedPhase = createAction('createHDW/proceedSeedPhase');
export const checkMnemonic = createAction<{ words: { [key: string]: string }; checkMatch: (success: boolean) => void }>(
  'createHDW/checkMnemonic'
);
export const mnemonicMatched = createAction('createHDW/mnemonicMatched');
export const createPassword = createAction<string>('createHDW/createPassword');

export const createHDWSlice = createSlice({
  name: 'createHDW',
  initialState,
  reducers: {
    setHDWMnemonic(state, action: PayloadAction<string[]>) {
      state.mnemonic = action.payload;
    },
    setUnmatchedPhrase(state) {
      state.error = 'Incorrect seed phrase';
    },
  },
});

export const { setHDWMnemonic, setUnmatchedPhrase } = createHDWSlice.actions;
export const selectCreateHDWError = (state: AppState) => state.createHDW.error;
export const selectCreateHDWMnemonic = (state: AppState) => state.createHDW.mnemonic;
export const getSeedWordsRandomNumbers = (state: AppState) =>
  getRandomNumbers(4, 1, selectCreateHDWMnemonic(state).length);
export const isMatchSeedPhrase = (words: { [key: string]: string }) => (state: AppState) => {
  const wordsIndexes = Object.keys(words);
  const mnemonic = selectCreateHDWMnemonic(state);
  console.log('words', words, 'mnemonic', mnemonic);
  return wordsIndexes.every((wordIndex, index) => words[wordIndex] === mnemonic[+wordIndex + 1]);
};
