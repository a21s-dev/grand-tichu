import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { CURRENT_TURN_DETAILS_SELECTORS } from '../../store/currentTurnDetailsSlice.ts';
import { getEntries } from '../../utils/type-wizards.ts';

function TeamsNamesAndScores() {
	const teamsWithDetails = useSelector(CURRENT_TURN_DETAILS_SELECTORS.points);

	return (
		<div className='grid grow-[1.5] grid-cols-[repeat(2,auto)] grid-rows-[3em] content-around justify-around'>
			{getEntries(teamsWithDetails).map(([teamIndex, details]) => {
				return (
					<div className='flex items-center justify-center' key={teamIndex}>
						<Typography className='text-[2.3em]' variant='body1'>
							{details.totalPoints}
						</Typography>
					</div>
				);
			})}
		</div>
	);
}

export default TeamsNamesAndScores;
