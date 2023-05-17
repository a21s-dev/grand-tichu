import { useNavigate, useParams } from '@tanstack/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppUser, USERS_SELECTORS, usersSlice } from '../../store/usersSlice.ts';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import NavBar from '../../components/navbar';
import Button from '@mui/material/Button';
import * as React from 'react';
import UpdateUserDialog from '../../components/update-user-dialog';
import { GAMES_SELECTORS } from '../../store/gamesSlice.ts';

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
	const playerStatistics = useSelector(GAMES_SELECTORS.playerStatistics(user.id));
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

	function percentage(part: number, total: number): string {
		if (total === 0) {
			return '0%';
		}
		return Math.round((part / total) * 100).toString(10) + '%';
	}

	function gamesFinished(gamesParticipated: number, gamesFinished: number): string {
		if (gamesParticipated === gamesFinished) {
			return '';
		}
		return `(${gamesFinished} finished)`;
	}

	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<br />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<Card>
					<CardContent>
						<Typography variant='body1'>
							{user.id}
						</Typography>
						<Typography>
							Name: {user.name}
						</Typography>
						<hr />
						<Typography variant='body1' className='font-bold'>
							Statistics
						</Typography>
						<Typography>
							Games
							participated: {playerStatistics.gamesParticipated} {gamesFinished(playerStatistics.gamesParticipated, playerStatistics.gamesFinished)}
							<br />
							Games won: {playerStatistics.gamesWon}/{playerStatistics.gamesFinished} |
							({percentage(playerStatistics.gamesWon, playerStatistics.gamesFinished)})
							<br />
							Tichu calls: {playerStatistics.tichuCalledAndMade}/{playerStatistics.tichuCalled} |
							({percentage(playerStatistics.tichuCalledAndMade, playerStatistics.tichuCalled)})
							<br />
							Grand Tichu calls: {playerStatistics.grandCalledAndMade}/{playerStatistics.grandCalled} |
							({percentage(playerStatistics.grandCalledAndMade, playerStatistics.grandCalled)})
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