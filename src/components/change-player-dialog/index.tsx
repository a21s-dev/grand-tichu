import {type NextPage} from 'next';
import * as React from 'react';
import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography,} from '@mui/material';
import {useSelector} from 'react-redux';
import type {GamePlayer} from '~/store/gamePlayersSlice';
import {selectAppUsers} from '~/store/usersSlice';

export interface ChangePlayerDialogProps {
	keepMounted: boolean;
	open: boolean;
	player: GamePlayer | undefined;
	onClose: (details: { oldId: string; newId: string } | undefined) => void;
}

const ChangePlayerDialog: NextPage<ChangePlayerDialogProps> = (
	props: ChangePlayerDialogProps,
) => {
	const {onClose, player, open} = props;
	const usersState = useSelector(selectAppUsers);
	if (player == undefined) {
		return <div></div>;
	}

	const handleClose = () => {
		onClose(undefined);
	};
	const handleListItemClick = (newId: string) => {
		onClose({oldId: player?.id, newId});
	};
	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant="body1">Who plays instead?</Typography>
			</DialogTitle>
			<List sx={{pt: 0}}>
				{usersState
					.filter((user) => user.id !== player?.id)
					.map((user) => {
						return (
							<ListItem key={user.id}>
								<ListItemButton onClick={() => handleListItemClick(user.id)}>
									<ListItemText
										className="flex items-center justify-center"
										primary={user.name}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
			</List>
		</Dialog>
	);
};

export default ChangePlayerDialog;
