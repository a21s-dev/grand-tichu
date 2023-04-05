import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface GamePlayerState {
	players: { [playerId: string]: GamePlayer };
}

export type GamePlayer = {
	id: string;
	name: string;
	tichu: boolean;
	grandTichu: boolean;
	plays: boolean;
}

const initialState: GamePlayerState = {
	players: {
		'1': {
			id: '1',
			name: 'Andrew',
			tichu: false,
			grandTichu: false,
			plays: false
		},
		'2': {
			id: '2',
			name: 'Brad',
			tichu: false,
			grandTichu: false,
			plays: true
		},
		'3': {
			id: '3',
			name: 'Adam',
			tichu: false,
			grandTichu: false,
			plays: false
		},
		'4': {
			id: '4',
			name: 'Raf',
			tichu: false,
			grandTichu: false,
			plays: false
		}
	}
}

export const gamePlayersSlice = createSlice({
		name: 'gamePlayers',
		initialState,
		reducers: {
			'addNew': (state: Draft<GamePlayerState>, action: PayloadAction<GamePlayer>) => {
				state.players[action.payload.id] = action.payload;
			},
			'tichuOrGrand': (state: Draft<GamePlayerState>, action: PayloadAction<{ id: string, tichu: boolean, grandTichu: boolean }>) => {
				const v = state.players[action.payload.id];
				v.tichu = action.payload.tichu;
				v.grandTichu = action.payload.grandTichu;
			},
			'newPlayerPlays': (state: Draft<GamePlayerState>, action: PayloadAction<{ newId: string }>) => {
				for (const player of Object.values(state.players)) {
					player.plays = false;
				}
				const newPlayer = state.players[action.payload.newId];
				newPlayer.plays = true;
			}
		}
	}
);
export const selectGamePlayers = (state: { gamePlayers: GamePlayerState }) => {
	return state.gamePlayers;
}
export const selectPlayerWhoPlays = (state: { gamePlayers: GamePlayerState }) => {
	return Array.from(Object.values(state.gamePlayers.players)).find(player => player.plays);
}