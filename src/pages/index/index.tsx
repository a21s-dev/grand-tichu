import TeamsNamesAndScores from '../../components/teams-names-and-scores';
import SetScore from '../../components/set-score-button';
import NavBar from '../../components/navbar';
import TeamsMembersAndTichuControls from '../../components/teams_members_and_tichu_controls';

function Index() {
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<TeamsNamesAndScores />
				<TeamsMembersAndTichuControls />
				<SetScore />
			</main>
		</div>
	);
}

export default Index;
