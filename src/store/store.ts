import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { APP_USERS_STATE_SCHEMA, AppUsersState, usersSlice } from './usersSlice.ts';
import { getState } from '../utils/localStorageUtils.ts';
import { z } from 'zod';
import { GAMES_HISTORY_STATE_SCHEMA, GamesHistoryState, gamesSlice } from './gamesSlice.ts';
import {
	CURRENT_TURN_DETAILS_STATE_SCHEMA,
	currentTurnDetailsSlice,
	CurrentTurnDetailsState,
} from './currentTurnDetailsSlice.ts';


export const SLICES_KEYS_SCHEMA = z.enum(['users', 'games', 'currentTurnDetails']);
type SlicesKeys = z.infer<typeof SLICES_KEYS_SCHEMA>;

export const GLOBAL_STATE_SCHEMA = z.object({
	users: APP_USERS_STATE_SCHEMA,
	games: GAMES_HISTORY_STATE_SCHEMA,
	currentTurnDetails: CURRENT_TURN_DETAILS_STATE_SCHEMA,
});
export type GlobalState = z.infer<typeof GLOBAL_STATE_SCHEMA>;
type SLICES_TYPES =
	| AppUsersState
	| GamesHistoryState
	| CurrentTurnDetailsState
const localStorageListener = createListenerMiddleware();
localStorageListener.startListening({
	matcher: isAnyOf(
		currentTurnDetailsSlice.actions.newPlayerDeals,
		currentTurnDetailsSlice.actions.tichuOrGrand,
		currentTurnDetailsSlice.actions.replacePlayer,
		currentTurnDetailsSlice.actions.teamOneTwo,
		currentTurnDetailsSlice.actions.teamPoints,
		currentTurnDetailsSlice.actions.finishedFirst,
		usersSlice.actions.addNew,
	),
	effect: (_, listenerApi) => {
		localStorage.setItem('state', JSON.stringify(listenerApi.getState()));
	},
});
export const STORE = configureStore({
	reducer: {
		[usersSlice.name]: usersSlice.reducer,
		[gamesSlice.name]: gamesSlice.reducer,
		[currentTurnDetailsSlice.name]: currentTurnDetailsSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(localStorageListener.middleware);
	},
	devTools: true,
});


export function stateFromLocalStorage(
	key: SlicesKeys,
	initial: SLICES_TYPES,
): SLICES_TYPES {
	try {
		const state = getState();
		return state[key];
	} catch (err) {
		return initial;
	}
}