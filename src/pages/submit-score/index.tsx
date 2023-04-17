import { type NextPage } from 'next';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectAppUsers } from '~/store/usersSlice';
import TeamsPlayers from '~/components/teams-players';
import SubmitScoreButton from '~/components/submit-score-button';
import TeamsTotals from '~/components/teams-totals';
import TeamsPoints from '~/components/teams-points';
import {
	GamePlayer,
	selectGamePlayersInWeirdOrder,
	selectGamePlayersRaw,
	TeamIndexKey,
} from '~/store/gamePlayersSlice';
import { selectTeams, selectTeamsRaw } from '~/store/teamsSlice';
import { selectTeamsDetailsRaw } from '~/store/setScoreSlice';
import teamsPoints from '~/components/teams-points';

const SubmitScore: NextPage = () => {
	const players = useSelector(selectGamePlayersInWeirdOrder);
	const gamePlayersRaw = useSelector(selectGamePlayersRaw);
	const teamsRaw = useSelector(selectTeamsRaw);
	const teams = useSelector(selectTeams);
	const teamsDetails = useSelector(selectTeamsDetailsRaw);

	const [teamScore, setTeamScore] = React.useState<{
		[teamId in TeamIndexKey]: number;
	}>({
		team1: teamsDetails['team1'].points,
		team2: teamsDetails['team2'].points,
	});
	const [teamOneTwo, setTeamOneTwo] = React.useState<{
		[teamId in TeamIndexKey]: boolean;
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
		<div className="fixed flex h-full w-full flex-col">
			<main className="flex h-full w-full flex-col overflow-hidden">
				<TeamsPlayers />
				<TeamsPoints
					players={players}
					teamsDetails={teamsDetails}
					retrieveData={(teamScores, teamOneTwo, firstPlayerId) => {
						console.log('retrieving');
						console.log({ teamScores, teamOneTwo, firstPlayerId });
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
};

export default SubmitScore;
