import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface GamePlayerState {
	players: { [playerId: string]: GamePlayer };
}


export type GamePlayer = {
	id: string;
	name: string;
	tichu: boolean;
	grandTichu: boolean;
	team: string;
	deals: boolean;
}

const initialState: GamePlayerState = {
	players: {
		'1': {
			id: '1',
			name: 'Andrew',
			team: 'team1',
			tichu: false,
			grandTichu: false,
			deals: false
		},
		'2': {
			id: '2',
			name: 'Brad',
			team: 'team1',
			tichu: false,
			grandTichu: false,
			deals: true
		},
		'3': {
			id: '3',
			name: 'Adam',
			team: 'team2',
			tichu: false,
			grandTichu: false,
			deals: false
		},
		'4': {
			id: '4',
			name: 'Raf',
			team: 'team2',
			tichu: false,
			grandTichu: false,
			deals: false
		}
	}
}

export const gamePlayersSlice = createSlice({
		name: 'gamePlayers',
		initialState,
		reducers: {
			'tichuOrGrand': (state: Draft<GamePlayerState>, action: PayloadAction<{ id: string, tichu: boolean, grandTichu: boolean }>) => {
				const player: GamePlayer | undefined = getPlayerById(state, action.payload.id);
				if (player == undefined) {
					throw new Error('1231das');
				}
				player.tichu = action.payload.tichu;
				player.grandTichu = action.payload.grandTichu;
			},
			'newPlayerDeals': (state: Draft<GamePlayerState>, action: PayloadAction<{ newId: string }>) => {
				const allPlayers = getAllPlayers(state);
				for (const player of allPlayers) {
					player.deals = false;
				}
				const newPlayer = getPlayerById(state, action.payload.newId);
				if (newPlayer == undefined) {
					throw new Error('1231');
				}
				newPlayer.deals = true;
			},
			'replacePlayer': (state: Draft<GamePlayerState>, action: PayloadAction<{ playerToRemoveId: string, newPlayer: { id: string, name: string } }>) => {
				const playerToRemove = getPlayerById(state, action.payload.playerToRemoveId);
				if (playerToRemove == undefined) {
					throw new Error('1231');
				}
				delete state.players[playerToRemove.id];
				// state.players[playerToRemove.id] =
				state.players[action.payload.newPlayer.id] = {
					id: action.payload.newPlayer.id,
					name: action.payload.newPlayer.name,
					team: playerToRemove.team,
					tichu: playerToRemove.tichu,
					grandTichu: playerToRemove.grandTichu,
					deals: playerToRemove.deals
				}
			}
		}
	}
);


function getAllPlayers(state: GamePlayerState): readonly [GamePlayer, GamePlayer, GamePlayer, GamePlayer,] {
	return Array.from(Object.values(state.players));
}

function getPlayersOfTeam(state: GamePlayerState, teamId: 'team1' | 'team2'): readonly [GamePlayer, GamePlayer,] {
	const players = getAllPlayers(state);
	return players.filter(player => player.team === teamId);
}

function getPlayerById(state: GamePlayerState, playerId: string): GamePlayer | undefined {
	return state.players[playerId];
}

export const selectGamePlayersInWeirdOrder = (state: { gamePlayers: GamePlayerState }) => {
	const playersInFirstTeam = getPlayersOfTeam(state.gamePlayers, 'team1');
	const playersInSecondTeam = getPlayersOfTeam(state.gamePlayers, 'team2');
	return [playersInFirstTeam[0], playersInSecondTeam[0], playersInFirstTeam[1], playersInSecondTeam[1]];
}
export const selectPlayerWhoDeals = (state: { gamePlayers: GamePlayerState }) => {
	const allPlayers = getAllPlayers(state.gamePlayers);
	const playerWhoDeals = allPlayers.find(player => player.deals);
	return playerWhoDeals;
}