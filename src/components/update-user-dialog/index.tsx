import { Button, Dialog, DialogTitle, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { USERS_EXTRA_ACTIONS, USERS_SELECTORS } from '../../store/usersSlice.ts';
import { useAppDispatch } from '../../store/store.ts';
import { useState } from 'react';

export interface AddNewPlayerDialogProps {
	keepMounted: boolean;
	open: boolean;
	playerId: string;
	onClose: () => void;
}

function UpdateUserDialog(props: AddNewPlayerDialogProps) {
	const { onClose, playerId, open } = props;
	const dispatch = useAppDispatch();
	const user = useSelector(USERS_SELECTORS.appUserById(playerId));
	if (user == undefined) {
		onClose();
		throw new Error('');
	}
	const [userName, setUserName] = useState<string>(user.name);

	function updateUser() {
		dispatch(USERS_EXTRA_ACTIONS.rename(
			{
				id: playerId,
				name: userName,
			},
		));
		onClose();
	}

	return (
		<Dialog
			open={open}
			onClose={() => {
				onClose();
			}}>
			<DialogTitle>
				<Typography variant='body1'>Update user {user.id}</Typography>
			</DialogTitle>
			<TextField
				id='outlined-basic'
				label='Player name'
				variant='outlined'
				autoFocus={true}
				value={userName}
				onChange={(e) => {
					const value = e.target.value;
					setUserName(value);
				}}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						updateUser();
						onClose();
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
						onClose();
					}}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='success'
					onClick={() => {
						updateUser();
						onClose();
					}}
				>
					OK
				</Button>
			</div>
		</Dialog>
	);
}

export default UpdateUserDialog;
