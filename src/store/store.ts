import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { AppUsersState, usersSlice } from './usersSlice.ts';
import { GamesHistoryState, gamesSlice } from './gamesSlice.ts';
import { CurrentGameState, currentGameSlice } from './currentGameSlice.ts';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch } from 'react-redux';
import { saveStateToFirestore } from '../firebase.ts';


export type GlobalState = {
	[usersSlice.name]: AppUsersState,
	[gamesSlice.name]: GamesHistoryState,
	[currentGameSlice.name]: CurrentGameState,
}
type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>;
export const useAppDispatch = () => useDispatch<TypedDispatch<GlobalState>>();
const persistConfig = {
	key: 'root',
	storage,
};
const reducers = combineReducers({
	[usersSlice.name]: usersSlice.reducer,
	[gamesSlice.name]: gamesSlice.reducer,
	[currentGameSlice.name]: currentGameSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const STORE = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		});
	},
	devTools: true,
});

STORE
	.subscribe(() => {
		const state = STORE.getState();
		saveStateToFirestore(state);
	});