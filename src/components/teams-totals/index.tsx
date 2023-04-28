import { GamePlayer, PlayerIndexKey, TeamIndexKey } from '../../store/gamePlayersSlice.ts';
import { Team } from '../../store/teamsSlice.ts';

export interface TeamsTotalsProps {
	oneTwoPerTeam: { [teamIndex in TeamIndexKey]: boolean };
	tichuGrandTichuPerPlayer: {
		[key in PlayerIndexKey]: GamePlayer;
	};
	finishedFirstId: string;
	teams: { [teamIndex in TeamIndexKey]: Team };
	pointsPerTeam: { [teamIndex in TeamIndexKey]: number };
}

function TeamsTotals(props: TeamsTotalsProps) {
	return (
		<div className='flex flex-col items-center justify-center'>
			<div>Total score</div>
			<div className='mt-auto flex w-full grow-[1] items-center justify-around '>
				{Object.keys(props.teams).map((team) => (
					<span key={team}>
            {scoreOfTeam(
							props.oneTwoPerTeam,
							props.pointsPerTeam,
							props.tichuGrandTichuPerPlayer,
							props.teams,
							props.finishedFirstId,
							team as TeamIndexKey,
						)}
          </span>
				))}
			</div>
		</div>
	);
}

function scoreOfTeam(
	oneTwoPerTeam: { [teamIndex in TeamIndexKey]: boolean },
	pointsPerTeam: { [teamIndex in TeamIndexKey]: number },
	tichuGrandTichuPerPlayer: {
		[key in PlayerIndexKey]: GamePlayer;
	},
	teams: { [teamIndex in TeamIndexKey]: Team },
	finishedFirstId: string,
	teamToCheck: TeamIndexKey,
): string {
	let scoreToAdd = 0;
	const team = teams[teamToCheck];
	const entries = Array.from(Object.entries(oneTwoPerTeam));
	for (const [teamIndex, oneTwo] of entries) {
		if (teamIndex !== teamToCheck) {
			if (oneTwo) {
				scoreToAdd = applyTichuGrandTichuScore(scoreToAdd, tichuGrandTichuPerPlayer, teamToCheck, finishedFirstId);
				scoreToAdd = applyOneTwo(scoreToAdd, oneTwoPerTeam, teamToCheck);
				return formatScore(team.score, scoreToAdd);
			}
			continue;
		}
		if (oneTwo) {
			scoreToAdd = applyTichuGrandTichuScore(scoreToAdd, tichuGrandTichuPerPlayer, teamToCheck, finishedFirstId);
			scoreToAdd = applyOneTwo(scoreToAdd, oneTwoPerTeam, teamToCheck);
			return formatScore(team.score, scoreToAdd);
		}
	}
	scoreToAdd = applyPointsScore(scoreToAdd, pointsPerTeam, teamToCheck);
	scoreToAdd = applyTichuGrandTichuScore(scoreToAdd, tichuGrandTichuPerPlayer, teamToCheck, finishedFirstId);

	return formatScore(team.score, scoreToAdd);
}

function applyTichuGrandTichuScore(initialScore: number, tichuGrandTichuPerPlayer: {
	[key in PlayerIndexKey]: GamePlayer;
}, teamToCheck: TeamIndexKey, finishedFirstId: string): number {
	const playersOfTeamToCheck = Array.from(
		Object.values(tichuGrandTichuPerPlayer),
	).filter((player) => player.team === teamToCheck);
	for (const player of playersOfTeamToCheck) {
		if (player.tichu) {
			if (player.id === finishedFirstId) {
				initialScore += 100;
				continue;
			}
			initialScore -= 100;
		}
		if (player.grandTichu) {
			if (player.id === finishedFirstId) {
				initialScore += 200;
				continue;
			}
			initialScore -= 200;
		}
	}
	return initialScore;
}

function applyOneTwo(initialScore: number, oneTwoPerTeam: { [teamIndex in TeamIndexKey]: boolean }, teamToCheck: TeamIndexKey): number {
	const entries = Array.from(Object.entries(oneTwoPerTeam));
	for (const [teamIndex, oneTwo] of entries) {
		if (teamIndex !== teamToCheck) {
			if (oneTwo) {
				return initialScore;
			}
		}
		if (oneTwo) {
			return initialScore + 200;
		}
	}
	return initialScore;
}

function applyPointsScore(initialScore: number, pointsPerTeam: { [teamIndex in TeamIndexKey]: number }, teamToCheck: TeamIndexKey): number {
	const pointsOfTeam = pointsPerTeam[teamToCheck];
	return initialScore + pointsOfTeam;
}

function formatScore(initialScore: number, scoreToAdd: number): string {
	const scoreToAddWithSymbol =
		scoreToAdd >= 0 ? `+${scoreToAdd}` : `${scoreToAdd}`;
	return `${initialScore}(${scoreToAddWithSymbol}) | ${
		initialScore + scoreToAdd
	}`;
}

export default TeamsTotals;
