import { getEntries } from '../utils/type-wizards.ts';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AppUser } from './usersSlice.ts';
import { InternalError } from '../error/InternalError.ts';
import { GlobalState } from './store.ts';

export type PlayerIndex = 't1p1' | 't1p2' | 't2p1' | 't2p2';
export type TeamIndex = 'team1' | 'team2';
type Players = { [key in PlayerIndex]: AppUser }
type PlayersTichuGrandTichu = { [key in PlayerIndex]: { tichu: boolean, grandTichu: boolean } };
type OneTwo = { [key in TeamIndex]: boolean };
type Points = { [key in TeamIndex]: number };
type TeamTotalPoints = { [key in TeamIndex]: number; }
export type PlayerWithDetails = {
	id: string,
	name: string,
	team: TeamIndex,
	tichu: boolean,
	grandTichu: boolean,
	deals: boolean
}
type TeamWithDetails = {
	teamIndex: TeamIndex,
	oneTwo: boolean,
	points: number,
	temporaryScore: number,
	totalPointsBeforeThisTurn: number
}
export type CurrentTurnDetailsState = {
	players: Players,
	playersTichuGrandTichu: PlayersTichuGrandTichu,
	teamsOneTwo: OneTwo,
	teamsPoints: Points,
	finishedFirst: AppUser,
	playerWhoDeals: PlayerIndex,
	temporaryScore: TeamTotalPoints,
	totalScore: TeamTotalPoints,
}
const initialState: CurrentTurnDetailsState = {

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
};
export const currentTurnDetailsSlice = createSlice({
	name: 'currentTurnDetails',
	initialState,
	reducers: {
		newPlayerDeals: (
			state: Draft<CurrentTurnDetailsState>,
			action: PayloadAction<{ newId: string }>,
		) => {
			const playerIndex = HELPERS.getIndexOfPlayer(state, action.payload.newId);
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
			const playerIndex: PlayerIndex | undefined = HELPERS.getIndexOfPlayer(
				state,
				action.payload.playerId,
			);
			if (playerIndex == undefined) {
				throw new Error(`Couldn't find player with id: ${action.payload.playerId}.`);
			}
			const tichuGrandTichu = state.playersTichuGrandTichu[playerIndex];
			tichuGrandTichu.tichu = action.payload.tichu;
			tichuGrandTichu.grandTichu = action.payload.grandTichu;
			HELPERS.updateTemporaryScore(state);
		},
		replacePlayer: (
			state: Draft<CurrentTurnDetailsState>,
			action: PayloadAction<{
				playerToRemoveId: string;
				newPlayer: AppUser;
			}>,
		) => {
			const playerToRemove = HELPERS.getPlayerById(
				state,
				action.payload.playerToRemoveId,
			);
			if (playerToRemove == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.playerToRemoveId}.`,
				);
			}
			const newPlayerIsInGame = HELPERS.getPlayerById(state, action.payload.newPlayer.id) != undefined;
			if (newPlayerIsInGame) {
				const indexToAddNewPlayer: PlayerIndex | undefined =
					HELPERS.getIndexOfPlayer(state, playerToRemove.id);
				const indexToAddOldPlayer: PlayerIndex | undefined =
					HELPERS.getIndexOfPlayer(state, action.payload.newPlayer.id);
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
					HELPERS.getIndexOfPlayer(state, action.payload.playerToRemoveId);
				if (playerToReplaceIndex == undefined) {
					throw new InternalError();
				}
				state.players[playerToReplaceIndex] = action.payload.newPlayer;
				state.playerWhoDeals = playerToReplaceIndex;
				state.finishedFirst = action.payload.newPlayer;
			}
			HELPERS.updateTemporaryScore(state);
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
				const playersOfTeam = HELPERS.getPlayersOfTeam(teamThatDidOneTwoIndex, state);
				if (!playersOfTeam.map(p => p.id).includes(finishedFirst.id)) {
					const firstPlayer = playersOfTeam[0];
					if (firstPlayer == undefined) {
						throw new Error('');
					}
					state.finishedFirst = firstPlayer;
				}
			}
			HELPERS.updateTemporaryScore(state);
		},
		teamPoints: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{ team: TeamIndex, points: number }>) => {
			const otherTeamIndex = HELPERS.otherTeam(action.payload.team, state.teamsPoints);
			state.teamsPoints[action.payload.team] = action.payload.points;
			state.teamsPoints[otherTeamIndex] = 100 - action.payload.points;
			HELPERS.updateTemporaryScore(state);
		},
		finishedFirst: (state: Draft<CurrentTurnDetailsState>, action: PayloadAction<{ playerId: string }>) => {
			const player = HELPERS.getPlayerById(state, action.payload.playerId);
			if (player == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.playerId}.`,
				);
			}
			state.finishedFirst = player;
			HELPERS.updateTemporaryScore(state);
		},
	},
});


const HELPERS = {
	otherTeam: (team: TeamIndex, collection: { [t in TeamIndex]: unknown }): TeamIndex => {
		const otherTeamIndex: TeamIndex | undefined = Object.keys(collection).find(teamIndex => teamIndex !== team) as (TeamIndex | undefined);
		if (otherTeamIndex == undefined) {
			throw new Error('Internal error');
		}
		return otherTeamIndex;
	},
	getIndexOfPlayer: (state: CurrentTurnDetailsState, playerId: string): PlayerIndex | undefined => {
		const entries: [PlayerIndex, AppUser][] = getEntries(state.players);
		for (const [playerIndex, player] of entries) {
			if (player.id === playerId) {
				return playerIndex;
			}
		}
		return undefined;
	},
	getPlayerById: (state: CurrentTurnDetailsState, playerId: string): AppUser | undefined => {
		const players: readonly AppUser[] = HELPERS.getAllPlayers(state);
		return players.find((player) => player.id === playerId);
	},
	getAllPlayers: (state: CurrentTurnDetailsState): readonly AppUser[] => {
		return Array.from(Object.values(state.players));
	},
	playerWithSameId: (playerIndex: PlayerIndex, player: [string, unknown]): boolean => {
		return player[0] === playerIndex;
	},
	getTeamOfPlayer: (player: AppUser, players: Players): TeamIndex => {
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
	},
	getPlayersOfTeam: (team: TeamIndex, state: CurrentTurnDetailsState): AppUser[] => {
		return getEntries(state.players)
			.filter((r) => HELPERS.playerBelongsToTeam(team, r))
			.map(([, r]) => r);
	},
	playerBelongsToTeam: (team: TeamIndex, player: [string, unknown]): boolean => {
		const playerIndex = player[0];
		if (team === 'team1') {
			return ['t1p1', 't1p2'].includes(playerIndex);
		}
		if (team === 'team2') {
			return ['t2p1', 't2p2'].includes(playerIndex);
		}
		throw new Error('Internal Error');
	},
	updateTemporaryScore: (state: CurrentTurnDetailsState): void => {
		state.temporaryScore.team1 = state.totalScore.team1 + HELPERS.POINTS_CALCULATION.calculateScoreOfTeam('team1', state);
		state.temporaryScore.team2 = state.totalScore.team2 + HELPERS.POINTS_CALCULATION.calculateScoreOfTeam('team2', state);
	},
	POINTS_CALCULATION: {
		calculateScoreOfTeam: (teamToCheck: TeamIndex, state: CurrentTurnDetailsState): number => {
			let scoreToAdd = 0;
			for (const [teamIndex, oneTwo] of getEntries(state.teamsOneTwo)) {
				if (teamToCheck !== teamIndex) {
					if (oneTwo) {
						scoreToAdd += HELPERS.POINTS_CALCULATION.applyTichuGrandTichuScore(state.playersTichuGrandTichu, state.players, teamToCheck, state.finishedFirst.id);
						scoreToAdd += HELPERS.POINTS_CALCULATION.applyOneTwo(state.teamsOneTwo, teamToCheck);
						return scoreToAdd;
					}
					continue;
				}
				if (oneTwo) {
					scoreToAdd += HELPERS.POINTS_CALCULATION.applyTichuGrandTichuScore(state.playersTichuGrandTichu, state.players, teamToCheck, state.finishedFirst.id);
					scoreToAdd += HELPERS.POINTS_CALCULATION.applyOneTwo(state.teamsOneTwo, teamToCheck);
					return scoreToAdd;
				}
			}
			scoreToAdd += HELPERS.POINTS_CALCULATION.applyPointsScore(state.teamsPoints, teamToCheck);
			scoreToAdd += HELPERS.POINTS_CALCULATION.applyTichuGrandTichuScore(state.playersTichuGrandTichu, state.players, teamToCheck, state.finishedFirst.id);
			return scoreToAdd;
		},
		applyPointsScore: (pointsPerTeam: Points, teamToCheck: TeamIndex): number => {
			return pointsPerTeam[teamToCheck];
		},
		applyOneTwo: (oneTwoPerTeam: OneTwo, teamToCheck: TeamIndex): number => {
			const entries = getEntries(oneTwoPerTeam);
			for (const [teamIndex, oneTwo] of entries) {
				if (teamIndex === teamToCheck) {
					if (oneTwo) {
						return 200;
					}
				}
			}
			return 0;
		},
		applyTichuGrandTichuScore: (
			tichuGrandTichuPerPlayer: PlayersTichuGrandTichu,
			players: Players,
			teamIndex: TeamIndex,
			finishedFirstId: string,
		): number => {
			const playersOfTeamToCheck = getEntries(tichuGrandTichuPerPlayer).filter(entry => HELPERS.playerBelongsToTeam(teamIndex, entry));
			let score = 0;
			for (const [playerIndex, details] of playersOfTeamToCheck) {
				const playerEntry = getEntries(players).find(r => HELPERS.playerWithSameId(playerIndex, r));
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
		},
	},

} as const;

export const CURRENT_TURN_DETAILS_SELECTORS = {
	playersAvailableForFirstPlace: (state: GlobalState): AppUser[] => {
		for (const [teamIndex, oneTwo] of getEntries(state.currentTurnDetails.teamsOneTwo)) {
			if (oneTwo) {
				return HELPERS.getPlayersOfTeam(teamIndex, state.currentTurnDetails);
			}
		}
		return getEntries(state.currentTurnDetails.players).map(([, r]) => r);
	},
	points: (state: GlobalState) => {
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
	},
	playersWithDetails: (state: GlobalState): PlayerWithDetails[] => {
		const playersWithDetails: PlayerWithDetails[] = [];
		for (const [playerIndex, player] of getEntries(state.currentTurnDetails.players)) {
			const tichuGrandTichu = state.currentTurnDetails.playersTichuGrandTichu[playerIndex];
			const deals = state.currentTurnDetails.playerWhoDeals === playerIndex;
			playersWithDetails.push({
				id: player.id,
				name: player.name,
				team: HELPERS.getTeamOfPlayer(player, state.currentTurnDetails.players),
				tichu: tichuGrandTichu.tichu,
				grandTichu: tichuGrandTichu.grandTichu,
				deals,
			});
		}
		return playersWithDetails;
	},
	teamsWithDetails: (state: GlobalState): TeamWithDetails[] => {
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
	},
	finishedFirstPlayer: (state: GlobalState): AppUser => {
		return state.currentTurnDetails.finishedFirst;
	},
	playerWhoDeals: (state: GlobalState): AppUser => {
		return state.currentTurnDetails.players[state.currentTurnDetails.playerWhoDeals];
	},
	gamePlayersInWeirdOrder: (state: GlobalState): AppUser[] => {
		const players = state.currentTurnDetails.players;
		return [players['t1p1'], players['t2p1'], players['t1p2'], players['t2p2']];
	},
} as const;
export const CURRENT_TURN_DETAILS_WEIRD_SELECTORS = {} as const;
