import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TeamScore, TurnDetails, WinningScoreType } from './currentGameSlice.ts';
import { nanoid } from 'nanoid';

export type Game = {
	id: string,
	turns: TurnDetails[],
	/*
	*
	* Current score after applying all the turns
	* */
	currentScore: TeamScore,
	winningScore: WinningScoreType,
}
export type GamesHistoryState = {
	[key: string]: Game
}
export const gamesSlice = createSlice({
	name: 'games',
	initialState: {},
	reducers: {
		add: (state: Draft<GamesHistoryState>, action: PayloadAction<{
			turns: TurnDetails[],
			currentScore: TeamScore,
			winningScore: WinningScoreType,
		}>) => {
			const nanoId = nanoid();
			state[nanoId] = {
				id: nanoId,
				turns: action.payload.turns,
				currentScore: action.payload.currentScore,
				winningScore: action.payload.winningScore,
			};
		},
	},
});

export const GAMES_SELECTORS = {} as const;
export const GAMES_WEIRD_SELECTORS = {} as const;
