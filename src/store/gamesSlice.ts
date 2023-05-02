import { createSlice } from '@reduxjs/toolkit';
import { PlayerWithDetails, TeamIndex } from './currentTurnDetailsSlice.ts';

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

export const gamesSlice = createSlice({
	name: 'games',
	initialState: () => {
		return {
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
	},
	reducers: {
		update: () =>
			// state: Draft<SetScoreState>,
			// action: PayloadAction<TeamDetails>,
		{
			// state[action.payload.id] = action.payload;
		},
	},
});
