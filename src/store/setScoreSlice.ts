import { createSlice } from '@reduxjs/toolkit';
import { TEAM_INDEX_SCHEMA } from './gamePlayersSlice';
import { z } from 'zod';
import { GlobalState, stateFromLocalStorage } from './store.ts';
import { exhaustiveEnumRecord } from '../utils/type-wizards.ts';

const SET_SCORE_SCHEMA = z.object({
	team: TEAM_INDEX_SCHEMA,
	oneTwo: z.boolean(),
	points: z.number(),
});
export const SET_SCORE_STATE_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, SET_SCORE_SCHEMA);
export type TeamDetails = z.infer<typeof SET_SCORE_SCHEMA>;
export type SetScoreState = z.infer<typeof SET_SCORE_STATE_SCHEMA>;

export const setScoreSlice = createSlice({
	name: 'setScore',
	initialState: () => {
		return stateFromLocalStorage('setScore', {
			team1: {
				team: 'team1',
				oneTwo: false,
				points: 70,
			},
			team2: {
				team: 'team2',
				oneTwo: false,
				points: 30,
			},
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
export const selectTeamsDetails = (state: {
	setScore: SetScoreState;
}): TeamDetails[] => {
	return Array.from(Object.values(state.setScore));
};
export const selectTeamsDetailsRaw = (state: GlobalState): SetScoreState => {
	return state.setScore;
};
