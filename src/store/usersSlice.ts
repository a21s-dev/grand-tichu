import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { getEntries } from '../utils/type-wizards.ts';
import { GlobalState } from './store.ts';
import { InvalidPlayerNameError } from '../error/InvalidPlayerNameError.ts';
import { PlayerAlreadyExistsError } from '../error/PlayerAlreadyExistsError.ts';


export type AppUser = {
	id: string,
	name: string,
}
export type AppUsersState = {
	[key: string]: AppUser
}

const initialState: AppUsersState = {
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
export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		addNew: (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
			const trimmedName = action.payload.name.trim();
			if (trimmedName.length === 0) {
				throw new InvalidPlayerNameError();
			}
			const idExists = state[action.payload.id] != undefined;
			if (idExists) {
				throw new PlayerAlreadyExistsError();
			}
			const nameExists = HELPERS.findUserByName(trimmedName, state) != undefined;
			if (nameExists) {
				throw new PlayerAlreadyExistsError();
			}
			state[action.payload.id] = {
				id: action.payload.id,
				name: trimmedName,
			};
		},
	},
});

const HELPERS = {
	findUserByName: (name: string, state: AppUsersState): AppUser | undefined => {
		return getEntries(state).map(([, user]) => user).find(user => user.name.toLowerCase() === name.toLowerCase());
	},
} as const;

export const USERS_SELECTORS = {
	selectAppUsers: (state: { users: AppUsersState }): AppUser[] => {
		return Array.from(Object.values(state.users));
	},
} as const;

export const USERS_WEIRD_SELECTORS = {
	selectUserById: (state: GlobalState, userId: string): AppUser | undefined => {
		return state.users[userId];
	},
} as const;