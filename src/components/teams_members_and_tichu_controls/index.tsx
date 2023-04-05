'use client';
import {type NextPage} from "next";
import * as React from 'react';
import {Button, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChangePlayerDialog from "~/components/change-player-dialog";
import {useDispatch, useSelector} from "react-redux";
import {gamePlayersSlice, selectGamePlayers} from "~/store/gamePlayersSlice";

const TeamsMembersAndTichuControls: NextPage = () => {
	const dispatch = useDispatch();
	const selector = useSelector(selectGamePlayers);
	const [open, setOpen] = React.useState(false);
	const handleClickListItem = () => {
		setOpen(true);
	};

	const handleClose = (newId?: string) => {
		console.log(newId);
		setOpen(false);
		if (newId) {
			dispatch(gamePlayersSlice.actions.newPlayerPlays({
				newId
			}));
		}
	};
	const handleTichuAndGrandTichu = (
		controlValue: string | null,
		id: string
	) => {
		const v = gamePlayersSlice.actions.tichuOrGrand({
			id,
			tichu: controlValue === 'tichu',
			grandTichu: controlValue === 'grandTichu'
		});
		dispatch(v);
	};

	return (
		<div className='grow-[2] grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] gap-y-[15px] gap-x-2.5'>
			{Object.entries(selector.players).map(([key, b]) => {
				return <div className="flex flex-col items-center justify-center" key={key}>
					<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
						<Typography variant="plain"
									className="col-start-2 flex items-center justify-center text-[1.8em]">
							{b.name}
						</Typography>
						{b.plays &&
                            <div className="ml-auto flex items-center justify-center text-[1.8em]">
								{/*{b.plays &&*/}
                                <Button className='m-0 p-0 leading-[normal]'
                                        onClick={handleClickListItem}>
                                    <SportsEsportsIcon className='text-[2em]'/>
                                </Button>
                                <ChangePlayerDialog
                                    id="ringtone-menu"
                                    keepMounted
                                    open={open}
                                    onClose={handleClose}
                                />
                            </div>
						}
					</div>
					<div className="flex w-full md:w-[50%] flex-row items-center justify-between grow-[2] text-[1.6em]">
						<ToggleButtonGroup
							fullWidth={true}
							className='flex w-full grow flex-row items-center justify-center'
							color='primary'
							value={b.tichu ? 'tichu' : b.grandTichu ? 'grandTichu' : ''}
							exclusive
							onChange={(e, value) => {
								handleTichuAndGrandTichu(value, b.id)
							}}
						>
							<ToggleButton
								className='text-black'
								value="tichu">
								Tichu
							</ToggleButton>
							<ToggleButton
								className='text-black'
								value="grandTichu"
								aria-label="centered">
								Grand
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>
			})}
		</div>
	);
};

export default TeamsMembersAndTichuControls;
