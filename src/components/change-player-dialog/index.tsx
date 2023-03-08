import {type NextPage} from "next";
import * as React from 'react';
import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";


export interface ChangePlayerDialogProps {
	open: boolean;
	selectedValue: string;
	onClose: (value: string) => void;
}

const ChangePlayerDialog: NextPage = (props: ChangePlayerDialogProps) => {
	const {onClose, selectedValue, open} = props;

	const handleClose = () => {
		onClose(selectedValue);
	}
	const handleListItemClick = (value: string) => {
		onClose(value);
	};
	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>
				<Typography variant='plain'>
					Who will deal the cards?
				</Typography>
			</DialogTitle>
			<List sx={{pt: 0}}>
				<ListItem>
					<ListItemButton
						onClick={() => handleListItemClick("")}
					>
						<ListItemText
							className='flex items-center justify-center'
							primary={"Raf"}/>
					</ListItemButton>
				</ListItem>

				<ListItem>
					<ListItemButton
						onClick={() => handleListItemClick("")}
					>
						<ListItemText
							className='flex items-center justify-center'
							primary={"Eratosthenis"}/>
					</ListItemButton>
				</ListItem>
			</List>
		</Dialog>
	);
};

export default ChangePlayerDialog;
