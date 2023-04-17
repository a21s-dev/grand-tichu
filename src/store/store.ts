'use client';
import {
	type Action,
	configureStore,
	type ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { teamScoresSlice } from '~/store/teamScoresSlice';
import { gamePlayersSlice } from '~/store/gamePlayersSlice';
import { usersSlice } from '~/store/usersSlice';

const makeStore = () =>
	configureStore({
		reducer: {
			[gamePlayersSlice.name]: gamePlayersSlice.reducer,
			[usersSlice.name]: usersSlice.reducer,
			[teamScoresSlice.name]: teamScoresSlice.reducer,
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
