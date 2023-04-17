import { type NextPage } from 'next';
import NavBar from '~/components/navbar';
import TeamsNamesAndScores from '~/components/teams-names-and-scores';
import TeamsMembersAndTichuControls from '~/components/teams_members_and_tichu_controls';
import SetScore from '~/components/set-score';

const Home: NextPage = () => {
	return (
		<div className="fixed flex h-full w-full flex-col">
			<NavBar />
			<main className="flex h-full w-full flex-col overflow-hidden">
				<TeamsNamesAndScores />
				<TeamsMembersAndTichuControls />
				<SetScore />
			</main>
		</div>
	);
};

export default Home;
