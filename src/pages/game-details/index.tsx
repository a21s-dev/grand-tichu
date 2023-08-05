import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GAMES_SELECTORS } from '../../store/gamesSlice.ts';
import NavBar from '../../components/navbar';
import { Typography } from '@mui/material';
import GameDetailsInternal from '../../components/game-details';
import { useAppDispatch } from '../../store/store.ts';
import { CURRENT_TURN_EXTRA_ACTIONS } from '../../store/currentGameSlice.ts';
import { APP_ROUTES } from '../../routes.tsx';

function GameDetails() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const params = useParams();
	if (params.gameId == undefined) {
		navigate(APP_ROUTES.gamesRoute());
		throw new Error('');
	}
	const gameId = params.gameId;
	const game = useSelector(GAMES_SELECTORS.gameById(gameId));
	if (game == undefined) {
		navigate(APP_ROUTES.notFoundRoute());
		throw new Error('');
	}
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<GameDetailsInternal game={game} currentGame={false} />
				<div>
					<div className='mt-auto flex items-center justify-center pt-10'>
						<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
							<button
								className='h-full w-full'
								onClick={() => {
									navigate(APP_ROUTES.indexRoute());
									dispatch(CURRENT_TURN_EXTRA_ACTIONS.replaceCurrentWithHistory(gameId));
								}}
							>
								LOAD AS CURRENT
							</button>
						</Typography>
					</div>
				</div>
			</main>
		</div>
	);

}

export default GameDetails;