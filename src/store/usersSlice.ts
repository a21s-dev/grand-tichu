import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';


export type AppUser = {
	id: string,
	name: string,
}
export type AppUsersState = {
	[key: string]: AppUser
}

export const usersSlice = createSlice({
	name: 'users',
	initialState: () => {
		return {

			'1': {
				id: '1',
				name: 'Player1',
			},
			'2': {
				id: '2',
				name: 'Player2',
			},
			'3': {
				id: '3',
				name: 'Player3',
			},
			'4': {
				id: '4',
				name: 'Player4',
			},
		};
	},
	reducers: {
		addNew: (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
			state[action.payload.id] = action.payload;
		},
	},
});
export const selectAppUsers = (state: { users: AppUsersState }): AppUser[] => {
	return Array.from(Object.values(state.users));
};
