import NavBar from '../../components/navbar';
import { Card, CardContent, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { CURRENT_TURN_DETAILS_SELECTORS, PlayerIndex, TurnDetails } from '../../store/currentGameSlice.ts';


function CurrentGameDetails() {
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
		<div className='flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col'>
				<div className='flex flex-row w-full justify-between pb-5 top-15'>
					<Card className='w-[50%]'>
						<CardContent className='flex flex-col justify-center items-center p-0'>
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
							<div className='flex flex-row w-full justify-around'>
								<div className='font-bold'>{latestTurnPlayers.t1p1.name}</div>
								<div className='font-bold'>{latestTurnPlayers.t1p2.name}</div>
							</div>
						</CardContent>
					</Card>
					<Card className='w-[50%]'>
						<CardContent className='flex flex-col justify-center items-center p-0'>
							<div className='font-bold'>
								<span className='pr-2'>
								Team1
								</span>
								<span
									className='border-2 border-dashed border-[black] text-orange-600 font-bold p-0.5'
								>
								{gameDetails.currentScore.team2.toString(10)}
								</span>
							</div>
							<div className='flex flex-row w-full justify-around'>
								<div className='font-bold'>{latestTurnPlayers.t2p1.name}</div>
								<div className='font-bold'>{latestTurnPlayers.t2p2.name}</div>
							</div>
						</CardContent>
					</Card>
				</div>
				{turns.map((turn, index) => {
					return <div key={index} className='flex flex-row w-full justify-between pb-1'>
						<Card className='w-[50%] h-[50px]'>
							<CardContent className='flex flex-col justify-center items-center p-0'>
								<div>{turn.score.team1}</div>
								<div className='flex flex-row w-full justify-around'>
									<div>{playerTichuGrandTichu(turn, 't1p1')} </div>
									<div>{playerTichuGrandTichu(turn, 't1p2')} </div>
								</div>
							</CardContent>
						</Card>
						<Divider orientation='vertical' flexItem sx={{ borderRightWidth: 8 }} />
						<Card className='w-[50%] h-[50px]'>
							<CardContent className='flex flex-col justify-center items-center p-0'>
								<div>{turn.score.team1}</div>
								<div className='flex flex-row w-full justify-around'>
									<div>{playerTichuGrandTichu(turn, 't2p1')} </div>
									<div>{playerTichuGrandTichu(turn, 't2p2')} </div>
								</div>
							</CardContent>
						</Card>
					</div>;
				})}
			</main>
		</div>
	);

}

export default CurrentGameDetails;