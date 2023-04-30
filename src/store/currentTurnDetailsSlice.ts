import { z } from 'zod';
import { exhaustiveEnumRecord, getEntries } from '../utils/type-wizards.ts';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { stateFromLocalStorage } from './store.ts';
import { APP_USER_SCHEMA, AppUser } from './usersSlice.ts';

export const PLAYER_INDEX_SCHEMA = z.enum(['t1p1', 't1p2', 't2p1', 't2p2']);
export const TEAM_INDEX_SCHEMA = z.enum(['team1', 'team2']);
const PLAYERS_SCHEMA = exhaustiveEnumRecord(PLAYER_INDEX_SCHEMA, APP_USER_SCHEMA);
const PLAYERS_TICHU_GRAND_TICHU_SCHEMA = exhaustiveEnumRecord(PLAYER_INDEX_SCHEMA, z.object({
	tichu: z.boolean(),
	grandTichu: z.boolean(),
}));
const TEAM_ONE_TWO_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.boolean());
const TEAM_POINTS_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.number());
const TEAM_TOTAL_POINTS_SCHEMA = exhaustiveEnumRecord(TEAM_INDEX_SCHEMA, z.number());

export const PLAYER_WITH_DETAILS_SCHEMA = z.object({
	id: z.string(),
	name: z.string(),
	team: TEAM_INDEX_SCHEMA,
	tichu: z.boolean(),
	grandTichu: z.boolean(),
	deals: z.boolean(),
});

const TEAM_WITH_DETAILS_SCHEMA = z.object({
	teamIndex: TEAM_INDEX_SCHEMA,
	oneTwo: z.boolean(),
	points: z.number(),
	temporaryScore: z.number(),
	totalPointsBeforeThisTurn: z.number(),
});

export const CURRENT_TURN_DETAILS_STATE_SCHEMA = z.object({
	players: PLAYERS_SCHEMA,
	playersTichuGrandTichu: PLAYERS_TICHU_GRAND_TICHU_SCHEMA,
	teamsOneTwo: TEAM_ONE_TWO_SCHEMA,
	teamsPoints: TEAM_POINTS_SCHEMA,
	finishedFirst: APP_USER_SCHEMA,
	playerWhoDeals: PLAYER_INDEX_SCHEMA,
	temporaryScore: TEAM_TOTAL_POINTS_SCHEMA,
	totalScore: TEAM_TOTAL_POINTS_SCHEMA,
});
type PlayerIndex = z.infer<typeof PLAYER_INDEX_SCHEMA>;
export type TeamIndex = z.infer<typeof TEAM_INDEX_SCHEMA>;
export type CurrentTurnDetailsState = z.infer<typeof CURRENT_TURN_DETAILS_STATE_SCHEMA>;
type Players = z.infer<typeof PLAYERS_SCHEMA>;
type OneTwo = z.infer<typeof TEAM_ONE_TWO_SCHEMA>;
type Points = z.infer<typeof TEAM_POINTS_SCHEMA>;
type PlayersTichuGrandTichu = z.infer<typeof PLAYERS_TICHU_GRAND_TICHU_SCHEMA>;
type PlayerWithDetails = z.infer<typeof PLAYER_WITH_DETAILS_SCHEMA>;
type TeamWithDetails = z.infer<typeof TEAM_WITH_DETAILS_SCHEMA>;
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
				team1: 50,
				team2: 50,
			},
			finishedFirst: {
				id: '1',
				name: 'Player1',
			},
			playerWhoDeals: 't1p1',
			temporaryScore: {
				team1: 50,
				team2: 50,
			},
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
			updateTemporaryScore(state);
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
			} else {
				const playerToReplaceIndex: PlayerIndex | undefined =
					getIndexOfPlayer(state, action.payload.playerToRemoveId);
				if (playerToReplaceIndex == undefined) {
					throw new Error(`Internal Error`);
				}
				state.players[playerToReplaceIndex] = action.payload.newPlayer;
				state.playerWhoDeals = playerToReplaceIndex;
				state.finishedFirst = action.payload.newPlayer;
			}
			updateTemporaryScore(state);
		},
		teamOneTwo: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{
			[team in TeamIndex]: boolean
		}>) => {
			let teamThatDidOneTwoIndex: TeamIndex | undefined;
			for (const [teamIndex, enabled] of getEntries(action.payload)) {
				state.teamsOneTwo[teamIndex] = enabled;
				if (enabled) {
					teamThatDidOneTwoIndex = teamIndex;
				}
			}
			if (teamThatDidOneTwoIndex != undefined) {
				const finishedFirst = state.finishedFirst;
				const playersOfTeam = getPlayersOfTeam(teamThatDidOneTwoIndex, state);
				if (!playersOfTeam.map(p => p.id).includes(finishedFirst.id)) {
					const firstPlayer = playersOfTeam[0];
					if (firstPlayer == undefined) {
						throw new Error('');
					}
					state.finishedFirst = firstPlayer;
				}
			}
			updateTemporaryScore(state);
		},
		teamPoints: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{ team: TeamIndex, points: number }>) => {
			const otherTeamIndex = otherTeam(action.payload.team, state.teamsPoints);
			state.teamsPoints[action.payload.team] = action.payload.points;
			state.teamsPoints[otherTeamIndex] = 100 - action.payload.points;
			updateTemporaryScore(state);
		},
		finishedFirst: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{ playerId: string }>) => {
			const player = getPlayerById(state, action.payload.playerId);
			if (player == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.playerId}.`,
				);
			}
			state.finishedFirst = player;
			updateTemporaryScore(state);
		},
	},
});


function updateTemporaryScore(state: CurrentTurnDetailsState): void {
	state.temporaryScore.team1 = state.totalScore.team1 + calculateScoreOfTeam('team1', state);
	state.temporaryScore.team2 = state.totalScore.team2 + calculateScoreOfTeam('team2', state);
}

function calculateScoreOfTeam(teamToCheck: TeamIndex, state: CurrentTurnDetailsState): number {
	let scoreToAdd = 0;
	for (const [teamIndex, oneTwo] of getEntries(state.teamsOneTwo)) {
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
	scoreToAdd += applyTichuGrandTichuScore(state.playersTichuGrandTichu, state.players, teamToCheck, state.finishedFirst.id);
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
		if (teamIndex === teamToCheck) {
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

function getPlayersOfTeam(team: TeamIndex, state: CurrentTurnDetailsState): AppUser[] {
	return getEntries(state.players)
		.filter((r) => playerBelongsToTeam(team, r))
		.map(([, r]) => r);
}

function getTeamOfPlayer(player: AppUser, players: Players): TeamIndex {
	const p = getEntries(players).find(([, pl]) => pl.id === player.id);
	if (p == undefined) {
		throw new Error('Internal Error');
	}
	const playerIndex = p[0];
	if (['t1p1', 't1p2'].includes(playerIndex)) {
		return 'team1';
	}
	if (['t2p1', 't2p2'].includes(playerIndex)) {
		return 'team2';
	}
	throw new Error('Internal Error');
}

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

export const selectGamePlayersInWeirdOrder = (state: { currentTurnDetails: CurrentTurnDetailsState }): AppUser[] => {
	const players = state.currentTurnDetails.players;
	return [players['t1p1'], players['t2p1'], players['t1p2'], players['t2p2']];
};

export const selectPlayerWhoDeals = (state: { currentTurnDetails: CurrentTurnDetailsState }): AppUser => {
	return state.currentTurnDetails.players[state.currentTurnDetails.playerWhoDeals];
};

export const getPlayersTichuGrandTichu = (state: {
	currentTurnDetails: CurrentTurnDetailsState
}): PlayersTichuGrandTichu => {
	return state.currentTurnDetails.playersTichuGrandTichu;
};
export const selectFinishedFirstPlayer = (state: { currentTurnDetails: CurrentTurnDetailsState }): AppUser => {
	return state.currentTurnDetails.finishedFirst;
};
export const selectPlayersWithDetails = (state: {
	currentTurnDetails: CurrentTurnDetailsState
}): PlayerWithDetails[] => {
	const playersWithDetails: PlayerWithDetails[] = [];
	for (const [playerIndex, player] of getEntries(state.currentTurnDetails.players)) {
		const tichuGrandTichu = state.currentTurnDetails.playersTichuGrandTichu[playerIndex];
		const deals = state.currentTurnDetails.playerWhoDeals === playerIndex;
		playersWithDetails.push({
			id: player.id,
			name: player.name,
			team: getTeamOfPlayer(player, state.currentTurnDetails.players),
			tichu: tichuGrandTichu.tichu,
			grandTichu: tichuGrandTichu.grandTichu,
			deals,
		});
	}
	return playersWithDetails;
};

export const selectTeamsWithDetails = (state: { currentTurnDetails: CurrentTurnDetailsState }): TeamWithDetails[] => {
	const teamsWithDetails: TeamWithDetails[] = [];
	for (const [teamIndex, oneTwo] of getEntries(state.currentTurnDetails.teamsOneTwo)) {
		const points = state.currentTurnDetails.teamsPoints[teamIndex];
		const temporaryScore = state.currentTurnDetails.temporaryScore[teamIndex];
		const totalPointsBeforeThisTurn = state.currentTurnDetails.totalScore[teamIndex];
		teamsWithDetails.push({
			teamIndex,
			oneTwo,
			points,
			temporaryScore,
			totalPointsBeforeThisTurn,
		});
	}
	return teamsWithDetails;
};

export const selectPoints = (state: { currentTurnDetails: CurrentTurnDetailsState }) => {
	return {
		team1: {
			points: state.currentTurnDetails.teamsPoints['team1'],
			totalPoints: state.currentTurnDetails.totalScore['team1'],
		},
		team2: {
			points: state.currentTurnDetails.teamsPoints['team2'],
			totalPoints: state.currentTurnDetails.totalScore['team2'],
		},
	};
};

export const selectPlayersAvailableForFirstPlace = (state: {
	currentTurnDetails: CurrentTurnDetailsState
}): AppUser[] => {
	for (const [teamIndex, oneTwo] of getEntries(state.currentTurnDetails.teamsOneTwo)) {
		if (oneTwo) {
			return getPlayersOfTeam(teamIndex, state.currentTurnDetails);
		}
	}
	return getEntries(state.currentTurnDetails.players).map(([, r]) => r);
};