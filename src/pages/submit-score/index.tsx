import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectTeamsRaw } from '../../store/teamsSlice.ts';
import { selectTeamsDetailsRaw } from '../../store/setScoreSlice.ts';
import {
	GamePlayer,
	selectGamePlayersInWeirdOrder,
	selectGamePlayersRaw,
	TeamIndex,
} from '../../store/gamePlayersSlice.ts';
import TeamsPlayers from '../../components/teams-players';
import TeamsPoints from '../../components/teams-points';
import TeamsTotals from '../../components/teams-totals';
import SubmitScoreButton from '../../components/submit-score-button';

function SubmitScore() {
	const players = useSelector(selectGamePlayersInWeirdOrder);
	const gamePlayersRaw = useSelector(selectGamePlayersRaw);
	const teamsRaw = useSelector(selectTeamsRaw);
	// const teams = useSelector(selectTeams);
	const setScoreState = useSelector(selectTeamsDetailsRaw);

	const [teamScore, setTeamScore] = React.useState<{
		[teamId in TeamIndex]: number;
	}>({
		team1: setScoreState.team1.points,
		team2: setScoreState.team2.points,
	});
	const [teamOneTwo, setTeamOneTwo] = React.useState<{
		[teamId in TeamIndex]: boolean;
	}>({
		team1: false,
		team2: false,
	});
	const firstPlayer: GamePlayer | undefined = players[0];
	if (firstPlayer == undefined) {
		throw new Error('');
	}
	const [firstPlayerId, setFirstPlayerId] = React.useState<string>(
		firstPlayer.id,
	);
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<TeamsPlayers />
				<TeamsPoints
					players={players}
					teamsDetails={setScoreState}
					retrieveData={(teamScores, teamOneTwo, firstPlayerId) => {
						// console.log("retrieving");
						// console.log({ teamScores, teamOneTwo, firstPlayerId });
						setTeamScore(teamScores);
						setTeamOneTwo(teamOneTwo);
						setFirstPlayerId(firstPlayerId);
					}}
				/>
				<TeamsTotals
					oneTwoPerTeam={teamOneTwo}
					tichuGrandTichuPerPlayer={gamePlayersRaw}
					finishedFirstId={firstPlayerId}
					teams={teamsRaw}
					pointsPerTeam={teamScore}
				/>
				<SubmitScoreButton />
			</main>
		</div>
	);
}

export default SubmitScore;
