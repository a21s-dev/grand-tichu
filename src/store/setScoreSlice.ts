import { createSlice } from '@reduxjs/toolkit';
import { type TeamIndexKey } from './gamePlayersSlice';

export type SetScoreState = {
	[teamId in TeamIndexKey]: TeamDetails;
};

export type TeamDetails = {
	team: TeamIndexKey;
	oneTwo: boolean;
	points: number;
};

const initialState: SetScoreState = {
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
};

export const setScoreSlice = createSlice({
	name: 'setScore',
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
export const selectTeamsDetails = (state: {
	setScore: SetScoreState;
}): TeamDetails[] => {
	return Array.from(Object.values(state.setScore));
};
export const selectTeamsDetailsRaw = (state: {
	setScore: SetScoreState;
}): SetScoreState => {
	return state.setScore;
};
