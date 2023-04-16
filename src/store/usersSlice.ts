import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface AppUsersState {
	users: { [userId: string]: AppUser };
}

export type AppUser = {
	id: string;
	name: string;
}

const initialState: AppUsersState = {
	users: {
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
			name: 'Ted'
		}
	}
}

export const usersSlice = createSlice({
		name: 'users',
		initialState,
		reducers: {
			'addNew': (state: Draft<AppUsersState>, action: PayloadAction<AppUser>) => {
				state.users[action.payload.id] = action.payload;
			},
			// 'tichuOrGrand': (state: Draft<GamePlayerState>, action: PayloadAction<{ id: string, tichu: boolean, grandTichu: boolean }>) => {
			// 	const v = state.players[action.payload.id];
			// 	v.tichu = action.payload.tichu;
			// 	v.grandTichu = action.payload.grandTichu;
			// },
			// 'newPlayerDeals': (state: Draft<GamePlayerState>, action: PayloadAction<{ newId: string }>) => {
			// 	for (const player of Object.values(state.players)) {
			// 		player.deals = false;
			// 	}
			// 	const newPlayer = state.players[action.payload.newId];
			// 	newPlayer.deals = true;
			// }
		}
	}
);
export const selectAppUsers = (state: { users: AppUsersState }) => {
	return state.users;
}

export const selectAppUser = (state: { users: AppUsersState }, id: string): AppUser | undefined => {
	return state.users[id];
}