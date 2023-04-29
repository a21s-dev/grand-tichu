'use client';
import * as React from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppUsersState } from '../../store/usersSlice.ts';
import ChangePlayerDialog from '../change-player-dialog';
import {
	GamePlayer,
	gamePlayersSlice,
	selectGamePlayersInWeirdOrder,
} from '../../store/gamePlayersSlice.ts';
import ChangePlayerWhoDealsDialog from '../change-player-who-deals-dialog';

function TeamsMembersAndTichuControls() {
	const store = useStore();
	const dispatch = useDispatch();
	const gamePlayers = useSelector(selectGamePlayersInWeirdOrder);
	const [openWhoDealsDialog, setOpenWhoDealsDialog] = React.useState(false);
	const [openChangePlayerDialog, setOpenChangePlayerDialog] =
		React.useState(false);
	const [playerToChange, setPlayerToChange] = React.useState<GamePlayer>();
	const handleCloseWhoDealsDialog = (newId?: string) => {
		setOpenWhoDealsDialog(false);
		if (newId) {
			dispatch(
				gamePlayersSlice.actions.newPlayerDeals({
					newId,
				}),
			);
		}
	};
	const handleChangePlayerDialog = (
		details: { oldId: string; newId: string } | undefined,
	) => {
		setOpenChangePlayerDialog(false);
		if (details == undefined) {
			return;
		}
		const state: { users: AppUsersState } = store.getState() as {
			users: AppUsersState;
		};
		const appUsersState: AppUsersState = state.users;
		const newPlayer = appUsersState[details.newId];
		if (newPlayer == undefined) {
			return;
		}
		dispatch(
			gamePlayersSlice.actions.replacePlayer({
				playerToRemoveId: details.oldId,
				newPlayer: {
					id: newPlayer.id,
					name: newPlayer.name,
				},
			}),
		);
	};

	const handleTichuAndGrandTichu = (
		controlValue: string | null,
		id: string,
	) => {
		const v = gamePlayersSlice.actions.tichuOrGrand({
			id,
			tichu: controlValue === 'tichu',
			grandTichu: controlValue === 'grandTichu',
		});
		dispatch(v);
	};

	return (
		<>
			<div className='grid grow-[2] grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] gap-y-[15px] gap-x-2.5'>
				{gamePlayers.map((player) => {
					return (
						<div
							className='flex flex-col items-center justify-center'
							key={player.id}
						>
							<div className='grid h-[2em] w-full grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center'>
								<Button
									variant='text'
									onClick={() => {
										setPlayerToChange(player);
										setOpenChangePlayerDialog(true);
									}}
									className='col-start-2 flex items-center justify-center text-[1.5em]'
								>
									{player.name}
								</Button>
								{player.deals && (
									<div className='ml-auto flex items-center justify-center text-[1.8em]'>
										<Button
											className='m-0 p-0 leading-[normal]'
											onClick={() => {
												setOpenWhoDealsDialog(true);
											}}
										>
											<SportsEsportsIcon className='text-[2em]' />
										</Button>
									</div>
								)}
							</div>
							<div className='flex w-full grow-[2] flex-row items-center justify-between text-[1.6em] md:w-[50%]'>
								<ToggleButtonGroup
									fullWidth={true}
									className='flex w-full grow flex-row items-center justify-center'
									color='primary'
									value={
										player.tichu
											? 'tichu'
											: player.grandTichu
												? 'grandTichu'
												: ''
									}
									exclusive
									onChange={(_, value) => {
										handleTichuAndGrandTichu(value as string, player.id);
									}}
								>
									<ToggleButton className='text-black' value='tichu'>
										Tichu
									</ToggleButton>
									<ToggleButton
										className='text-black'
										value='grandTichu'
										aria-label='centered'
									>
										Grand
									</ToggleButton>
								</ToggleButtonGroup>
							</div>
						</div>
					);
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
}

export default TeamsMembersAndTichuControls;
