import { useNavigate, useParams } from '@tanstack/router';
import { useSelector } from 'react-redux';
import NavBar from '../../components/navbar';
import { Typography } from '@mui/material';
import TurnDetailsInternal from '../../components/turn-details-internal';
import { CURRENT_TURN_DETAILS_SELECTORS, currentGameSlice } from '../../store/currentGameSlice.ts';
import { useAppDispatch } from '../../store/store.ts';

function CurrentGameTurnDetails() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const params = useParams();
	if (params.turnIndex == undefined) {
		navigate({ to: 'current-game' });
		throw new Error('');
	}
	const game = useSelector(CURRENT_TURN_DETAILS_SELECTORS.getGame);
	const turns = game.turns.slice(0, game.turns.length - 1);
	const turnIndex = parseInt(params.turnIndex) - 1;
	if (turnIndex > turns.length) {
		navigate({ to: 'current-game' });
		throw new Error('');
	}
	const turn = game.turns[turnIndex];
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<TurnDetailsInternal turn={turn} />
				<div>
					<div className='mt-auto flex items-center justify-center pt-10'>
						<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
							<button
								className='h-full w-full'
								onClick={() => {
									dispatch(currentGameSlice.actions.deleteTurn({ turnIndex }));
									navigate({ to: '/current-game' });
								}}
							>
								DELETE TURN ({turnIndex + 1}/{turns.length})
							</button>
						</Typography>
					</div>
				</div>
			</main>
		</div>
	);

}

export default CurrentGameTurnDetails;