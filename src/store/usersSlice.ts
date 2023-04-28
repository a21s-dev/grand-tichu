import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { stateFromLocalStorage } from './store.ts';


const APP_USER_SCHEMA = z.object({
	id: z.string(),
	name: z.string(),
});
export const APP_USERS_STATE_SCHEMA = z.record(z.string(), APP_USER_SCHEMA);
export type AppUser = z.infer<typeof APP_USER_SCHEMA>
export type AppUsersState = z.infer<typeof APP_USERS_STATE_SCHEMA>;

export const usersSlice = createSlice({
	name: 'users',
	initialState: () => {
		return stateFromLocalStorage('users', {
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
		}) as AppUsersState;
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
