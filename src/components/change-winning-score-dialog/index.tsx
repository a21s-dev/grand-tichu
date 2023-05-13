import { Button, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useAppDispatch } from '../../store/store.ts';
import { useSelector } from 'react-redux';
import {
	CURRENT_TURN_DETAILS_SELECTORS,
	currentGameSlice,
	WinningScore,
	WinningScoreType,
} from '../../store/currentGameSlice.ts';
import React from 'react';

export interface ChangeWinningScoreDialogProps {
	keepMounted: boolean;
	open: boolean;
	onClose: () => void;
}

function ChangeWinningScoreDialog(props: ChangeWinningScoreDialogProps) {
	const { onClose, open } = props;
	const dispatch = useAppDispatch();
	const game = useSelector(CURRENT_TURN_DETAILS_SELECTORS.getGame);
	const [winningScore, setWinningScore] = React.useState(game.winningScore);
	return (
		<Dialog
			open={open}
			onClose={() => {
				onClose();
			}}>
			<DialogTitle>
				<Typography variant='body1'>Change the winning score</Typography>
			</DialogTitle>
			<FormControl>
				<InputLabel id='demo-simple-select-label'>Winning score</InputLabel>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					value={winningScore}
					label='Winning score'
					onChange={(e) => {
						const score = e.target.value as WinningScoreType;
						setWinningScore(score);
					}}
				>
					{WinningScore.map((score) => (
						<MenuItem key={score} value={score}>
							{score}
						</MenuItem>
					))}
				</Select>
			</FormControl>
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
						dispatch(currentGameSlice.actions.winningScore({ winningScore }));
						onClose();
					}}
				>
					OK
				</Button>
			</div>
		</Dialog>
	);
}

export default ChangeWinningScoreDialog;
