import { FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
	currentTurnDetailsSlice,
	selectFinishedFirstPlayer,
	selectPlayersAvailableForFirstPlace,
	selectTeamsWithDetails,
	TeamIndex,
} from '../../store/currentTurnDetailsSlice.ts';

const POSSIBLE_SCORES = Array.from({ length: 31 }, (_, i) => -25 + i * 5); //[-25..125]

function TeamsPoints() {
	const dispatch = useDispatch();
	const teamsWithDetails = useSelector(selectTeamsWithDetails);
	const finishedFirst = useSelector(selectFinishedFirstPlayer);
	const playersAvailableForFirstPlace = useSelector(selectPlayersAvailableForFirstPlace);

	function getTeamDetailsByIndex(teamIndex: TeamIndex) {
		const teamDetails = teamsWithDetails.find(t => t.teamIndex === teamIndex);
		if (teamDetails == undefined) {
			throw new Error('error2310');
		}
		return teamDetails;
	}

	function getTeamThatHasOneTwo(): TeamIndex | undefined {
		if (getTeamDetailsByIndex('team1').oneTwo) {
			return 'team1';
		}
		if (getTeamDetailsByIndex('team2').oneTwo) {
			return 'team2';
		}
		return undefined;
	}

	return (
		<div className='flex grow-[3] flex-col'>
			<div className='flex flex-1 items-center justify-center'>
				<ToggleButtonGroup
					fullWidth={true}
					className='flex w-full grow flex-row items-center justify-center'
					color='primary'
					value={getTeamThatHasOneTwo()}
					exclusive
					onChange={(_, value) => {
						dispatch(currentTurnDetailsSlice.actions.teamOneTwo({
							team1: value === 'team1',
							team2: value === 'team2',
						}));
					}}
				>
					<ToggleButton className='text-black' value='team1'>
						<img
							src={new URL('/src/assets/one-two.svg', import.meta.url).href}
							alt={'hi'}
						/>
					</ToggleButton>
					<ToggleButton className='text-black' value='team2'>
						<img
							src={new URL('/src/assets/one-two.svg', import.meta.url).href}
							alt={'hi'}
						/>
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<div className='flex flex-1 flex-row items-center justify-between'>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>Team 1</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={getTeamDetailsByIndex('team1').points}
						label='Team 1'
						onChange={(e) => {
							const score = e.target.value as number;
							dispatch(currentTurnDetailsSlice.actions.teamPoints({
								team: 'team1',
								points: score,
							}));
						}}
					>
						{POSSIBLE_SCORES.map((score) => (
							<MenuItem key={score} value={score}>
								{score}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>First</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={finishedFirst.id}
						label='First'
						onChange={(e) => {
							dispatch(currentTurnDetailsSlice.actions.finishedFirst({
								playerId: e.target.value,
							}));
						}}
					>
						{playersAvailableForFirstPlace.map((player) => (
							<MenuItem key={player.id} value={player.id}>
								{player.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>Team 2</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={getTeamDetailsByIndex('team2').points}
						label='Team 2'
						onChange={(e) => {
							const score = e.target.value as number;
							dispatch(currentTurnDetailsSlice.actions.teamPoints({
								team: 'team2',
								points: score,
							}));
						}}
					>
						{POSSIBLE_SCORES.map((score) => (
							<MenuItem key={score} value={score}>
								{score}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
		</div>
	);
}

export default TeamsPoints;
