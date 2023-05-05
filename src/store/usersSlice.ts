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
	'5': {
		id: '5',
		name: 'Player5',
	},
	'6': {
		id: '6',
		name: 'Player6',
	},
	'7': {
		id: '7',
		name: 'Player7',
	},
	'8': {
		id: '8',
		name: 'Player8',
	},
	'9': {
		id: '9',
		name: 'Player9',
	},
	'10': {
		id: '10',
		name: 'Player10',
	},
	'11': {
		id: '11',
		name: 'Player11',
	},
	'12': {
		id: '12',
		name: 'Player12',
	},
	'13': {
		id: '13',
		name: 'Player13',
	},
	'14': {
		id: '14',
		name: 'Player14',
	},
	'15': {
		id: '15',
		name: 'Player15',
	},
	'16': {
		id: '16',
		name: 'Player16',
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
	appUsers: (state: { users: AppUsersState }): AppUser[] => {
		return Array.from(Object.values(state.users));
	},
	appUserById: (userId: string) => (state: GlobalState): AppUser | undefined => {
		return state.users[userId];
	},
} as const;

export const USERS_WEIRD_SELECTORS = {
	selectUserById: (state: GlobalState, userId: string): AppUser | undefined => {
		return state.users[userId];
	},
} as const;
