import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { TEAM_INDEX_SCHEMA } from './gamePlayersSlice';
import { z } from 'zod';
import { stateFromLocalStorage } from './store.ts';
import { exhaustiveEnumRecord } from '../utils/type-wizards.ts';

export const TEAM_SCHEMA = z.object({
	id: TEAM_INDEX_SCHEMA,
	score: z.number(),
});
export type Team = z.infer<typeof TEAM_SCHEMA>;
export const TEAM_STATE_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, TEAM_SCHEMA);
export type TeamState = z.infer<typeof TEAM_STATE_SCHEMA>;


export const teamsSlice = createSlice({
	name: 'teams',
	initialState: () => {
		return stateFromLocalStorage('teams', {
			team1: {
				id: 'team1',
				score: 755,
			},
			team2: {
				id: 'team2',
				score: 945,
			},
		}) as TeamState;
	},
	reducers: {
		addNew: (state: Draft<TeamState>, action: PayloadAction<Team>) => {
			state[action.payload.id] = action.payload;
		},
	},
});
export const selectTeams = (state: { teams: TeamState }): Team[] => {
	return Array.from(Object.values(state.teams));
};
export const selectTeamsRaw = (state: { teams: TeamState }): TeamState => {
	return state.teams;
};
