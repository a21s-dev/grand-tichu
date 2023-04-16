'use client';
import {type NextPage} from "next";
import * as React from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChangePlayerWhoDealsDialog from "~/components/change-player-who-deals-dialog";
import {useDispatch, useSelector, useStore} from "react-redux";
import {GamePlayer, gamePlayersSlice, selectGamePlayersInWeirdOrder} from "~/store/gamePlayersSlice";
import ChangePlayerDialog from "~/components/change-player-dialog";

const TeamsMembersAndTichuControls: NextPage = () => {
	const store = useStore();
	const dispatch = useDispatch();
	const gamePlayers = useSelector(selectGamePlayersInWeirdOrder);
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
	const handleChangePlayerDialog = (details: { oldId: string, newId: string } | undefined) => {
		setOpenChangePlayerDialog(false);
		console.log(details);
		if (details == undefined) {
			return;
		}
		console.log(store.getState())
		const users = store.getState().users.users;
		const newPlayer = users[details.newId];
		console.log(newPlayer)
		dispatch(gamePlayersSlice.actions.replacePlayer({
			playerToRemoveId: details.oldId,
			newPlayer: {
				id: newPlayer.id,
				name: newPlayer.name
			}
		}));
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
				{gamePlayers.map(player => {
					return <div className="flex flex-col items-center justify-center" key={player.id}>
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
