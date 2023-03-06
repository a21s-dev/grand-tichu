import {type NextPage} from "next";
import NavBar from "~/components/navbar";
import TeamsNamesAndScores from "~/components/teams-names-and-scores";
import TeamsMembersAndTichuControls from "~/components/teams_members_and_tichu_controls";
import SetScore from "~/components/set-score";
import {createTheme} from '@mui/material/styles';
import {orange} from '@mui/material/colors';
import {ThemeProvider} from "@mui/system";

const theme = createTheme({
	palette: {
		primary: {
			main: orange[600],
		},
		secondary: {
			main: '#FFFFFF',
		}
	},
	typography: {
		fontFamily: [
			'Roboto',
		].join(','),
		title: {
			'color': 'white',
			'background-color': orange[600],
		}
	}
})

const Home: NextPage = () => {
	return (
		<ThemeProvider theme={theme}>
			<div className='fixed flex h-full w-full flex-col'>
				<NavBar/>
				<main className='flex h-full w-full flex-col overflow-hidden'>
					<TeamsNamesAndScores/>
					<TeamsMembersAndTichuControls/>
					<SetScore/>
				</main>
			</div>
		</ThemeProvider>
	);
};

export default Home;
