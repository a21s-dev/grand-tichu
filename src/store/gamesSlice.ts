import { createSlice } from '@reduxjs/toolkit';
import { PlayerWithDetails, TeamIndex } from './currentGameSlice.ts';

export type TurnDetails = {
	players: { [key: string]: PlayerWithDetails },
	oneTwoPerTeam: { [key in TeamIndex]: boolean }
	pointsPerTeam: { [key in TeamIndex]: number }
	finishedFirst: PlayerWithDetails
	totalPointsPerTeam: { [key in TeamIndex]: number }
}
export type Game = TurnDetails[];
export type GamesHistoryState = {
	[key: string]: Game
}
const initialState: GamesHistoryState = {
	'1asdasd': [
		{
			players: {},
			oneTwoPerTeam: { team1: true, team2: false },
			pointsPerTeam: { team1: 5, team2: 10 },
			finishedFirst: { id: '1', tichu: true, grandTichu: true, name: '2', team: 'team1', deals: true },
			totalPointsPerTeam: { team1: 5, team2: 10 },
		},
		{
			players: {},
			oneTwoPerTeam: { team1: true, team2: false },
			pointsPerTeam: { team1: 5, team2: 10 },
			finishedFirst: { id: '1', tichu: true, grandTichu: true, name: '2', team: 'team1', deals: true },
			totalPointsPerTeam: { team1: 5, team2: 10 },
		},
	],
};
export const gamesSlice = createSlice({
	name: 'games',
	initialState,
	reducers: {
		update: () =>
			// state: Draft<SetScoreState>,
			// action: PayloadAction<TeamDetails>,
		{
			// state[action.payload.id] = action.payload;
		},
	},
});

export const GAMES_SELECTORS = {} as const;
export const GAMES_WEIRD_SELECTORS = {} as const;
