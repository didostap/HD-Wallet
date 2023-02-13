import { createAction } from '@reduxjs/toolkit';

export const stepBack = createAction('flow/stepBack');
export const startOver = createAction('flow/startOver');
export const breakFlow = createAction('flow/breakFlow');
