'use client';
import {
	configureStore,
	createListenerMiddleware,
	isAnyOf,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { teamsSlice } from '~/store/teamsSlice';
import { gamePlayersSlice, TeamIndexKey } from '~/store/gamePlayersSlice';
import { usersSlice } from '~/store/usersSlice';
import { setScoreSlice } from '~/store/setScoreSlice';
import { z } from 'zod';

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
	effect: (action, listenerApi) => {
		localStorage.setItem('state', JSON.stringify(listenerApi.getState()));
	},
});
const makeStore = () =>
	configureStore({
		reducer: {
			[gamePlayersSlice.name]: gamePlayersSlice.reducer,
			[usersSlice.name]: usersSlice.reducer,
			[teamsSlice.name]: teamsSlice.reducer,
			[setScoreSlice.name]: setScoreSlice.reducer,
		},
		// preloadedState: stateFromLocalStorage,
		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware().concat(listenerMiddleware.middleware);
		},
		devTools: true,
	});

const gamePlayer = z.object({
	id: z.string(),
	name: z.string(),
	tichu: z.boolean(),
	grandTichu: z.boolean(),
	team: z.union([z.literal('team1'), z.literal('team2')]),
	deals: z.boolean(),
});

const user = z.object({
	id: z.string(),
	name: z.string(),
});

const team = z.object({
	id: z.string(),
	score: z.number(),
});

const setScore = z.object({
	team: z.string(),
	oneTwo: z.boolean(),
	points: z.number(),
});

const StateItems = z.object({
	gamePlayers: z.record(z.string(), gamePlayer),
	users: z.record(z.string(), user),
	teams: z.record(z.string(), team),
	setScore: z.record(z.string(), setScore),
});

export function stateFromLocalStorage(
	key: 'gamePlayers' | 'users' | 'teams' | 'setScore',
	initial?: any,
) {
	console.log(window);
	const s = localStorage.getItem('state');
	if (s == null) {
		throw new Error('');
		// return initial;
	}
	const state = StateItems.parse(s);
	return state[key];
}

export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore);
