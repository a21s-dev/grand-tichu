import NavBar from '../../components/navbar';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_TURN_DETAILS_SELECTORS, currentGameSlice } from '../../store/currentGameSlice.ts';
import GameDetails from '../../components/game-details';


function CurrentGameDetails() {
	const dispatch = useDispatch();
	const game = useSelector(CURRENT_TURN_DETAILS_SELECTORS.getGame);
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<GameDetails game={game} highlightLastTurn={true} />
				<div>
					<div className='mt-auto flex items-center justify-center pt-10'>
						<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
							<button
								className='h-full w-full'
								disabled={game.turns.length === 0}
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