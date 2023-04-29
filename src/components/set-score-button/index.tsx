import { Typography } from '@mui/material';
import { Link } from '@tanstack/router';

function SetScore() {
	return (
		<div className='mt-auto flex items-center justify-center pt-10'>
			<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
				<Link to='/submit-score'>
					<button className='h-full w-full'>Set Score</button>
				</Link>
			</Typography>
		</div>
	);
}

export default SetScore;
