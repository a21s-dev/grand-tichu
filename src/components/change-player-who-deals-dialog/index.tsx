import {type NextPage} from 'next';
import * as React from 'react';
import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography,} from '@mui/material';
import {useSelector} from 'react-redux';
import {selectGamePlayersInWeirdOrder, selectPlayerWhoDeals,} from '~/store/gamePlayersSlice';

export interface ChangePlayerWhoDealsDialogProps {
	keepMounted: boolean;
	open: boolean;
	onClose: (value?: string) => void;
}

const ChangePlayerWhoDealsDialog: NextPage<ChangePlayerWhoDealsDialogProps> = (
	props: ChangePlayerWhoDealsDialogProps,
) => {
	const {onClose, open} = props;
	const gamePlayers = useSelector(selectGamePlayersInWeirdOrder);
	const playerWhoDeals = useSelector(selectPlayerWhoDeals);
	if (playerWhoDeals == undefined) {
		return <div></div>;
	}

	const handleClose = () => {
		onClose();
	};
	const handleListItemClick = (newId: string) => {
		onClose(newId);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant="body1">Who will deal the cards?</Typography>
			</DialogTitle>
			<List sx={{pt: 0}}>
				{gamePlayers
					.filter((player) => player.id !== playerWhoDeals.id)
					.map((player) => {
						return (
							<ListItem key={player.id}>
								<ListItemButton onClick={() => handleListItemClick(player.id)}>
									<ListItemText
										className="flex items-center justify-center"
										primary={player.name}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
			</List>
		</Dialog>
	);
};

export default ChangePlayerWhoDealsDialog;
