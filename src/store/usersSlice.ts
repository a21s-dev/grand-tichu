import { AnyAction, createSlice, type Draft, type PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { getEntries } from '../utils/type-wizards.ts';
import { GlobalState } from './store.ts';
import { InvalidPlayerNameError } from '../error/InvalidPlayerNameError.ts';
import { PlayerAlreadyExistsError } from '../error/PlayerAlreadyExistsError.ts';
import { PlayerDoesNotExistError } from '../error/PlayerDoesNotExistError.ts';
import { currentGameSlice, TurnDetails } from './currentGameSlice.ts';
import { gamesSlice } from './gamesSlice.ts';


export type AppUser = {
	id: string,
	name: string,
	isMvp?: boolean
}
export type AppUsersState = {
	[key: string]: AppUser
}

export const usersSlice = createSlice({
	name: 'users',
	initialState: {},
	reducers: {
		REPLACE_WHOLE_STATE: (_: Draft<AppUsersState>, action: PayloadAction<AppUsersState>) => {
			return action.payload;
		},
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
		internalRename: (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
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
					turns: [HELPERS.initialTurnDetails(users[0], users[1], users[2], users[3])],
				}));
			}
		};
	},
	rename: (appUser: AppUser) => {
		return (dispatch: ThunkDispatch<GlobalState, unknown, AnyAction>) => {
			dispatch(usersSlice.actions.internalRename(appUser));
			dispatch(gamesSlice.actions.renamePlayer({ user: appUser }));
			dispatch(currentGameSlice.actions.renamePlayer({ playerId: appUser.id, newName: appUser.name }));
		};
	},
	delete: (userId: string) => {
		return (dispatch: ThunkDispatch<GlobalState, unknown, AnyAction>, getState: () => GlobalState) => {
			dispatch(usersSlice.actions.internalDelete({ userId }));
			dispatch(gamesSlice.actions.deletePlayer({ userId }));
			const globalState = getState();
			const users = Object.values(globalState.users);
			if (users.length < 4) {
				dispatch(currentGameSlice.actions.initialInitialReset());
				return;
			}
			const currentGame = globalState.currentGame;
			const latestTurn = currentGame.turns[currentGame.turns.length - 1];
			const remainingPlayers = Object.values(latestTurn.players).filter(player => player.id !== userId);
			if (remainingPlayers.length === 4){
				// No need to reset the game, since the deleted player was not part of the current game
				return;
			}
			const remainingPlayerIds = remainingPlayers.map(player => player.id);
			const anotherPlayer = users.find(user => !remainingPlayerIds.includes(user.id));
			if (anotherPlayer == undefined) {
				throw new Error('Could not find another player');
			}
			dispatch(currentGameSlice.actions.initialInitialTurn({
				turns: [HELPERS.initialTurnDetails(remainingPlayers[0], remainingPlayers[1], remainingPlayers[2], anotherPlayer)],
			}));
		};
	},
};

const HELPERS = {
	findUserByName: (name: string, state: AppUsersState): AppUser | undefined => {
		return getEntries(state).map(([, user]) => user).find(user => user.name.toLowerCase() === name.toLowerCase());
	},
	initialTurnDetails: (user1: AppUser, user2: AppUser, user3: AppUser, user4: AppUser): TurnDetails => {
		return {
			players: {
				t1p1: {
					id: user1.id,
					name: user1.name,
					isMvp: user1.isMvp
				},
				t1p2: {
					id: user2.id,
					name: user2.name,
					isMvp: user2.isMvp
				},
				t2p1: {
					id: user3.id,
					name: user3.name,
					isMvp: user3.isMvp
				},
				t2p2: {
					id: user4.id,
					name: user4.name,
					isMvp: user4.isMvp
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
				id: user1.id,
				name: user1.name,
			},
			playerWhoDeals: 't1p1',
			score: {
				team1: 50,
				team2: 50,
			},
		};
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
