import { useNavigate, useParams } from '@tanstack/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppUser, USERS_SELECTORS, usersSlice } from '../../store/usersSlice.ts';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import NavBar from '../../components/navbar';
import Button from '@mui/material/Button';
import * as React from 'react';
import UpdateUserDialog from '../../components/update-user-dialog';

function UserDetails() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();
	if (params.userId == undefined) {
		navigate({ to: '/users' });
		throw new Error('');
	}
	const user = useSelector(USERS_SELECTORS.appUserById(params.userId));
	if (user == undefined) {
		navigate({ to: '/404' });
		throw new Error('');
	}
	const [openAddNewPlayerDialog, setOpenAddNewPlayerDialog] =
		React.useState(false);

	function deleteUser(user: AppUser) {
		navigate({ to: '/users' })
			.then(() => {
				dispatch(usersSlice.actions.deleteUser(
					{
						userId: user.id,
					},
				));
			});
	}

	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<br />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<Card>
					<CardContent>
						<Typography>
							{user.id}
						</Typography>
						<Typography>
							Name: {user.name}
						</Typography>
					</CardContent>
					<CardActions>
						<Button
							variant='outlined'
							color='error'
							onClick={() => {
								deleteUser(user);
							}}
						>
							Delete
						</Button>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => {
								setOpenAddNewPlayerDialog(true);
							}}
						>
							Update
						</Button>
					</CardActions>
				</Card>
			</main>
			{openAddNewPlayerDialog &&
				<UpdateUserDialog
					keepMounted={false}
					open={openAddNewPlayerDialog}
					onClose={() => {
						setOpenAddNewPlayerDialog(false);
					}}
					playerId={user.id}
				/>
			}
		</div>
	);

}

export default UserDetails;