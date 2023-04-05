import {type NextPage} from "next";
import * as React from 'react';
import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectGamePlayers, selectPlayerWhoPlays} from "~/store/gamePlayersSlice";


export interface ChangePlayerDialogProps {
	open: boolean;
	selectedValue: string;
	onClose: (value?: string) => void;
}

const ChangePlayerDialog: NextPage = (props: ChangePlayerDialogProps) => {
	const {onClose, open} = props;


	const handleClose = () => {
		onClose();
	}
	const handleListItemClick = (newId: string) => {
		onClose(newId);
	};
	const gamePlayersState = useSelector(selectGamePlayers);
	const playerWhoPlays = useSelector(selectPlayerWhoPlays);
	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant='plain'>
					Who will deal the cards?
				</Typography>
			</DialogTitle>
			<List sx={{pt: 0}}>
				{Object
					.entries(gamePlayersState.players)
					.filter(([id, player]) => id !== playerWhoPlays.id)
					.map(([key, player]) => {
						return <ListItem key={key}>
							<ListItemButton
								onClick={() => handleListItemClick(player.id)}
							>
								<ListItemText
									className='flex items-center justify-center'
									primary={player.name}/>
							</ListItemButton>
						</ListItem>
					})}
			</List>
		</Dialog>
	);
};

export default ChangePlayerDialog;
