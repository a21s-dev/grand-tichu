import { type NextPage } from 'next';
import * as React from 'react';
import {
	type GamePlayer,
	type PlayerIndexKey,
	type TeamIndexKey,
} from '~/store/gamePlayersSlice';
import { type Team } from '~/store/teamsSlice';

export interface TeamsTotalsProps {
	oneTwoPerTeam: { [teamIndex in TeamIndexKey]: boolean };
	tichuGrandTichuPerPlayer: {
		[key in PlayerIndexKey]: GamePlayer;
	};
	finishedFirstId: string;
	teams: { [teamIndex in TeamIndexKey]: Team };
	pointsPerTeam: { [teamIndex in TeamIndexKey]: number };
}

const TeamsTotals: NextPage<TeamsTotalsProps> = (props: TeamsTotalsProps) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<div>Total score</div>
			<div className="mt-auto flex w-full grow-[1] items-center justify-around ">
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
};

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
	for (const entry of entries) {
		const teamIndex = entry[0] as TeamIndexKey;
		const oneTwo: boolean = entry[1];
		if (teamIndex !== teamToCheck) {
			if (oneTwo) {
				scoreToAdd = 0;
				return formatScore(team.score, scoreToAdd);
			}
			continue;
		}
		if (oneTwo) {
			scoreToAdd += 200;
			return formatScore(team.score, scoreToAdd);
		}
	}
	const pointsOfTeam = pointsPerTeam[teamToCheck];
	scoreToAdd += pointsOfTeam;
	const playersOfTeamToCheck = Array.from(
		Object.values(tichuGrandTichuPerPlayer),
	).filter((player) => player.team === teamToCheck);
	for (const player of playersOfTeamToCheck) {
		if (player.tichu) {
			if (player.id === finishedFirstId) {
				scoreToAdd += 100;
			} else {
				scoreToAdd -= 100;
			}
		} else if (player.grandTichu) {
			if (player.id === finishedFirstId) {
				scoreToAdd += 200;
			} else {
				scoreToAdd -= 200;
			}
		}
	}

	return formatScore(team.score, scoreToAdd);
}

function formatScore(initialScore: number, scoreToAdd: number): string {
	const scoreToAddWithSymbol =
		scoreToAdd >= 0 ? `+${scoreToAdd}` : `${scoreToAdd}`;
	return `${initialScore}(${scoreToAddWithSymbol}) | ${
		initialScore + scoreToAdd
	}`;
}

export default TeamsTotals;
