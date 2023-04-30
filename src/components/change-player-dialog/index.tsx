import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppUser, selectAppUsers } from '../../store/usersSlice.ts';

export interface ChangePlayerDialogProps {
	keepMounted: boolean;
	open: boolean;
	player: AppUser | undefined;
	onClose: (details: { oldId: string; newId: string } | undefined) => void;
}

function ChangePlayerDialog(props: ChangePlayerDialogProps) {
	const { onClose, player, open } = props;
	const usersState = useSelector(selectAppUsers);
	if (player == undefined) {
		return <div></div>;
	}

	const handleClose = () => {
		onClose(undefined);
	};
	const handleListItemClick = (newId: string) => {
		onClose({ oldId: player.id, newId });
	};
	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant='body1'>Who plays instead?</Typography>
			</DialogTitle>
			<List sx={{ pt: 0 }}>
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
	);
}

export default ChangePlayerDialog;
