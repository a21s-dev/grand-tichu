import { Typography } from '@mui/material';
import { currentGameSlice } from '../../store/currentGameSlice.ts';
import { useAppDispatch } from '../../store/store.ts';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../routes.tsx';

function SubmitScoreButton() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	return (
		<div className='mt-auto flex items-center justify-center pt-10'>
			<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
				<button
					className='h-full w-full'
					onClick={() => {
						dispatch(currentGameSlice.actions.submitTurn());
						navigate(APP_ROUTES.indexRoute())
					}}
				>
					OK
				</button>
			</Typography>
		</div>
	);
}

export default SubmitScoreButton;
