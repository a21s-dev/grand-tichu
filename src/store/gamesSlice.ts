import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { HELPERS, TeamScore, TurnDetails, WinningScoreType } from './currentGameSlice.ts';
import { nanoid } from 'nanoid';
import { GlobalState } from './store.ts';
import { AppUser } from './usersSlice.ts';

export type Game = {
	id: string,
	turns: TurnDetails[],
	/*
	*
	* Current score after applying all the turns
	* */
	currentScore: TeamScore,
	winningScore: WinningScoreType,
}
export type PlayerStatistics = {
	gamesParticipated: number,
	gamesFinished: number,
	gamesWon: number,
	tichuCalled: number,
	tichuCalledAndMade: number,
	grandCalled: number,
	grandCalledAndMade: number,
}
export type GamesHistoryState = {
	[key: string]: Game
}
export const gamesSlice = createSlice({
	name: 'games',
	initialState: {},
	reducers: {
		add: (state: Draft<GamesHistoryState>, action: PayloadAction<{
			turns: TurnDetails[],
			currentScore: TeamScore,
			winningScore: WinningScoreType,
		}>) => {
			const nanoId = nanoid();
			state[nanoId] = {
				id: nanoId,
				turns: action.payload.turns,
				currentScore: action.payload.currentScore,
				winningScore: action.payload.winningScore,
			};
		},
		delete: (state: Draft<GamesHistoryState>, action: PayloadAction<{
			gameId: string
		}>) => {
			delete state[action.payload.gameId];
		},
		renamePlayer: (state: Draft<GamesHistoryState>, action: PayloadAction<{ user: AppUser }>) => {
			const games = Object.values(state);
			const { user } = action.payload;
			for (const game of games) {
				const turns = game.turns;
				for (const turn of turns) {
					const players = turn.players;
					for (const player of Object.values(players)) {
						if (player.id === user.id) {
							player.name = user.name;
							break;
						}
					}
				}
			}
		},
		deletePlayer: (state: Draft<GamesHistoryState>, action: PayloadAction<{ userId:string }>) => {
			const games = Object.values(state);
			const { userId } = action.payload;
			for (const game of games) {
				const turns = game.turns;
				for (const turn of turns) {
					const players = turn.players;
					for (const player of Object.values(players)) {
						if (player.id === userId) {
							player.id = `DELETED_${player.id}`;
							player.name = `DELETED_${player.name}`;
							break;
						}
					}
				}
			}
		},
	},
});

export const GAMES_SELECTORS = {
	games: (state: { games: GamesHistoryState }) => state.games,
	gameById: (gameId: string) => (state: GlobalState): Game | undefined => {
		return state.games[gameId];
	},
	playerStatistics: (playerId: string) => (state: GlobalState): PlayerStatistics => {
		const playerStatistics: PlayerStatistics = {
			gamesParticipated: 0,
			gamesFinished: 0,
			gamesWon: 0,
			tichuCalled: 0,
			tichuCalledAndMade: 0,
			grandCalled: 0,
			grandCalledAndMade: 0,
		};
		Object.values(state.games).forEach(game => {
			let turns = game.turns;
			if (turns.length <= 1) {
				return;
			}
			turns = turns.slice(0, turns.length - 1);
			const firstTurn = game.turns[0];
			const playersIds = Array.from(Object.values(firstTurn.players)).map(player => player.id);
			if (!playersIds.includes(playerId)) {
				return;
			}
			playerStatistics.gamesParticipated++;

			for (const turn of turns) {
				const playerIndex = HELPERS.getIndexOfPlayer(turn, playerId);
				if (playerIndex == undefined) {
					continue;
				}
				const tichuGrandTichu = turn.playersTichuGrandTichu[playerIndex];
				const calledTichu = tichuGrandTichu.tichu;
				if (calledTichu) {
					playerStatistics.tichuCalled++;
					if (turn.finishedFirst.id === playerId) {
						playerStatistics.tichuCalledAndMade++;
					}
					continue;
				}
				const calledGrandTichu = tichuGrandTichu.grandTichu;
				if (calledGrandTichu) {
					playerStatistics.grandCalled++;
					if (turn.finishedFirst.id === playerId) {
						playerStatistics.grandCalledAndMade++;
					}
				}
			}

			const gameFinished = HELPERS.gameFinished(game.winningScore, game.currentScore);
			if (!gameFinished) {
				return;
			}
			playerStatistics.gamesFinished++;
			const teamThatWon = HELPERS.teamThatWon(game.winningScore, game.currentScore);
			const team = HELPERS.getTeamOfPlayer(playerId, firstTurn.players);
			if (team === teamThatWon) {
				playerStatistics.gamesWon++;
			}
		});
		return playerStatistics;
	},
} as const;
export const GAMES_WEIRD_SELECTORS = {} as const;
