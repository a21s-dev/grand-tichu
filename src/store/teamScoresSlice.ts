import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface TeamScoresState {
	teamsAndScores: { [teamId: string]: TeamScore };
}


export type TeamScore = {
	id: string;
	score: number;
}

const initialState: TeamScoresState = {
	teamsAndScores: {
		'team1': {
			id: 'team1',
			score: 755
		},
		'team2': {
			id: 'team2',
			score: 945
		}
	}
}

export const teamScoresSlice = createSlice({
		name: 'teams',
		initialState,
		reducers: {
			'addNew': (state: Draft<TeamScoresState>, action: PayloadAction<TeamScore>) => {
				state.teamsAndScores[action.payload.id] = action.payload;
			}
		}
	}
);
export const selectTeamScores = (state: { teams: TeamScoresState }) => {
	return state.teams;
}