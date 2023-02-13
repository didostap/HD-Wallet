import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { HYDRATE } from 'next-redux-wrapper';

export interface AuthState {
  encrypted: boolean;
}

const initialState: AuthState = {
  encrypted: false,
};

export const decryptWallet = createAction<string>('auth/decryptWallet');

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<boolean>) {
      state.encrypted = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action: any) => ({ ...state, ...action.payload.auth }));
  },
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.encrypted;
