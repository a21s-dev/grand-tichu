import { Button, Dialog, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export interface AddNewPlayerDialogProps {
	keepMounted: boolean;
	open: boolean;
	onClose: (details: { playerName: string } | undefined) => void;
}

function AddNewPlayerDialog(props: AddNewPlayerDialogProps) {
	const { onClose, open } = props;
	const [playerName, setPlayerName] = useState<string>('');
	return (
		<Dialog
			open={open}
			onClose={() => {
				onClose(undefined);
			}}>
			<DialogTitle>
				<Typography variant='body1'>Add a new player</Typography>
			</DialogTitle>
			<TextField
				id='outlined-basic'
				label='Player name'
				variant='outlined'
				autoFocus={true}
				value={playerName}
				onChange={(e) => {
					const value = e.target.value;
					setPlayerName(value);
				}}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						onClose({playerName});
					}
				}}
				inputRef={(input) => {
					if (input) {
						setTimeout(() => {
							input.focus();
						}, 100);
					}
				}}
			/>
			<br />
			<div className='flex items-center justify-around'>
				<Button
					variant='outlined'
					color='error'
					onClick={() => {
						onClose(undefined);
					}}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='success'
					onClick={() => {
						onClose({ playerName });
					}}
				>
					OK
				</Button>
			</div>
		</Dialog>
	);
}

export default AddNewPlayerDialog;
