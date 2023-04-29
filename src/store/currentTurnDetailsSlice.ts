import { z } from 'zod';
import { exhaustiveEnumRecord, getEntries } from '../utils/type-wizards.ts';
import { GamePlayer, PLAYER_INDEX_SCHEMA, PlayerIndex, TEAM_INDEX_SCHEMA, TeamIndex } from './gamePlayersSlice.ts';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { stateFromLocalStorage } from './store.ts';
import { APP_USER_SCHEMA, AppUser } from './usersSlice.ts';

const PLAYERS_SCHEMA = exhaustiveEnumRecord(PLAYER_INDEX_SCHEMA, APP_USER_SCHEMA);
const PLAYERS_TICHU_GRAND_TICHU_SCHEMA = exhaustiveEnumRecord(PLAYER_INDEX_SCHEMA, z.object({
	tichu: z.boolean(),
	grandTichu: z.boolean(),
}));
const TEAM_ONE_TWO_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.boolean());
const TEAM_POINTS_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.number());
const TEAM_TOTAL_POINTS_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.number());

export const CURRENT_TURN_DETAILS_STATE_SCHEMA = z.object({
	players: PLAYERS_SCHEMA,
	playersTichuGrandTichu: PLAYERS_TICHU_GRAND_TICHU_SCHEMA,
	teamsOneTwo: TEAM_ONE_TWO_SCHEMA,
	teamsPoints: TEAM_POINTS_SCHEMA,
	finishedFirst: APP_USER_SCHEMA,
	playerWhoDeals: PLAYER_INDEX_SCHEMA,
	totalScore: TEAM_TOTAL_POINTS_SCHEMA,
});

export type CurrentTurnDetailsState = z.infer<typeof CURRENT_TURN_DETAILS_STATE_SCHEMA>;
type Players = z.infer<typeof PLAYERS_SCHEMA>;
type OneTwo = z.infer<typeof TEAM_ONE_TWO_SCHEMA>;
type Points = z.infer<typeof TEAM_POINTS_SCHEMA>;
type PlayersTichuGrandTichu = z.infer<typeof PLAYERS_TICHU_GRAND_TICHU_SCHEMA>;
export const currentTurnDetailsSlice = createSlice({
	name: 'currentTurnDetails',
	initialState: () => {
		return stateFromLocalStorage('currentTurnDetails', {
			players: {
				t1p1: {
					id: '1',
					name: 'Player1',
				},
				t1p2: {
					id: '3',
					name: 'Player3',
				},
				t2p1: {
					id: '2',
					name: 'Player2',
				},
				t2p2: {
					id: '4',
					name: 'Player4',
				},
			},
			playersTichuGrandTichu: {
				t1p1: {
					tichu: false,
					grandTichu: false,
				},
				t1p2: {
					tichu: false,
					grandTichu: false,
				},
				t2p1: {
					tichu: false,
					grandTichu: false,
				},
				t2p2: {
					tichu: false,
					grandTichu: false,
				},
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: {
				id: '1',
				name: 'Player1',
			},
			playerWhoDeals: 't1p1',
			totalScore: {
				team1: 0,
				team2: 0,
			},
		}) as CurrentTurnDetailsState;
	},
	reducers: {
		newPlayerDeals: (
			state: Draft<CurrentTurnDetailsState>,
			action: PayloadAction<{ newId: string }>,
		) => {
			const playerIndex = getIndexOfPlayer(state, action.payload.newId);
			if (playerIndex == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.newId}.`,
				);
			}
			state.playerWhoDeals = playerIndex;
		},
		tichuOrGrand: (
			state: Draft<CurrentTurnDetailsState>,
			action: PayloadAction<{
				playerId: string;
				tichu: boolean;
				grandTichu: boolean;
			}>,
		) => {
			const playerIndex: PlayerIndex | undefined = getIndexOfPlayer(
				state,
				action.payload.playerId,
			);
			if (playerIndex == undefined) {
				throw new Error(`Couldn't find player with id: ${action.payload.playerId}.`);
			}
			const tichuGrandTichu = state.playersTichuGrandTichu[playerIndex];
			tichuGrandTichu.tichu = action.payload.tichu;
			tichuGrandTichu.grandTichu = action.payload.grandTichu;
		},
		replacePlayer: (
			state: Draft<CurrentTurnDetailsState>,
			action: PayloadAction<{
				playerToRemoveId: string;
				newPlayer: AppUser;
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
			const newPlayerIsInGame = getPlayerById(state, action.payload.newPlayer.id) != undefined;
			if (newPlayerIsInGame) {
				const indexToAddNewPlayer: PlayerIndex | undefined =
					getIndexOfPlayer(state, playerToRemove.id);
				const indexToAddOldPlayer: PlayerIndex | undefined =
					getIndexOfPlayer(state, action.payload.newPlayer.id);
				if (
					indexToAddNewPlayer == undefined ||
					indexToAddOldPlayer == undefined
				) {
					throw new Error(`Internal Error`);
				}
				state.players[indexToAddOldPlayer] = playerToRemove;
				state.players[indexToAddNewPlayer] = action.payload.newPlayer;
				// const oldPlayerTeam = newPlayer.team;
				// const newPlayerTeam = playerToRemove.team;
				// playerToRemove.team = oldPlayerTeam;
				// newPlayer.team = newPlayerTeam;
				// state[indexToAddOldPlayer] = playerToRemove;
				// state[indexToAddNewPlayer] = newPlayer;
			} else {
				// newPlayer = {
				// 	id: action.payload.newPlayer.id,
				// 	name: action.payload.newPlayer.name,
				// 	team: playerToRemove.team,
				// 	tichu: playerToRemove.tichu,
				// 	grandTichu: playerToRemove.grandTichu,
				// 	deals: playerToRemove.deals,
				// };
				const playerToReplaceIndex: PlayerIndex | undefined =
					getIndexOfPlayer(state, action.payload.playerToRemoveId);
				if (playerToReplaceIndex == undefined) {
					throw new Error(`Internal Error`);
				}
				state.players[playerToReplaceIndex] = action.payload.newPlayer;
				state.playerWhoDeals = playerToReplaceIndex;
			}
		},
		teamOneTwo: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{
			team: TeamIndex,
			enabled: boolean
		}>) => {
			const otherTeamIndex = otherTeam(action.payload.team, state.teamsOneTwo);
			state.teamsOneTwo[action.payload.team] = action.payload.enabled;
			state.teamsOneTwo[otherTeamIndex] = !action.payload.enabled;
			updateTotalScore(state);
		},
		teamPoints: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{ team: TeamIndex, points: number }>) => {
			const otherTeamIndex = otherTeam(action.payload.team, state.teamsPoints);
			state.teamsPoints[action.payload.team] = action.payload.points;
			state.teamsPoints[otherTeamIndex] = 100 - action.payload.points;
			updateTotalScore(state);
		},
		finishedFirst: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{ player: GamePlayer }>) => {
			state.finishedFirst = action.payload.player;
			updateTotalScore(state);
		},
	},
});


function updateTotalScore(state: CurrentTurnDetailsState): void {
	state.totalScore.team1 = calculateScoreOfTeam('team1', state);
	state.totalScore.team2 = calculateScoreOfTeam('team2', state);
}

function calculateScoreOfTeam(teamToCheck: TeamIndex, state: CurrentTurnDetailsState): number {
	let scoreToAdd = 0;
	const entries = getEntries(state.teamsOneTwo);
	for (const [teamIndex, oneTwo] of entries) {
		if (teamToCheck !== teamIndex) {
			if (oneTwo) {
				scoreToAdd += applyTichuGrandTichuScore(state.playersTichuGrandTichu, state.players, teamToCheck, state.finishedFirst.id);
				scoreToAdd += applyOneTwo(state.teamsOneTwo, teamToCheck);
				return scoreToAdd;
			}
			continue;
		}
		if (oneTwo) {
			scoreToAdd += applyTichuGrandTichuScore(state.playersTichuGrandTichu, state.players, teamToCheck, state.finishedFirst.id);
			scoreToAdd += applyOneTwo(state.teamsOneTwo, teamToCheck);
			return scoreToAdd;
		}
	}
	scoreToAdd += applyPointsScore(state.teamsPoints, teamToCheck);
	scoreToAdd += applyOneTwo(state.teamsOneTwo, teamToCheck);
	return scoreToAdd;
}

function applyTichuGrandTichuScore(
	tichuGrandTichuPerPlayer: PlayersTichuGrandTichu,
	players: Players,
	teamIndex: TeamIndex,
	finishedFirstId: string,
): number {
	const playersOfTeamToCheck = getEntries(tichuGrandTichuPerPlayer).filter(entry => playerBelongsToTeam(teamIndex, entry));
	let score = 0;
	for (const [playerIndex, details] of playersOfTeamToCheck) {
		const playerEntry = getEntries(players).find(r => playerWithSameId(playerIndex, r));
		if (playerEntry == undefined) {
			throw new Error('Internal Error');
		}
		const player = playerEntry[1];
		if (details.tichu) {
			if (player.id === finishedFirstId) {
				score += 100;
				continue;
			}
			score -= 100;
		}
		if (details.grandTichu) {
			if (player.id === finishedFirstId) {
				score += 200;
				continue;
			}
			score -= 200;
		}
	}
	return score;
}

function applyOneTwo(
	oneTwoPerTeam: OneTwo,
	teamToCheck: TeamIndex,
): number {
	const entries = getEntries(oneTwoPerTeam);
	for (const [teamIndex, oneTwo] of entries) {
		if (teamIndex !== teamToCheck) {
			if (oneTwo) {
				return 200;
			}
		}
	}
	return 0;
}

function applyPointsScore(
	pointsPerTeam: Points,
	teamToCheck: TeamIndex,
): number {
	return pointsPerTeam[teamToCheck];
}

function playerBelongsToTeam(team: TeamIndex, player: [string, unknown]): boolean {
	const playerIndex = player[0];
	if (team === 'team1') {
		return ['t1p1', 't1p2'].includes(playerIndex);
	}
	if (team === 'team2') {
		return ['t2p1', 't2p2'].includes(playerIndex);
	}
	throw new Error('Internal Error');
}

// function getTeamOfPlayer(player: AppUser, players: Players): TeamIndex {
// 	const p = getEntries(players).find(([_, pl]) => pl.id === player.id);
// 	if (p == undefined) {
// 		throw new Error('Internal Error');
// 	}
// 	const playerIndex = p[0];
// 	if (['t1p1', 't1p2'].includes(playerIndex)) {
// 		return 'team1';
// 	}
// 	if (['t2p1', 't2p2'].includes(playerIndex)) {
// 		return 'team2';
// 	}
// 	throw new Error('Internal Error');
// }

function playerWithSameId(playerIndex: PlayerIndex, player: [string, unknown]): boolean {
	return player[0] === playerIndex;
}

function getAllPlayers(state: CurrentTurnDetailsState): readonly AppUser[] {
	return Array.from(Object.values(state.players));
}

function getPlayerById(
	state: CurrentTurnDetailsState,
	playerId: string,
): AppUser | undefined {
	const players: readonly AppUser[] = getAllPlayers(state);
	return players.find((player) => player.id === playerId);
}

function getIndexOfPlayer(
	state: CurrentTurnDetailsState,
	playerId: string,
): PlayerIndex | undefined {
	const entries: [PlayerIndex, AppUser][] = getEntries(state.players);
	for (const [playerIndex, player] of entries) {
		if (player.id === playerId) {
			return playerIndex;
		}
	}
	return undefined;
}

function otherTeam(team: TeamIndex, collection: { [t in TeamIndex]: unknown }): TeamIndex {
	const otherTeamIndex: TeamIndex | undefined = Object.keys(collection).find(teamIndex => teamIndex !== team) as (TeamIndex | undefined);
	if (otherTeamIndex == undefined) {
		throw new Error('Internal error');
	}
	return otherTeamIndex;
}
