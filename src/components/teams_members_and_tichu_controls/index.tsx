import {type NextPage} from "next";
import * as React from 'react';
import {Button, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChangePlayerDialog from "~/components/change-player-dialog";

const TeamsMembersAndTichuControls: NextPage = () => {
	const [alignment, setAlignment] = React.useState<string | null>('left');
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('Dione');

	const handleClickListItem = () => {
		setOpen(true);
	};

	const handleClose = (newValue?: string) => {
		setOpen(false);

		if (newValue) {
			setValue(newValue);
		}
	};
	const handleAlignment = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string | null,
	) => {
		setAlignment(newAlignment);
	};
	return (
		<div className='grow-[2] grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] gap-y-[15px] gap-x-2.5'>
			<div className="flex flex-col items-center justify-center">
				<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
					<Typography variant="plain" className="col-start-2 flex items-center justify-center text-[1.8em]">
						Rafael
					</Typography>
					<div className="ml-auto flex items-center justify-center text-[1.8em]">
					</div>
				</div>

				<div className="flex w-full md:w-[50%] flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						fullWidth={true}
						className='flex w-full grow flex-row items-center justify-center'
						color='primary'
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
					>
						<ToggleButton
							className='text-black'
							value="left"
							aria-label="left aligned">
							Tichu
						</ToggleButton>
						<ToggleButton
							className='text-black'
							value="center"
							aria-label="centered">
							Grand
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
					<Typography variant="plain" className="col-start-2 flex items-center justify-center text-[1.8em]">
						Rafael
					</Typography>
					<div className="ml-auto flex items-center justify-center text-[1.8em]">
						<Button className='m-0 p-0 leading-[normal]' onClick={handleClickListItem}>
							<SportsEsportsIcon className='text-[2em]'/>
						</Button>
						<ChangePlayerDialog
							id="ringtone-menu"
							keepMounted
							open={open}
							onClose={handleClose}
							value={value}
						/>
					</div>
				</div>

				<div className="flex w-full md:w-[50%] flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						fullWidth={true}
						className='flex w-full grow flex-row items-center justify-center'
						color='primary'
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
					>
						<ToggleButton
							className='text-black'
							value="left"
							aria-label="left aligned">
							Tichu
						</ToggleButton>
						<ToggleButton
							className='text-black'
							value="center"
							aria-label="centered">
							Grand
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
					<Typography variant="plain" className="col-start-2 flex items-center justify-center text-[1.8em]">
						Rafael
					</Typography>
					<div className="ml-auto flex items-center justify-center text-[1.8em]">
					</div>
				</div>

				<div className="flex w-full md:w-[50%] flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						fullWidth={true}
						className='flex w-full grow flex-row items-center justify-center'
						color='primary'
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
					>
						<ToggleButton
							className='text-black'
							value="left"
							aria-label="left aligned">
							Tichu
						</ToggleButton>
						<ToggleButton
							className='text-black'
							value="center"
							aria-label="centered">
							Grand
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
					<Typography variant="plain" className="col-start-2 flex items-center justify-center text-[1.8em]">
						Rafael
					</Typography>
					<div className="ml-auto flex items-center justify-center text-[1.8em]">
					</div>
				</div>

				<div className="flex w-full md:w-[50%] flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						fullWidth={true}
						className='flex w-full grow flex-row items-center justify-center'
						color='primary'
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
					>
						<ToggleButton
							className='text-black'
							value="left"
							aria-label="left aligned">
							Tichu
						</ToggleButton>
						<ToggleButton
							className='text-black'
							value="center"
							aria-label="centered">
							Grand
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>
		</div>
	);
};

export default TeamsMembersAndTichuControls;
