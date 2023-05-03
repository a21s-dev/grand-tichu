import { Typography } from '@mui/material';
import { useNavigate } from '@tanstack/router';
import { useDispatch } from 'react-redux';
import { currentGameSlice } from '../../store/currentGameSlice.ts';

function SubmitScoreButton() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div className='mt-auto flex items-center justify-center pt-10'>
			<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
				<button
					className='h-full w-full'
					onClick={() => {
						dispatch(currentGameSlice.actions.submitTurn());
						navigate({ to: '/' });
					}}
				>
					OK
				</button>
			</Typography>
		</div>
	);
}

export default SubmitScoreButton;
