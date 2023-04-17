import {type NextPage} from 'next';
import * as React from 'react';
import {Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import {selectTeamScores} from '~/store/teamScoresSlice';

const TeamsNamesAndScores: NextPage = () => {
	const teamScores = useSelector(selectTeamScores);
	return (
		<div className="grid grow-[1.5] grid-cols-[repeat(2,auto)] grid-rows-[3em] content-around justify-around">
			{teamScores.map((teamScore) => {
				return (
					<div className="flex items-center justify-center" key={teamScore.id}>
						<Typography className="text-[2.3em]" variant="body1">
							{teamScore.score}
						</Typography>
					</div>
				);
			})}
		</div>
	);
};

export default TeamsNamesAndScores;
