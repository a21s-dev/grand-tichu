import NavBar from '../../components/navbar';
import { List, ListItem, ListSubheader, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
	CURRENT_TURN_DETAILS_SELECTORS,
	currentGameSlice,
	PlayerIndex,
	TurnDetails,
} from '../../store/currentGameSlice.ts';


function CurrentGameDetails() {
	const dispatch = useDispatch();
	const gameDetails = useSelector(CURRENT_TURN_DETAILS_SELECTORS.getGameDetails);
	const latestTurnPlayers = useSelector(CURRENT_TURN_DETAILS_SELECTORS.gamePlayers);
	const turns = useSelector(CURRENT_TURN_DETAILS_SELECTORS.turns);


	const playerTichuGrandTichu = (turn: TurnDetails, playerIndex: PlayerIndex) => {
		const playersTichuGrandTichu = turn.playersTichuGrandTichu;
		const player = playersTichuGrandTichu[playerIndex];
		if (player.grandTichu) {
			return 'GT';
		}
		if (player.tichu) {
			return 'T';
		}
		return '';
	};
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<div className='grow-[1.5]'>
					<List className='pt-0 max-h-[400px]' sx={{
						overflow: 'auto',
					}}>
						<ListSubheader className='text-black flex flex-row w-full justify-between  border-2'>
							<div className='w-[50%]'>
								<div className='flex flex-col justify-center items-center p-0'>
									<div className='font-bold'>
													<span className='pr-1'>
													Team1
													</span>
										<span
											className='border-2 border-dashed border-[black] text-orange-600 font-bold p-0.5'
										>
													{gameDetails.currentScore.team1.toString(10)}
													</span>
									</div>
								</div>
								<div className='flex flex-row w-full justify-around'>
									<div className='font-bold'>{latestTurnPlayers.t1p1.name}</div>
									<div className='font-bold'>{latestTurnPlayers.t1p2.name}</div>
								</div>
							</div>
							<div className='w-[50%]'>
								<div className='flex flex-col justify-center items-center p-0'>
									<div className='font-bold'>
													<span className='pr-1'>
													Team2
													</span>
										<span
											className='border-2 border-dashed border-[black] text-orange-600 font-bold p-0.5'
										>
													{gameDetails.currentScore.team2.toString(10)}
													</span>
									</div>
								</div>
								<div className='flex flex-row w-full justify-around'>
									<div className='font-bold'>{latestTurnPlayers.t2p1.name}</div>
									<div className='font-bold'>{latestTurnPlayers.t2p2.name}</div>
								</div>
							</div>
						</ListSubheader>
						{turns.map(r=>r).reverse().map((turn, index) => {
							return <ListItem key={index}
															 className={'h-[50px] ' + (index === 0 ? 'border-4 border-orange-300' : 'border')}>
								<div className='w-[50%]'>
									<div className='flex flex-col justify-center items-center p-0'>
										<div className='font-bold'>
													<span className='pr-1'>
														{turn.score.team1}
													</span>
										</div>
									</div>
									<div className='flex flex-row w-full justify-around'>
										<div className='h-[25px]'>{playerTichuGrandTichu(turn, 't1p1')} </div>
										<div className='h-[25px]'>{playerTichuGrandTichu(turn, 't1p2')} </div>
									</div>
								</div>
								<div className='w-[50%]'>
									<div className='flex flex-col justify-center items-center p-0'>
										<div className='font-bold'>
													<span className='pr-1'>
														{turn.score.team2}
													</span>
										</div>
									</div>
									<div className='flex flex-row w-full justify-around'>
										<div className='h-[25px]'>{playerTichuGrandTichu(turn, 't2p1')} </div>
										<div className='h-[25px]'>{playerTichuGrandTichu(turn, 't2p2')} </div>
									</div>
								</div>
							</ListItem>;
						})}
					</List>
				</div>
				<div>
					<div className='mt-auto flex items-center justify-center pt-10'>
						<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
							<button
								className='h-full w-full'
								disabled={turns.length === 0}
								onClick={() => {
									dispatch(currentGameSlice.actions.deleteLastTurn());
								}}
							>
								DELETE LAST TURN
							</button>
						</Typography>
					</div>
				</div>
			</main>

		</div>
	);

}

export default CurrentGameDetails;