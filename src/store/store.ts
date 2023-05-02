import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { usersSlice } from './usersSlice.ts';
import { gamesSlice } from './gamesSlice.ts';
import { currentTurnDetailsSlice } from './currentTurnDetailsSlice.ts';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
	key: 'root',
	storage,
};
const reducers = combineReducers({
	[usersSlice.name]: usersSlice.reducer,
	[gamesSlice.name]: gamesSlice.reducer,
	[currentTurnDetailsSlice.name]: currentTurnDetailsSlice.reducer,
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
