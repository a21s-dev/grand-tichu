import { describe, expect, it } from 'vitest';
import { HELPERS, TurnDetails } from './currentGameSlice.ts';

describe('turn points', () => {
	it('only points', () => {
		const latestTurn: TurnDetails = {
			players: {
				t1p1: { id: '11', name: '11' },
				t1p2: { id: '12', name: '12' },
				t2p1: { id: '21', name: '21' },
				t2p2: { id: '22', name: '22' },
			},
			playersTichuGrandTichu: {
				t1p1: { tichu: false, grandTichu: false },
				t1p2: { tichu: false, grandTichu: false },
				t2p1: { tichu: false, grandTichu: false },
				t2p2: { tichu: false, grandTichu: false },
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 40,
				team2: 60,
			},
			score: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: { id: '11', name: '11' },
			playerWhoDeals: 't1p1',
		};
		HELPERS.updateTurnPoints(latestTurn);
		expect(latestTurn.score.team1).toBe(40);
		expect(latestTurn.score.team2).toBe(60);
	});


	it('one successful tichu', () => {
		const latestTurn: TurnDetails = {
			players: {
				t1p1: { id: '11', name: '11' },
				t1p2: { id: '12', name: '12' },
				t2p1: { id: '21', name: '21' },
				t2p2: { id: '22', name: '22' },
			},
			playersTichuGrandTichu: {
				t1p1: { tichu: true, grandTichu: false },
				t1p2: { tichu: false, grandTichu: false },
				t2p1: { tichu: false, grandTichu: false },
				t2p2: { tichu: false, grandTichu: false },
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 50,
				team2: 50,
			},
			score: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: { id: '11', name: '11' },
			playerWhoDeals: 't1p1',
		};
		HELPERS.updateTurnPoints(latestTurn);
		expect(latestTurn.score.team1).toBe(150);
		expect(latestTurn.score.team2).toBe(50);
	});

	it('one successful grand', () => {
		const latestTurn: TurnDetails = {
			players: {
				t1p1: { id: '11', name: '11' },
				t1p2: { id: '12', name: '12' },
				t2p1: { id: '21', name: '21' },
				t2p2: { id: '22', name: '22' },
			},
			playersTichuGrandTichu: {
				t1p1: { tichu: false, grandTichu: true },
				t1p2: { tichu: false, grandTichu: false },
				t2p1: { tichu: false, grandTichu: false },
				t2p2: { tichu: false, grandTichu: false },
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 50,
				team2: 50,
			},
			score: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: { id: '11', name: '11' },
			playerWhoDeals: 't1p1',
		};
		HELPERS.updateTurnPoints(latestTurn);
		expect(latestTurn.score.team1).toBe(250);
		expect(latestTurn.score.team2).toBe(50);
	});


	it('only points with initial data', () => {
		const latestTurn: TurnDetails = {
			players: {
				t1p1: { id: '11', name: '11' },
				t1p2: { id: '12', name: '12' },
				t2p1: { id: '21', name: '21' },
				t2p2: { id: '22', name: '22' },
			},
			playersTichuGrandTichu: {
				t1p1: { tichu: false, grandTichu: false },
				t1p2: { tichu: false, grandTichu: false },
				t2p1: { tichu: false, grandTichu: false },
				t2p2: { tichu: false, grandTichu: false },
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 50,
				team2: 50,
			},
			score: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: { id: '11', name: '11' },
			playerWhoDeals: 't1p1',
		};
		HELPERS.updateTurnPoints(latestTurn);
		expect(latestTurn.score.team1).toBe(50);
		expect(latestTurn.score.team2).toBe(50);
	});


	it('one successful tichu and one failed tichu(diff teams)', () => {
		const latestTurn: TurnDetails = {
			players: {
				t1p1: { id: '11', name: '11' },
				t1p2: { id: '12', name: '12' },
				t2p1: { id: '21', name: '21' },
				t2p2: { id: '22', name: '22' },
			},
			playersTichuGrandTichu: {
				t1p1: { tichu: true, grandTichu: false },
				t1p2: { tichu: false, grandTichu: false },
				t2p1: { tichu: true, grandTichu: false },
				t2p2: { tichu: false, grandTichu: false },
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 50,
				team2: 50,
			},
			score: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: { id: '11', name: '11' },
			playerWhoDeals: 't1p1',
		};
		HELPERS.updateTurnPoints(latestTurn);
		expect(latestTurn.score.team1).toBe(150);
		expect(latestTurn.score.team2).toBe(-50);
	});


	it('one successful tichu and one failed tichu(same team)', () => {
		const latestTurn: TurnDetails = {
			players: {
				t1p1: { id: '11', name: '11' },
				t1p2: { id: '12', name: '12' },
				t2p1: { id: '21', name: '21' },
				t2p2: { id: '22', name: '22' },
			},
			playersTichuGrandTichu: {
				t1p1: { tichu: true, grandTichu: false },
				t1p2: { tichu: true, grandTichu: false },
				t2p1: { tichu: false, grandTichu: false },
				t2p2: { tichu: false, grandTichu: false },
			},
			teamsOneTwo: {
				team1: false,
				team2: false,
			},
			teamsPoints: {
				team1: 50,
				team2: 50,
			},
			score: {
				team1: 0,
				team2: 0,
			},
			finishedFirst: { id: '11', name: '11' },
			playerWhoDeals: 't1p1',
		};
		HELPERS.updateTurnPoints(latestTurn);
		expect(latestTurn.score.team1).toBe(50);
		expect(latestTurn.score.team2).toBe(50);
	});
});
