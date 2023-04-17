import {createSlice, type Draft, type PayloadAction} from "@reduxjs/toolkit";

export interface TeamScoresState {
	[teamId: string]: TeamScore;
}


export type TeamScore = {
	id: string;
	score: number;
}

const initialState: TeamScoresState = {
	'team1': {
		id: 'team1',
		score: 755
	},
	'team2': {
		id: 'team2',
		score: 945
	}
}

export const teamScoresSlice = createSlice({
		name: 'teams',
		initialState,
		reducers: {
			'addNew': (state: Draft<TeamScoresState>, action: PayloadAction<TeamScore>) => {
				state[action.payload.id] = action.payload;
			}
		}
	}
);
export const selectTeamScores = (state: { teams: TeamScoresState }): TeamScore[] => {
	return Array.from(Object.values(state.teams));
}