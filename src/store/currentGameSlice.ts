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
type TeamScore = { [key in TeamIndex]: number; }
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
export type TurnDetails = {
	players: Players,
	playersTichuGrandTichu: PlayersTichuGrandTichu,
	teamsOneTwo: OneTwo,
	teamsPoints: Points,
	finishedFirst: AppUser,
	playerWhoDeals: PlayerIndex,
	score: TeamScore,
}
export type CurrentGameState = {
	turns: TurnDetails[],
	currentScore: TeamScore,
	winningScore: 300 | 500 | 1000 | 1500 | 2000 | 'unlimited',
}
const initialTurnDetails: TurnDetails = {
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
	score: {
		team1: 50,
		team2: 50,
	},
};
const initialState: CurrentGameState = {
	turns: [initialTurnDetails],
	currentScore: {
		team1: 0,
		team2: 0,
	},
	winningScore: 500,
};
export const currentGameSlice = createSlice({
	name: 'currentGame',
	initialState,
	reducers: {
		newPlayerDeals: (
			state: Draft<CurrentGameState>,
			action: PayloadAction<{ newId: string }>,
		) => {
			const latestTurn = HELPERS.getLatestTurn(state);
			const playerIndex = HELPERS.getIndexOfPlayer(latestTurn, action.payload.newId);
			if (playerIndex == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.newId}.`,
				);
			}
			latestTurn.playerWhoDeals = playerIndex;
		},
		tichuOrGrand: (
			state: Draft<CurrentGameState>,
			action: PayloadAction<{
				playerId: string;
				tichu: boolean;
				grandTichu: boolean;
			}>,
		) => {
			const latestTurn = HELPERS.getLatestTurn(state);
			const playerIndex: PlayerIndex | undefined = HELPERS.getIndexOfPlayer(
				latestTurn,
				action.payload.playerId,
			);
			if (playerIndex == undefined) {
				throw new Error(`Couldn't find player with id: ${action.payload.playerId}.`);
			}
			const tichuGrandTichu = latestTurn.playersTichuGrandTichu[playerIndex];
			tichuGrandTichu.tichu = action.payload.tichu;
			tichuGrandTichu.grandTichu = action.payload.grandTichu;
			HELPERS.updateTurnPoints(state, latestTurn);
		},
		replacePlayer: (
			state: Draft<CurrentGameState>,
			action: PayloadAction<{
				playerToRemoveId: string;
				newPlayer: AppUser;
			}>,
		) => {
			const latestTurn = HELPERS.getLatestTurn(state);
			const playerToRemove = HELPERS.getPlayerById(
				latestTurn,
				action.payload.playerToRemoveId,
			);
			if (playerToRemove == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.playerToRemoveId}.`,
				);
			}
			const newPlayerIsInGame = HELPERS.getPlayerById(latestTurn, action.payload.newPlayer.id) != undefined;
			if (newPlayerIsInGame) {
				const indexToAddNewPlayer: PlayerIndex | undefined =
					HELPERS.getIndexOfPlayer(latestTurn, playerToRemove.id);
				const indexToAddOldPlayer: PlayerIndex | undefined =
					HELPERS.getIndexOfPlayer(latestTurn, action.payload.newPlayer.id);
				if (
					indexToAddNewPlayer == undefined ||
					indexToAddOldPlayer == undefined
				) {
					throw new Error(`Internal Error`);
				}
				latestTurn.players[indexToAddOldPlayer] = playerToRemove;
				latestTurn.players[indexToAddNewPlayer] = action.payload.newPlayer;
			} else {
				const playerToReplaceIndex: PlayerIndex | undefined =
					HELPERS.getIndexOfPlayer(latestTurn, action.payload.playerToRemoveId);
				if (playerToReplaceIndex == undefined) {
					throw new InternalError();
				}
				latestTurn.players[playerToReplaceIndex] = action.payload.newPlayer;
				latestTurn.playerWhoDeals = playerToReplaceIndex;
			}
			latestTurn.finishedFirst = action.payload.newPlayer;
			HELPERS.updateTurnPoints(state, latestTurn);
		},
		teamOneTwo: (state: Draft<CurrentGameState>, action: PayloadAction<{
			[team in TeamIndex]: boolean
		}>) => {
			const latestTurn = HELPERS.getLatestTurn(state);
			let teamThatDidOneTwoIndex: TeamIndex | undefined;
			for (const [teamIndex, enabled] of getEntries(action.payload)) {
				latestTurn.teamsOneTwo[teamIndex] = enabled;
				if (enabled) {
					teamThatDidOneTwoIndex = teamIndex;
				}
			}
			if (teamThatDidOneTwoIndex != undefined) {
				const finishedFirst = latestTurn.finishedFirst;
				const playersOfTeam = HELPERS.getPlayersOfTeam(teamThatDidOneTwoIndex, latestTurn);
				if (!playersOfTeam.map(p => p.id).includes(finishedFirst.id)) {
					const firstPlayer = playersOfTeam[0];
					if (firstPlayer == undefined) {
						throw new Error('');
					}
					latestTurn.finishedFirst = firstPlayer;
				}
			}
			HELPERS.updateTurnPoints(state, latestTurn);
		},
		teamPoints: (state: Draft<CurrentGameState>, action: PayloadAction<{ team: TeamIndex, points: number }>) => {
			const latestTurn = HELPERS.getLatestTurn(state);
			const otherTeamIndex = HELPERS.otherTeam(action.payload.team, latestTurn.teamsPoints);
			latestTurn.teamsPoints[action.payload.team] = action.payload.points;
			latestTurn.teamsPoints[otherTeamIndex] = 100 - action.payload.points;
			HELPERS.updateTurnPoints(state, latestTurn);
		},
		finishedFirst: (state: Draft<CurrentGameState>, action: PayloadAction<{ playerId: string }>) => {
			const latestTurn = HELPERS.getLatestTurn(state);
			const player = HELPERS.getPlayerById(latestTurn, action.payload.playerId);
			if (player == undefined) {
				throw new Error(
					`Couldn't find player with id: ${action.payload.playerId}.`,
				);
			}
			latestTurn.finishedFirst = player;
			HELPERS.updateTurnPoints(state, latestTurn);
		},
		submitTurn: (state: Draft<CurrentGameState>) => {
			HELPERS.initNewTurn(state);
			HELPERS.updateTotalPoints(state);
		},
	},
});


const HELPERS = {
	getLatestTurn: (state: CurrentGameState): TurnDetails => {
		if (state.turns.length === 0) {
			throw new InternalError();
		}
		return state.turns[state.turns.length - 1];
	},
	otherTeam: (team: TeamIndex, collection: { [t in TeamIndex]: unknown }): TeamIndex => {
		const otherTeamIndex: TeamIndex | undefined = Object.keys(collection).find(teamIndex => teamIndex !== team) as (TeamIndex | undefined);
		if (otherTeamIndex == undefined) {
			throw new Error('Internal error');
		}
		return otherTeamIndex;
	},
	getIndexOfPlayer: (latestTurn: TurnDetails, playerId: string): PlayerIndex | undefined => {
		const entries: [PlayerIndex, AppUser][] = getEntries(latestTurn.players);
		for (const [playerIndex, player] of entries) {
			if (player.id === playerId) {
				return playerIndex;
			}
		}
		return undefined;
	},
	getPlayerById: (latestTurn: TurnDetails, playerId: string): AppUser | undefined => {
		const players: readonly AppUser[] = HELPERS.getAllPlayers(latestTurn);
		return players.find((player) => player.id === playerId);
	},
	getAllPlayers: (state: TurnDetails): readonly AppUser[] => {
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
	getPlayersOfTeam: (team: TeamIndex, latestTurn: TurnDetails): AppUser[] => {
		return getEntries(latestTurn.players)
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
	updateTurnPoints: (state: CurrentGameState, latestTurn: TurnDetails): void => {
		latestTurn.score.team1 = state.currentScore.team1 + HELPERS.POINTS_CALCULATION.calculateScoreOfTeam('team1', latestTurn);
		latestTurn.score.team2 = state.currentScore.team2 + HELPERS.POINTS_CALCULATION.calculateScoreOfTeam('team2', latestTurn);
	},
	updateTotalPoints: (state: CurrentGameState): void => {
		state.currentScore.team1 = HELPERS.POINTS_CALCULATION.calculateTotalScoreOfTeam('team1', state);
		state.currentScore.team2 = HELPERS.POINTS_CALCULATION.calculateTotalScoreOfTeam('team2', state);
	},
	initNewTurn: (state: CurrentGameState): void => {
		state.turns.push(initialTurnDetails);
	},
	POINTS_CALCULATION: {
		calculateTotalScoreOfTeam: (teamToCheck: TeamIndex, state: CurrentGameState): number => {
			const turns = state.turns;
			if (turns.length <= 1) {
				return 0;
			}
			let score = 0;
			for (let i = 0; i < turns.length - 1; i++) {
				const turn = turns[i];
				score += turn.score[teamToCheck];
			}
			return score;
		},
		calculateScoreOfTeam: (teamToCheck: TeamIndex, latestTurn: TurnDetails): number => {
			let scoreToAdd = 0;
			for (const [teamIndex, oneTwo] of getEntries(latestTurn.teamsOneTwo)) {
				if (teamToCheck !== teamIndex) {
					if (oneTwo) {
						scoreToAdd += HELPERS.POINTS_CALCULATION.applyTichuGrandTichuScore(latestTurn.playersTichuGrandTichu, latestTurn.players, teamToCheck, latestTurn.finishedFirst.id);
						scoreToAdd += HELPERS.POINTS_CALCULATION.applyOneTwo(latestTurn.teamsOneTwo, teamToCheck);
						return scoreToAdd;
					}
					continue;
				}
				if (oneTwo) {
					scoreToAdd += HELPERS.POINTS_CALCULATION.applyTichuGrandTichuScore(latestTurn.playersTichuGrandTichu, latestTurn.players, teamToCheck, latestTurn.finishedFirst.id);
					scoreToAdd += HELPERS.POINTS_CALCULATION.applyOneTwo(latestTurn.teamsOneTwo, teamToCheck);
					return scoreToAdd;
				}
			}
			scoreToAdd += HELPERS.POINTS_CALCULATION.applyPointsScore(latestTurn.teamsPoints, teamToCheck);
			scoreToAdd += HELPERS.POINTS_CALCULATION.applyTichuGrandTichuScore(latestTurn.playersTichuGrandTichu, latestTurn.players, teamToCheck, latestTurn.finishedFirst.id);
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
		const latestTurn = HELPERS.getLatestTurn(state.currentGame);
		for (const [teamIndex, oneTwo] of getEntries(latestTurn.teamsOneTwo)) {
			if (oneTwo) {
				return HELPERS.getPlayersOfTeam(teamIndex, latestTurn);
			}
		}
		return getEntries(latestTurn.players).map(([, r]) => r);
	},
	// points: (state: GlobalState) => {
	// 	const latestTurn = HELPERS.getLatestTurn(state.currentGame);
	// 	return {
	// 		team1: {
	// 			points: latestTurn.teamsPoints['team1'],
	// 			totalPoints: latestTurn.totalScore['team1'],
	// 		},
	// 		team2: {
	// 			points: latestTurn.teamsPoints['team2'],
	// 			totalPoints: latestTurn.totalScore['team2'],
	// 		},
	// 	};
	// },
	getGameDetails: (state: GlobalState) => {
		return {
			winningScore: state.currentGame.winningScore,
			currentScore: {
				team1: state.currentGame.currentScore['team1'],
				team2: state.currentGame.currentScore['team2'],
			},
		};
	},
	playersWithDetails: (state: GlobalState): PlayerWithDetails[] => {
		const latestTurn = HELPERS.getLatestTurn(state.currentGame);
		const playersWithDetails: PlayerWithDetails[] = [];
		for (const [playerIndex, player] of getEntries(latestTurn.players)) {
			const tichuGrandTichu = latestTurn.playersTichuGrandTichu[playerIndex];
			const deals = latestTurn.playerWhoDeals === playerIndex;
			playersWithDetails.push({
				id: player.id,
				name: player.name,
				team: HELPERS.getTeamOfPlayer(player, latestTurn.players),
				tichu: tichuGrandTichu.tichu,
				grandTichu: tichuGrandTichu.grandTichu,
				deals,
			});
		}
		return playersWithDetails;
	},
	teamsWithDetails: (state: GlobalState): TeamWithDetails[] => {
		const latestTurn = HELPERS.getLatestTurn(state.currentGame);
		const teamsWithDetails: TeamWithDetails[] = [];
		for (const [teamIndex, oneTwo] of getEntries(latestTurn.teamsOneTwo)) {
			const points = latestTurn.teamsPoints[teamIndex];
			const temporaryScore = latestTurn.score[teamIndex];
			const totalPointsBeforeThisTurn = state.currentGame.currentScore[teamIndex];
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
		const latestTurn = HELPERS.getLatestTurn(state.currentGame);

		return latestTurn.finishedFirst;
	},
	playerWhoDeals: (state: GlobalState): AppUser => {
		const latestTurn = HELPERS.getLatestTurn(state.currentGame);
		return latestTurn.players[latestTurn.playerWhoDeals];
	},
	gamePlayersInWeirdOrder: (state: GlobalState): AppUser[] => {
		const latestTurn = HELPERS.getLatestTurn(state.currentGame);
		const players = latestTurn.players;
		return [players['t1p1'], players['t2p1'], players['t1p2'], players['t2p2']];
	},
} as const;
export const CURRENT_TURN_DETAILS_WEIRD_SELECTORS = {} as const;