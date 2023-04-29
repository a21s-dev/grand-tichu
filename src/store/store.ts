import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { FOUR_PLAYER_GAME_STATE_SCHEMA, FourPlayerGameState, gamePlayersSlice } from './gamePlayersSlice';
import { APP_USERS_STATE_SCHEMA, AppUsersState, usersSlice } from './usersSlice.ts';
import { TEAM_STATE_SCHEMA, teamsSlice, TeamState } from './teamsSlice.ts';
import { SET_SCORE_STATE_SCHEMA, setScoreSlice, SetScoreState } from './setScoreSlice.ts';
import { getState } from '../utils/localStorageUtils.ts';
import { z } from 'zod';
import { GAMES_HISTORY_STATE_SCHEMA, GamesHistoryState, gamesSlice } from './gamesSlice.ts';
import {
	CURRENT_TURN_DETAILS_STATE_SCHEMA,
	currentTurnDetailsSlice,
	CurrentTurnDetailsState,
} from './currentTurnDetailsSlice.ts';


export const SLICES_KEYS_SCHEMA = z.enum(['gamePlayers', 'users', 'teams', 'setScore', 'games', 'currentTurnDetails']);
type SlicesKeys = z.infer<typeof SLICES_KEYS_SCHEMA>;

export const GLOBAL_STATE_SCHEMA = z.object({
	gamePlayers: FOUR_PLAYER_GAME_STATE_SCHEMA,
	users: APP_USERS_STATE_SCHEMA,
	teams: TEAM_STATE_SCHEMA,
	setScore: SET_SCORE_STATE_SCHEMA,
	games: GAMES_HISTORY_STATE_SCHEMA,
	currentTurnDetails: CURRENT_TURN_DETAILS_STATE_SCHEMA,
});
export type GlobalState = z.infer<typeof GLOBAL_STATE_SCHEMA>;
type SLICES_TYPES =
	FourPlayerGameState
	| AppUsersState
	| TeamState
	| SetScoreState
	| GamesHistoryState
	| CurrentTurnDetailsState
const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
	matcher: isAnyOf(
		gamePlayersSlice.actions.tichuOrGrand,
		gamePlayersSlice.actions.replacePlayer,
		gamePlayersSlice.actions.newPlayerDeals,
		usersSlice.actions.addNew,
		teamsSlice.actions.addNew,
		setScoreSlice.actions.update,
	),
	effect: (_, listenerApi) => {
		localStorage.setItem('state', JSON.stringify(listenerApi.getState()));
	},
});
export const STORE = configureStore({
	reducer: {
		[gamePlayersSlice.name]: gamePlayersSlice.reducer,
		[usersSlice.name]: usersSlice.reducer,
		[teamsSlice.name]: teamsSlice.reducer,
		[setScoreSlice.name]: setScoreSlice.reducer,
		[gamesSlice.name]: gamesSlice.reducer,
		[currentTurnDetailsSlice.name]: currentTurnDetailsSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(listenerMiddleware.middleware);
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