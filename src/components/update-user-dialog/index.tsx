import { Button, Dialog, DialogTitle, TextField, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { USERS_SELECTORS, usersSlice } from '../../store/usersSlice.ts';

export interface AddNewPlayerDialogProps {
	keepMounted: boolean;
	open: boolean;
	playerId: string;
	onClose: () => void;
}

function UpdateUserDialog(props: AddNewPlayerDialogProps) {
	const { onClose, playerId, open } = props;
	const dispatch = useDispatch();
	const user = useSelector(USERS_SELECTORS.appUserById(playerId));
	if (user == undefined) {
		onClose();
		throw new Error('');
	}
	const [userName, setUserName] = React.useState<string>(user.name);

	function updateUser() {
		dispatch(usersSlice.actions.updateName(
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
