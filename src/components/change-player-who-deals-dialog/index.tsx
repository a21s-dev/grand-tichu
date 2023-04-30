import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectGamePlayersInWeirdOrder, selectPlayersWithDetails } from '../../store/currentTurnDetailsSlice.ts';

export interface ChangePlayerWhoDealsDialogProps {
	keepMounted: boolean;
	open: boolean;
	onClose: (value?: string) => void;
}

function ChangePlayerWhoDealsDialog(props: ChangePlayerWhoDealsDialogProps) {
	const { onClose, open } = props;
	const gamePlayers = useSelector(selectGamePlayersInWeirdOrder);
	const playerDetails = useSelector(selectPlayersWithDetails);

	const getPlayerDetailsById = (playerId: string) => {
		const details = playerDetails.find(p => p.id === playerId);
		if (details == undefined) {
			throw new Error('');
		}
		return details;
	};

	const handleClose = () => {
		onClose();
	};
	const handleListItemClick = (newId: string) => {
		onClose(newId);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant='body1'>Who will deal the cards?</Typography>
			</DialogTitle>
			<List sx={{ pt: 0 }}>
				{gamePlayers
					.filter((player) => !getPlayerDetailsById(player.id).deals)
					.map((player) => {
						return (
							<ListItem key={player.id}>
								<ListItemButton onClick={() => handleListItemClick(player.id)}>
									<ListItemText
										className='flex items-center justify-center'
										primary={player.name}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
			</List>
		</Dialog>
	);
}

export default ChangePlayerWhoDealsDialog;
