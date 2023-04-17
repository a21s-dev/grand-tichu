import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { type TeamIndexKey } from '~/store/gamePlayersSlice';

export type TeamState = {
	[teamId in TeamIndexKey]: Team;
};

export type Team = {
	id: TeamIndexKey;
	score: number;
};

const initialState: TeamState = {
	team1: {
		id: 'team1',
		score: 755,
	},
	team2: {
		id: 'team2',
		score: 945,
	},
};

export const teamsSlice = createSlice({
	name: 'teams',
	initialState,
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
