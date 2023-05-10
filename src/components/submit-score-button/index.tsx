import { Typography } from '@mui/material';
import { useNavigate } from '@tanstack/router';
import { CURRENT_TURN_EXTRA_ACTIONS } from '../../store/currentGameSlice.ts';
import { useAppDispatch } from '../../store/store.ts';

function SubmitScoreButton() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	return (
		<div className='mt-auto flex items-center justify-center pt-10'>
			<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
				<button
					className='h-full w-full'
					onClick={() => {
						dispatch(CURRENT_TURN_EXTRA_ACTIONS.submitTurn());
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
