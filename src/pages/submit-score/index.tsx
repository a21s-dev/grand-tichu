import TeamsPlayers from '../../components/teams-players';
import TeamsPoints from '../../components/teams-points';
import TeamsTotals from '../../components/teams-totals';
import SubmitScoreButton from '../../components/submit-score-button';

function SubmitScore() {
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<TeamsPlayers />
				<TeamsPoints />
				<TeamsTotals />
				<SubmitScoreButton />
			</main>
		</div>
	);
}

export default SubmitScore;
