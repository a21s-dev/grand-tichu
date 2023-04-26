import { configureStore } from '@reduxjs/toolkit';
import { gamePlayersSlice } from './gamePlayersSlice';
import { usersSlice } from './usersSlice.ts';
import { teamsSlice } from './teamsSlice.ts';
import { setScoreSlice } from './setScoreSlice.ts';

export const STORE = configureStore({
	reducer: {
		[gamePlayersSlice.name]: gamePlayersSlice.reducer,
		[usersSlice.name]: usersSlice.reducer,
		[teamsSlice.name]: teamsSlice.reducer,
		[setScoreSlice.name]: setScoreSlice.reducer,
	},
	devTools: true,
});
