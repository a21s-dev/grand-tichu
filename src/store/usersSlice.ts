import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';

export interface AppUsersState {
	[userId: string]: AppUser;
}

export type AppUser = {
	id: string;
	name: string;
};

const initialState: AppUsersState = {
	'1': {
		id: '1',
		name: 'Andrew',
	},
	'2': {
		id: '2',
		name: 'Brad',
	},
	'3': {
		id: '3',
		name: 'Adam',
	},
	'4': {
		id: '4',
		name: 'Raf',
	},
	'5': {
		id: '5',
		name: 'Ted',
	},
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		addNew: (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
			state[action.payload.id] = action.payload;
		},
	},
});
export const selectAppUsers = (state: { users: AppUsersState }): AppUser[] => {
	return Array.from(Object.values(state.users));
};
