import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { USERS_EXTRA_ACTIONS, USERS_SELECTORS } from '../../store/usersSlice.ts';
import NavBar from '../../components/navbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddNewPlayerDialog from '../../components/add-new-player-dialog';
import * as React from 'react';
import { AppError } from '../../error/AppError.ts';
import { InternalError } from '../../error/InternalError.ts';
import { InvalidPlayerNameError } from '../../error/InvalidPlayerNameError.ts';
import { PlayerAlreadyExistsError } from '../../error/PlayerAlreadyExistsError.ts';
import { Alert, Snackbar } from '@mui/material';
import { nanoid } from 'nanoid';
import { useAppDispatch } from '../../store/store.ts';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../routes.tsx';


const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 120, sortable: false, disableColumnMenu: true },
	{ field: 'name', headerName: 'Name', width: 170, disableColumnMenu: true },
];

function Users() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const users = useSelector(USERS_SELECTORS.appUsers);
	const [openAddNewPlayerDialog, setOpenAddNewPlayerDialog] =
		React.useState(false);
	const [addPlayerError, setAddPlayerError] = React.useState<string>('');
	const [lessThan4Users, setLessThan4Users] = React.useState<boolean>(users.length < 4);
	const handleAddNewPlayerDialog = (
		details: { playerName: string } | undefined,
	) => {
		setOpenAddNewPlayerDialog(false);
		if (details == undefined) {
			return;
		}
		try {
			const id = nanoid();
			dispatch(USERS_EXTRA_ACTIONS.add({
				id,
				name: details.playerName,
			}));
		} catch (error: unknown) {
			if (!(error instanceof AppError)) {
				console.error(error);
				throw new InternalError();
			}
			if (error.type() === InvalidPlayerNameError.TYPE) {
				setAddPlayerError('Invalid player name!');
			} else if (error.type() === PlayerAlreadyExistsError.TYPE) {
				setAddPlayerError('Player name already exists!');
			}
		}
	};
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<Box className='w-full h-full mt-auto flex flex-col items-center justify-center'>
					<Button
						variant='outlined'
						className='m-2 text-black'
						onClick={() => {
							setOpenAddNewPlayerDialog(true);
						}}
					>
						Add a user
					</Button>
					<DataGrid
						className='w-full'
						rows={users}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 },
							},
						}}
						pageSizeOptions={[5]}
						onRowClick={(e) => {
							navigate(APP_ROUTES.specificUserDetailsRoute(e.id as string));
						}}
					/>
				</Box>
			</main>
			{addPlayerError &&
				<Snackbar open={addPlayerError !== ''} autoHideDuration={3000} onClose={() => {
					setAddPlayerError('');
				}}>
					<Alert onClose={() => {
						setAddPlayerError('');
					}} severity='error' sx={{ width: '100%' }}>
						{addPlayerError}
					</Alert>
				</Snackbar>
			}
			{lessThan4Users &&
				<Snackbar open={lessThan4Users} onClose={() => {
					setLessThan4Users(false);
				}}>
					<Alert onClose={() => {
						setLessThan4Users(false);
					}} severity='error' sx={{ width: '100%' }}>
						You need at least 4 users to start a game!
					</Alert>
				</Snackbar>
			}
			{openAddNewPlayerDialog &&
				<AddNewPlayerDialog
					keepMounted={false}
					open={openAddNewPlayerDialog}
					onClose={handleAddNewPlayerDialog}
				/>
			}
		</div>
	);

}

export default Users;