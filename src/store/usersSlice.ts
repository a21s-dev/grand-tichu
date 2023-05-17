import { AnyAction, createSlice, type Draft, type PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { getEntries } from '../utils/type-wizards.ts';
import { GlobalState } from './store.ts';
import { InvalidPlayerNameError } from '../error/InvalidPlayerNameError.ts';
import { PlayerAlreadyExistsError } from '../error/PlayerAlreadyExistsError.ts';
import { PlayerDoesNotExistError } from '../error/PlayerDoesNotExistError.ts';
import { currentGameSlice } from './currentGameSlice.ts';


export type AppUser = {
	id: string,
	name: string,
}
export type AppUsersState = {
	[key: string]: AppUser
}

export const usersSlice = createSlice({
	name: 'users',
	initialState: {},
	reducers: {
		internalAddNew: (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
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
		updateName: (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
			const trimmedName = action.payload.name.trim();
			if (trimmedName.length === 0) {
				throw new InvalidPlayerNameError();
			}
			const userWithSameId = state[action.payload.id];
			if (userWithSameId == undefined) {
				throw new PlayerDoesNotExistError();
			}
			if (userWithSameId.name === trimmedName) {
				return;
			}
			const userWithSameName = HELPERS.findUserByName(trimmedName, state);
			if (userWithSameName != undefined) {
				throw new PlayerAlreadyExistsError();
			}
			state[action.payload.id] = {
				id: action.payload.id,
				name: trimmedName,
			};
		},
		internalDelete: (state: Draft<AppUsersState>, action: PayloadAction<{ userId: string }>) => {
			const userWithSameId = state[action.payload.userId];
			if (userWithSameId == undefined) {
				throw new PlayerDoesNotExistError();
			}
			delete state[action.payload.userId];
		},
	},
});

export const USERS_EXTRA_ACTIONS = {
	add: (appUser: AppUser) => {
		return (dispatch: ThunkDispatch<GlobalState, unknown, AnyAction>, getState: () => GlobalState) => {
			dispatch(usersSlice.actions.internalAddNew(appUser));
			const globalState = getState();
			const users = Object.values(globalState.users);
			if (users.length === 4) {
				dispatch(currentGameSlice.actions.initialInitialTurn({
					turns: [
						{
							players: {
								t1p1: {
									id: users[0].id,
									name: users[0].name,
								},
								t1p2: {
									id: users[1].id,
									name: users[1].name,
								},
								t2p1: {
									id: users[2].id,
									name: users[2].name,
								},
								t2p2: {
									id: users[3].id,
									name: users[3].name,
								},
							},
							playersTichuGrandTichu: {
								t1p1: {
									tichu: false,
									grandTichu: false,
								},
								t1p2: {
									tichu: false,
									grandTichu: false,
								},
								t2p1: {
									tichu: false,
									grandTichu: false,
								},
								t2p2: {
									tichu: false,
									grandTichu: false,
								},
							},
							teamsOneTwo: {
								team1: false,
								team2: false,
							},
							teamsPoints: {
								team1: 0,
								team2: 0,
							},
							finishedFirst: {
								id: users[0].id,
								name: users[0].name,
							},
							playerWhoDeals: 't1p1',
							score: {
								team1: 50,
								team2: 50,
							},
						},
					],
				}));
			}
		};
	},
	delete: (userId: string) => {
		return (dispatch: ThunkDispatch<GlobalState, unknown, AnyAction>, getState: () => GlobalState) => {
			dispatch(usersSlice.actions.internalDelete({ userId }));
			const globalState = getState();
			const users = Object.values(globalState.users);
			if (users.length < 4) {
				dispatch(currentGameSlice.actions.initialInitialReset());
			}
		};
	},
};

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
	users: (state: GlobalState): AppUser[] => {
		return Array.from(Object.values(state.users));
	},
} as const;
