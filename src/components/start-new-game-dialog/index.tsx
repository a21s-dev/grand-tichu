import { Button, Dialog, DialogTitle, Typography } from '@mui/material';
import { CURRENT_TURN_EXTRA_ACTIONS } from '../../store/currentGameSlice.ts';
import { useAppDispatch } from '../../store/store.ts';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../routes.tsx';

export interface StartNewGameDialogProps {
	keepMounted: boolean;
	open: boolean;
	onClose: () => void;
}

function StartNewGameDialog(props: StartNewGameDialogProps) {
	const navigate = useNavigate();
	const { onClose, open } = props;
	const dispatch = useAppDispatch();
	return (
		<Dialog
			open={open}
			onClose={() => {
				onClose();
			}}>
			<DialogTitle>
				<Typography variant='body1'>New game?</Typography>
			</DialogTitle>
			<div className='flex items-center justify-around'>
				<Button
					variant='outlined'
					color='error'
					onClick={() => {
						onClose();
					}}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='success'
					onClick={() => {
						dispatch(CURRENT_TURN_EXTRA_ACTIONS.startNew());
						navigate(APP_ROUTES.indexRoute());
						onClose();
					}}
				>
					OK
				</Button>
			</div>
		</Dialog>
	);
}

export default StartNewGameDialog;
