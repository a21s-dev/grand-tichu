import {
	Alert,
	Dialog,
	DialogTitle,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Snackbar,
	Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppUser, USERS_SELECTORS, usersSlice } from '../../store/usersSlice.ts';
import * as React from 'react';
import AddNewPlayerDialog from '../add-new-player-dialog';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../error/AppError.ts';
import { InternalError } from '../../error/InternalError.ts';
import { InvalidPlayerNameError } from '../../error/InvalidPlayerNameError.ts';
import { PlayerAlreadyExistsError } from '../../error/PlayerAlreadyExistsError.ts';

export interface ChangePlayerDialogProps {
	keepMounted: boolean;
	open: boolean;
	player: AppUser | undefined;
	onClose: (details: { oldId: string; newId: string } | undefined) => void;
}

function ChangePlayerDialog(props: ChangePlayerDialogProps) {
	const { onClose, player, open } = props;
	const dispatch = useDispatch();
	const usersState = useSelector(USERS_SELECTORS.selectAppUsers);
	const [openAddNewPlayerDialog, setOpenAddNewPlayerDialog] =
		React.useState(false);
	const [addPlayerError, setAddPlayerError] = React.useState<string>('');
	if (player == undefined) {
		return <div></div>;
	}

	const handleClose = () => {
		onClose(undefined);
	};
	const handleListItemClick = (newId: string) => {
		onClose({ oldId: player.id, newId });
	};
	const handleAddNewPlayerDialog = (
		details: { playerName: string } | undefined,
	) => {
		setOpenAddNewPlayerDialog(false);
		if (details == undefined) {
			onClose(undefined);
			return;
		}
		try {
			const id = uuidv4();
			dispatch(usersSlice.actions.addNew({
				id,
				name: details.playerName,
			}));
			onClose({
				oldId: player.id,
				newId: id,
			});
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
		<>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>
					<Typography className='underline text-2xl' variant='body1'>Who plays instead?</Typography>
				</DialogTitle>
				<List sx={{ pt: 0 }}>
					<ListItem key='add-new'>
						<ListItemButton onClick={() => {
							onClose(undefined);
							setOpenAddNewPlayerDialog(true);
						}}>
							<ListItemText
								primary={
									<Typography
										className='flex items-center justify-center text-orange-600 font-bold'
										variant='body1'>
										Add new player
									</Typography>
								}
							/>
						</ListItemButton>
					</ListItem>
					{usersState
						.filter((user) => user.id !== player.id)
						.map((user) => {
							return (
								<ListItem key={user.id}>
									<ListItemButton onClick={() => handleListItemClick(user.id)}>
										<ListItemText
											className='flex items-center justify-center'
											primary={user.name}
										/>
									</ListItemButton>
								</ListItem>
							);
						})}
				</List>
			</Dialog>
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
			{openAddNewPlayerDialog &&
				<AddNewPlayerDialog
					keepMounted={false}
					open={openAddNewPlayerDialog}
					onClose={handleAddNewPlayerDialog}
				/>
			}
		</>
	);
}

export default ChangePlayerDialog;
