import * as React from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ElderlyIcon from '@mui/icons-material/Elderly';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppUser, USERS_WEIRD_SELECTORS } from '../../store/usersSlice.ts';
import ChangePlayerDialog from '../change-player-dialog';
import ChangePlayerWhoDealsDialog from '../change-player-who-deals-dialog';
import { CURRENT_TURN_DETAILS_SELECTORS, currentGameSlice } from '../../store/currentGameSlice.ts';
import { GlobalState } from '../../store/store.ts';

function TeamsMembersAndTichuControls() {
	const store = useStore();
	const dispatch = useDispatch();
	const gamePlayers = useSelector(CURRENT_TURN_DETAILS_SELECTORS.gamePlayersInWeirdOrder);
	const playerDetails = useSelector(CURRENT_TURN_DETAILS_SELECTORS.playersWithDetails);
	const [openWhoDealsDialog, setOpenWhoDealsDialog] = React.useState(false);
	const [openChangePlayerDialog, setOpenChangePlayerDialog] =
		React.useState(false);
	const [playerToChange, setPlayerToChange] = React.useState<AppUser>();
	const handleCloseWhoDealsDialog = (newId?: string) => {
		setOpenWhoDealsDialog(false);
		if (newId) {
			dispatch(
				currentGameSlice.actions.newPlayerDeals({
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
		const newPlayer = USERS_WEIRD_SELECTORS.selectUserById(store.getState() as GlobalState, details.newId);
		if (newPlayer == undefined) {
			return;
		}
		dispatch(
			currentGameSlice.actions.replacePlayer({
				playerToRemoveId: details.oldId,
				newPlayer: {
					id: newPlayer.id,
					name: newPlayer.name,
					isMvp: newPlayer.isMvp
				},
			}),
		);
	};

	const handleTichuAndGrandTichu = (
		controlValue: string | null,
		id: string,
	) => {
		const v = currentGameSlice.actions.tichuOrGrand({
			playerId: id,
			tichu: controlValue === 'tichu',
			grandTichu: controlValue === 'grandTichu',
		});
		dispatch(v);
	};

	const getPlayerDetailsById = (playerId: string) => {
		const details = playerDetails.find(p => p.id === playerId);
		if (details == undefined) {
			throw new Error('');
		}
		return details;
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
							<div className='grid h-[2em] w-full grid-cols-[1fr_auto_auto_auto_1fr] gap-2 items-center'>
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
								{getPlayerDetailsById(player.id).isMvp && (
									<div className='ml-auto flex items-center justify-center text-[1.8em]'>
										<Button
											className='m-0 p-0 leading-[normal]'
										>
											<ElderlyIcon className='text-[2em]' />
										</Button>
									</div>
								)}
								{getPlayerDetailsById(player.id).deals && (
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
										getPlayerDetailsById(player.id).tichu
											? 'tichu'
											: getPlayerDetailsById(player.id).grandTichu
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
