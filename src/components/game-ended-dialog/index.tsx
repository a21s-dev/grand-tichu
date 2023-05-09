import { Button, Dialog, DialogTitle, Typography } from '@mui/material';
import { currentGameSlice, TeamIndex } from '../../store/currentGameSlice.ts';
import { useDispatch } from 'react-redux';

export interface GameEndedDialogProps {
	keepMounted: boolean;
	open: boolean;
	team: TeamIndex;
	onClose: () => void;
}

function GameEndedDialog(props: GameEndedDialogProps) {
	const { onClose, team, open } = props;
	const dispatch = useDispatch();
	return (
		<Dialog
			open={open}
			onClose={() => {
				onClose();
			}}>
			<DialogTitle>
				<Typography variant='body1'>New game?</Typography>
			</DialogTitle>
			<div>
				Team {team} won the game
			</div>
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
						dispatch(currentGameSlice.actions.startNew());
						onClose();
					}}
				>
					OK
				</Button>
			</div>
		</Dialog>
	);
}

export default GameEndedDialog;
