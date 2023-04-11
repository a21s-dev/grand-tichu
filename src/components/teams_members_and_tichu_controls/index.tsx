'use client';
import {type NextPage} from "next";
import * as React from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChangePlayerWhoDealsDialog from "~/components/change-player-who-deals-dialog";
import {useDispatch, useSelector} from "react-redux";
import {GamePlayer, gamePlayersSlice, selectGamePlayers} from "~/store/gamePlayersSlice";
import ChangePlayerDialog from "~/components/change-player-dialog";

const TeamsMembersAndTichuControls: NextPage = () => {
	const dispatch = useDispatch();
	const selector = useSelector(selectGamePlayers);
	const [openWhoDealsDialog, setOpenWhoDealsDialog] = React.useState(false);
	const [openChangePlayerDialog, setOpenChangePlayerDialog] = React.useState(false);
	const [playerToChange, setPlayerToChange] = React.useState<GamePlayer>();
	const handleCloseWhoDealsDialog = (newId?: string) => {
		// console.log(newId);
		setOpenWhoDealsDialog(false);
		if (newId) {
			dispatch(gamePlayersSlice.actions.newPlayerDeals({
				newId
			}));
		}
	};
	const handleChangePlayerDialog = (newId?: string) => {
		setOpenChangePlayerDialog(false);
		// console.log(newId);
		// setOpenWhoDealsDialog(false);
		// if (newId) {
		// 	dispatch(gamePlayersSlice.actions.newPlayerDeals({
		// 		newId
		// 	}));
		// }
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
		<>
			<div className='grow-[2] grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] gap-y-[15px] gap-x-2.5'>
				{Object.entries(selector.players).map(([key, player]) => {
					return <div className="flex flex-col items-center justify-center" key={key}>
						<div className="grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center h-[2em] w-full">
							<Button
								variant="text"
								onClick={() => {
									setPlayerToChange(player);
									setOpenChangePlayerDialog(true)
								}}
								className="col-start-2 flex items-center justify-center text-[1.5em]">
								{player.name}
							</Button>
							{player.deals &&
                                <div className="ml-auto flex items-center justify-center text-[1.8em]">
                                    <Button className='m-0 p-0 leading-[normal]'
                                            onClick={() => {
												setOpenWhoDealsDialog(true)
											}}>
                                        <SportsEsportsIcon className='text-[2em]'/>
                                    </Button>
                                </div>
							}
						</div>
						<div
							className="flex w-full md:w-[50%] flex-row items-center justify-between grow-[2] text-[1.6em]">
							<ToggleButtonGroup
								fullWidth={true}
								className='flex w-full grow flex-row items-center justify-center'
								color='primary'
								value={player.tichu ? 'tichu' : player.grandTichu ? 'grandTichu' : ''}
								exclusive
								onChange={(e, value) => {
									handleTichuAndGrandTichu(value, player.id)
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
			<ChangePlayerWhoDealsDialog
				keepMounted
				open={openWhoDealsDialog}
				onClose={handleCloseWhoDealsDialog}
			/>
			<ChangePlayerDialog
				keepMounted
				open={openChangePlayerDialog}
				player={playerToChange}
				onClose={handleChangePlayerDialog}
			/>
		</>
	);
};

export default TeamsMembersAndTichuControls;
