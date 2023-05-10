import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TeamScore, TurnDetails } from './currentGameSlice.ts';
import { nanoid } from 'nanoid';

export type Game = {
	turns: TurnDetails[],
	/*
	*
	* Current score after applying all the turns
	* */
	currentScore: TeamScore,
	winningScore: 300 | 500 | 1000 | 1500 | 2000 | 'unlimited',
}
export type GamesHistoryState = {
	[key: string]: Game
}
const initialState: GamesHistoryState = {};
export const gamesSlice = createSlice({
	name: 'games',
	initialState,
	reducers: {
		add: (state: Draft<GamesHistoryState>, action: PayloadAction<Game>) => {
			const nanoId = nanoid();
			state[nanoId] = action.payload;
		},
	},
});

export const GAMES_SELECTORS = {} as const;
export const GAMES_WEIRD_SELECTORS = {} as const;
