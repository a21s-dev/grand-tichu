import {type NextPage} from "next";
import * as React from 'react';
import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {GamePlayer} from "~/store/gamePlayersSlice";
import {selectAppUsers} from "~/store/usersSlice";


export interface ChangePlayerDialogProps {
	open: boolean;
	player: GamePlayer | undefined;
	onClose: (details: {} | undefined) => void;
}

const ChangePlayerDialog: NextPage = (props: ChangePlayerDialogProps) => {
	const {onClose, player, open} = props;
	// console.log(player);

	const handleClose = () => {
		onClose(undefined);
	}
	const handleListItemClick = (newId: string) => {
		onClose({oldId: player!.id, newId});
	};
	const usersState = useSelector(selectAppUsers);
	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant='plain'>
					Who plays instead?
				</Typography>
			</DialogTitle>
			<List sx={{pt: 0}}>
				{Object
					.entries(usersState.users)
					.filter(([id, user]) => id !== player?.id)
					.map(([key, user]) => {
						return <ListItem key={key}>
							<ListItemButton
								onClick={() => handleListItemClick(user.id)}
							>
								<ListItemText
									className='flex items-center justify-center'
									primary={user.name}/>
							</ListItemButton>
						</ListItem>
					})}
			</List>
		</Dialog>
	);
};

export default ChangePlayerDialog;
