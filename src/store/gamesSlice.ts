import { createSlice } from '@reduxjs/toolkit';
import { GAME_PLAYER_SCHEMA, TEAM_INDEX_SCHEMA } from './gamePlayersSlice';
import { z } from 'zod';
import { stateFromLocalStorage } from './store.ts';
import { exhaustiveEnumRecord } from '../utils/type-wizards.ts';

const TURN_DETAILS_SCHEMA = z.object({
	players: z.record(z.string(), GAME_PLAYER_SCHEMA),
	oneTwoPerTeam: exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.boolean()),
	pointsPerTeam: exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.number()),
	finishedFirst: GAME_PLAYER_SCHEMA,
	totalPointsPerTeam: exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.number()),
});
const GAME_SCHEMA = z.array(TURN_DETAILS_SCHEMA);
export const GAMES_HISTORY_STATE_SCHEMA = z.record(z.string(), GAME_SCHEMA);
export type GamesHistoryState = z.infer<typeof GAMES_HISTORY_STATE_SCHEMA>;

export const gamesSlice = createSlice({
	name: 'games',
	initialState: () => {
		return stateFromLocalStorage('games', {
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
		});
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
