import {type NextPage} from "next";
import * as React from 'react';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

const TeamsMembersAndTichuControls: NextPage = () => {
	const [alignment, setAlignment] = React.useState<string | null>('left');

	const handleAlignment = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string | null,
	) => {
		setAlignment(newAlignment);
	};
	return (
		<div className='grow-[2] grid grid-cols-[repeat(2,auto)] grid-rows-[repeat(2,auto)] gap-y-[15px] gap-x-2.5'>
			<div className="flex flex-col items-center justify-center">
				<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
					<div className="col-start-2 flex items-center justify-center text-[1.8em]">Rafael</div>
					<div className="m-0 ml-auto flex items-center justify-center p-0 text-[1.8em] leading-[normal]">
					</div>
				</div>

				<div className="flex flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						className='flex grow flex-row items-center justify-center'
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
					<div className="col-start-2 flex items-center justify-center text-[1.8em]">Rafael</div>
					<div className="m-0 ml-auto flex items-center justify-center p-0 text-[1.8em] leading-[normal]">
					</div>
				</div>

				<div className="flex flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						className='flex grow flex-row items-center justify-center'
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
					<div className="col-start-2 flex items-center justify-center text-[1.8em]">Rafael</div>
					<div className="m-0 ml-auto flex items-center justify-center p-0 text-[1.8em] leading-[normal]">
					</div>
				</div>

				<div className="flex flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						className='flex grow flex-row items-center justify-center'
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
					<div className="col-start-2 flex items-center justify-center text-[1.8em]">Rafael</div>
					<div className="m-0 ml-auto flex items-center justify-center p-0 text-[1.8em] leading-[normal]">
					</div>
				</div>

				<div className="flex flex-row items-center justify-between grow-[2] text-[1.6em]">
					<ToggleButtonGroup
						className='flex grow flex-row items-center justify-center'
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
