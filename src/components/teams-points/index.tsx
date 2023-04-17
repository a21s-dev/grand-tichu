import { type NextPage } from 'next';
import * as React from 'react';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import Image from 'next/image';
import { type GamePlayer, type TeamIndexKey } from '~/store/gamePlayersSlice';
import { type SetScoreState } from '~/store/setScoreSlice';
import { useEffect } from 'react';

const POSSIBLE_SCORES = Array.from({ length: 31 }, (_, i) => -25 + i * 5); //[-25..125]
export interface TeamsPointsProps {
	players: GamePlayer[];
	teamsDetails: SetScoreState;
	retrieveData: (
		teamScores: { [teamId in TeamIndexKey]: number },
		teamOneTwo: { [teamId in TeamIndexKey]: boolean },
		firstPlayerId: string,
	) => void;
}

const TeamsPoints: NextPage<TeamsPointsProps> = (props: TeamsPointsProps) => {
	const { players, teamsDetails, retrieveData } = props;
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

	useEffect(() => {
		retrieveData(teamScore, teamOneTwo, firstPlayerId);
	}, [firstPlayerId, teamOneTwo, teamScore]);


	function handleScoreChange(team: TeamIndexKey, score: number) {
		const otherTeamScore = 100 - score;
		let otherTeam: TeamIndexKey | undefined;
		if (team === 'team1') {
			otherTeam = 'team2';
		} else {
			otherTeam = 'team1';
		}
		const newScores: { [teamId in TeamIndexKey]: number } = {
			team1: 0,
			team2: 0,
		};
		newScores[team] = score;
		newScores[otherTeam] = otherTeamScore;

		setTeamScore(newScores);
	}

	function availableForFirstPlace(): GamePlayer[] {
		for (const [teamId, oneTwo] of Object.entries(teamOneTwo)) {
			if (oneTwo) {
				const playersOfTeam = players.filter(
					(player) => player.team === teamId,
				);
				const firstPlayer = playersOfTeam[0];
				if (firstPlayer == undefined) {
					throw new Error('');
				}
				if (firstPlayerId !== firstPlayer.id) {
					setFirstPlayerId(firstPlayer.id);
				}
				return playersOfTeam;
			}
		}
		return players;
	}

	return (
		<div className="flex grow-[3] flex-col">
			<div className="flex flex-1 items-center justify-center">
				<ToggleButtonGroup
					fullWidth={true}
					className="flex w-full grow flex-row items-center justify-center"
					color="primary"
					value={
						teamOneTwo['team1'] ? 'team1' : teamOneTwo['team2'] ? 'team2' : ''
					}
					exclusive
					onChange={(e, value) => {
						setTeamOneTwo({
							team1: value === 'team1',
							team2: value === 'team2',
						});
					}}
				>
					<ToggleButton className="text-black" value="team1">
						<Image
							src="one-two.svg"
							alt="hi"
							width="100"
							height="100"
							priority
						/>
					</ToggleButton>
					<ToggleButton className="text-black" value="team2">
						<Image
							src="one-two.svg"
							alt="hi"
							width="100"
							height="100"
							priority
						/>
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<div className="flex flex-1 flex-row items-center justify-between">
				<FormControl>
					<InputLabel id="demo-simple-select-label">Team 1</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={teamScore['team1']}
						label="Team 1"
						onChange={(e) => {
							const score = e.target.value as number;
							handleScoreChange('team1', score);
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
					<InputLabel id="demo-simple-select-label">First</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={firstPlayerId}
						label="First"
						onChange={(e) => {
							setFirstPlayerId(e.target.value);
						}}
					>
						{availableForFirstPlace().map((player) => (
							<MenuItem key={player.id} value={player.id}>
								{player.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<InputLabel id="demo-simple-select-label">Team 2</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={teamScore['team2']}
						label="Team 2"
						onChange={(e) => {
							const score = e.target.value as number;
							handleScoreChange('team2', score);
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
};

export default TeamsPoints;
