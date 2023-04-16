import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

export interface GamePlayerState {

}

export interface FourPlayerGameState extends GamePlayerState {
	't1p1': GamePlayer
	't1p2': GamePlayer
	't2p1': GamePlayer
	't2p2': GamePlayer
}

function isFourPlayerGameState(gamePlayerState: GamePlayerState): gamePlayerState is FourPlayerGameState {
	return 't1p1' in gamePlayerState && 't1p2' in gamePlayerState && 't2p1' in gamePlayerState && 't2p2' in gamePlayerState;
}

export type GamePlayer = {
	id: string;
	name: string;
	tichu: boolean;
	grandTichu: boolean;
	team: string;
	deals: boolean;
}

const initialState: FourPlayerGameState = {
	't1p1': {
		id: '1',
		name: 'Andrew',
		team: 'team1',
		tichu: false,
		grandTichu: false,
		deals: false
	},
	't1p2': {
		id: '2',
		name: 'Brad',
		team: 'team1',
		tichu: false,
		grandTichu: false,
		deals: true
	},
	't2p1': {
		id: '3',
		name: 'Adam',
		team: 'team2',
		tichu: false,
		grandTichu: false,
		deals: false
	},
	't2p2': {
		id: '4',
		name: 'Raf',
		team: 'team2',
		tichu: false,
		grandTichu: false,
		deals: false
	}
}

export const gamePlayersSlice = createSlice({
		name: 'gamePlayers',
		initialState,
		reducers: {
			'tichuOrGrand': (state: Draft<FourPlayerGameState>, action: PayloadAction<{ id: string, tichu: boolean, grandTichu: boolean }>) => {
				const player: GamePlayer | undefined = getPlayerById(state, action.payload.id);
				if (player == undefined) {
					throw new Error(`Couldn't find player with id: ${action.payload.id}.`);
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
					throw new Error(`Couldn't find player with id: ${action.payload.newId}.`);
				}
				newPlayer.deals = true;
			},
			'replacePlayer': (state: Draft<GamePlayerState>, action: PayloadAction<{ playerToRemoveId: string, newPlayer: { id: string, name: string } }>) => {
				const playerToRemove = getPlayerById(state, action.payload.playerToRemoveId);
				if (playerToRemove == undefined) {
					throw new Error(`Couldn't find player with id: ${action.payload.playerToRemoveId}.`);
				}
				const entries: [string, GamePlayer][] = Array.from(Object.entries(state));
				let playerToRemoveIndex: string | undefined;
				for (const entry of entries) {
					const playerIndex = entry[0];
					const player = entry[1];
					if (player.id === action.payload.playerToRemoveId) {
						playerToRemoveIndex = playerIndex;
						break;
					}
				}
				delete state[playerToRemoveIndex];
				state[playerToRemoveIndex] = {
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


function getAllPlayers(state: GamePlayerState): readonly GamePlayer[] {
	return Array.from(Object.values(state));
}

function getPlayerById(state: GamePlayerState, playerId: string): GamePlayer | undefined {
	if (isFourPlayerGameState(state)) {
		const players: GamePlayer[] = getAllPlayers(state);
		return players.find(player => player.id === playerId);
	}
	throw new Error(`Internal Error`);
}

export const selectGamePlayersInWeirdOrder = (state: { gamePlayers: GamePlayerState }): GamePlayer[] => {
	const players = state.gamePlayers;
	if (isFourPlayerGameState(state.gamePlayers)) {
		return [players['t1p1'], players['t2p1'], players['t1p2'], players['t2p2']];
	}
	throw new Error(`Internal Error`);
}
export const selectPlayerWhoDeals = (state: { gamePlayers: GamePlayerState }): GamePlayer | undefined => {
	const allPlayers = getAllPlayers(state.gamePlayers);
	return allPlayers.find(player => player.deals);
}