import { useSelector } from 'react-redux';
import { AppUser, USERS_EXTRA_ACTIONS, USERS_SELECTORS } from '../../store/usersSlice.ts';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import NavBar from '../../components/navbar';
import Button from '@mui/material/Button';
import * as React from 'react';
import UpdateUserDialog from '../../components/update-user-dialog';
import { GAMES_SELECTORS } from '../../store/gamesSlice.ts';
import { useAppDispatch } from '../../store/store.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTES } from '../../routes.tsx';

function UserDetails() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const params = useParams();
	if (params.userId == undefined) {
		navigate(APP_ROUTES.usersRoute());
		throw new Error('');
	}
	const user = useSelector(USERS_SELECTORS.appUserById(params.userId));
	if (user == undefined) {
		navigate(APP_ROUTES.notFoundRoute());
		throw new Error('');
	}
	const playerStatistics = useSelector(GAMES_SELECTORS.playerStatistics(user.id));
	const [openAddNewPlayerDialog, setOpenAddNewPlayerDialog] =
		React.useState(false);

	function deleteUser(user: AppUser) {
		navigate(APP_ROUTES.usersRoute());
		dispatch(USERS_EXTRA_ACTIONS.delete(user.id));
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
						<Typography>
							MVP status: {user.isMvp === true ? 'YEA!!' : 'Plebe'}
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
