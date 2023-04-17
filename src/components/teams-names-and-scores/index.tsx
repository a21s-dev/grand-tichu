import { type NextPage } from 'next';
import * as React from 'react';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectTeams } from '~/store/teamsSlice';

const TeamsNamesAndScores: NextPage = () => {
	const teams = useSelector(selectTeams);
	return (
		<div className="grid grow-[1.5] grid-cols-[repeat(2,auto)] grid-rows-[3em] content-around justify-around">
			{teams.map((team) => {
				return (
					<div className="flex items-center justify-center" key={team.id}>
						<Typography className="text-[2.3em]" variant="body1">
							{team.score}
						</Typography>
					</div>
				);
			})}
		</div>
	);
};

export default TeamsNamesAndScores;
