import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { stateFromLocalStorage } from './store.ts';
import { z } from 'zod';
import { exhaustiveEnumRecord } from '../utils/type-wizards.ts';

const PLAYER_INDEX_SCHEMA = z.enum(['t1p1', 't1p2', 't2p1', 't2p2']);
export const TEAM_INDEX_SCHEMA = z.enum(['team1', 'team2']);
const GAME_PLAYER_SCHEMA = z.object({
	id: z.string(),
	name: z.string(),
	tichu: z.boolean(),
	grandTichu: z.boolean(),
	team: TEAM_INDEX_SCHEMA,
	deals: z.boolean(),
});
export const FOUR_PLAYER_GAME_STATE_SCHEMA = exhaustiveEnumRecord(PLAYER_INDEX_SCHEMA, GAME_PLAYER_SCHEMA);
export type PlayerIndex = z.infer<typeof PLAYER_INDEX_SCHEMA>;
export type TeamIndex = z.infer<typeof TEAM_INDEX_SCHEMA>;
export type GamePlayer = z.infer<typeof GAME_PLAYER_SCHEMA>;
export type FourPlayerGameState = z.infer<typeof FOUR_PLAYER_GAME_STATE_SCHEMA>;

export const gamePlayersSlice = createSlice({
	name: 'gamePlayers',
	initialState: () => {
		return stateFromLocalStorage('gamePlayers', {
			t1p1: {
				id: '1',
				name: 'Player1',
				team: 'team1',
				tichu: false,
				grandTichu: false,
				deals: false,
			},
			t1p2: {
				id: '3',
				name: 'Player3',
				team: 'team2',
				tichu: false,
				grandTichu: false,
				deals: false,
			},
			t2p1: {
				id: '2',
				name: 'Player2',
				team: 'team1',
				tichu: false,
				grandTichu: false,
				deals: true,
			},
			t2p2: {
				id: '4',
				name: 'Player4',
				team: 'team2',
				tichu: false,
				grandTichu: false,
				deals: false,
			},
		}) as FourPlayerGameState;
	},
	reducers: {
		tichuOrGrand: (
			state: Draft<FourPlayerGameState>,
			action: PayloadAction<{
				id: string;
				tichu: boolean;
				grandTichu: boolean;
			}>,
		) => {
			const player: GamePlayer | undefined = getPlayerById(
				state,
				action.payload.id,
			);
			if (player == undefined) {
				throw new Error(`Couldn't find player with id: ${action.payload.id}.`);
			}
			player.tichu = action.payload.tichu;
			player.grandTichu = action.payload.grandTichu;
		},
		newPlayerDeals: (
			state: Draft<FourPlayerGameState>,
			action: PayloadAction<{ newId: string }>,
		) => {
			const allPlayers = getAllPlayers(state);
			for (const player of allPlayers) {
				player.deals = false;
			}
			const newPlayer = getPlayerById(state, action.payload.newId);
			if (newPlayer == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.newId}.`,
				);
			}
			newPlayer.deals = true;
		},
		replacePlayer: (
			state: Draft<FourPlayerGameState>,
			action: PayloadAction<{
				playerToRemoveId: string;
				newPlayer: { id: string; name: string };
			}>,
		) => {
			const playerToRemove = getPlayerById(
				state,
				action.payload.playerToRemoveId,
			);
			if (playerToRemove == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.playerToRemoveId}.`,
				);
			}
			let newPlayer = getPlayerById(state, action.payload.newPlayer.id);
			if (newPlayer != undefined) {
				const indexToAddNewPlayer: PlayerIndex | undefined =
					getIndexOfPlayer(state, playerToRemove.id);
				const indexToAddOldPlayer: PlayerIndex | undefined =
					getIndexOfPlayer(state, newPlayer.id);
				if (
					indexToAddNewPlayer == undefined ||
					indexToAddOldPlayer == undefined
				) {
					throw new Error(`Internal Error`);
				}
				state[indexToAddOldPlayer] = playerToRemove;
				state[indexToAddNewPlayer] = newPlayer;
			} else {
				newPlayer = {
					id: action.payload.newPlayer.id,
					name: action.payload.newPlayer.name,
					team: playerToRemove.team,
					tichu: playerToRemove.tichu,
					grandTichu: playerToRemove.grandTichu,
					deals: playerToRemove.deals,
				};
				const playerToReplaceIndex: PlayerIndex | undefined =
					getIndexOfPlayer(state, action.payload.playerToRemoveId);
				if (playerToReplaceIndex == undefined) {
					throw new Error(`Internal Error`);
				}
				state[playerToReplaceIndex] = newPlayer;
			}
		},
	},
});

function getAllPlayers(state: FourPlayerGameState): readonly GamePlayer[] {
	return Array.from(Object.values(state));
}

function getPlayerById(
	state: FourPlayerGameState,
	playerId: string,
): GamePlayer | undefined {
	const players: readonly GamePlayer[] = getAllPlayers(state);
	return players.find((player) => player.id === playerId);
}

function getIndexOfPlayer(
	state: FourPlayerGameState,
	playerId: string,
): PlayerIndex | undefined {
	const entries: [string, GamePlayer][] = Array.from(Object.entries(state));
	for (const entry of entries) {
		const playerIndex = entry[0] as PlayerIndex;
		const player = entry[1];
		if (player.id === playerId) {
			return playerIndex;
		}
	}
	return undefined;
}

export const selectGamePlayersRaw = (state: {
	gamePlayers: FourPlayerGameState;
}) => {
	return state.gamePlayers;
};

export const selectGamePlayersInWeirdOrder = (state: {
	gamePlayers: FourPlayerGameState;
}): GamePlayer[] => {
	const players = state.gamePlayers;
	return [players['t1p1'], players['t2p1'], players['t1p2'], players['t2p2']];
};
export const selectPlayerWhoDeals = (state: {
	gamePlayers: FourPlayerGameState;
}): GamePlayer | undefined => {
	const allPlayers = getAllPlayers(state.gamePlayers);
	return allPlayers.find((player) => player.deals);
};
