'use client';
import {
	type Action,
	configureStore,
	type ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { teamsSlice } from '~/store/teamsSlice';
import { gamePlayersSlice } from '~/store/gamePlayersSlice';
import { usersSlice } from '~/store/usersSlice';
import { setScoreSlice } from '~/store/setScoreSlice';

const makeStore = () =>
	configureStore({
		reducer: {
			[gamePlayersSlice.name]: gamePlayersSlice.reducer,
			[usersSlice.name]: usersSlice.reducer,
			[teamsSlice.name]: teamsSlice.reducer,
			[setScoreSlice.name]: setScoreSlice.reducer,
		},
		devTools: true,
	});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
