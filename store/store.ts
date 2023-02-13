import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import { createHDWSlice } from '@/store/slices/createWalletSlice';
import rootSaga from '@/store/sagas/rootSaga';

const combinedReducer = {
  [authSlice.name]: authSlice.reducer,
  [createHDWSlice.name]: createHDWSlice.reducer,
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: combinedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(middleware),
});

sagaMiddleware.run(rootSaga);

const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
