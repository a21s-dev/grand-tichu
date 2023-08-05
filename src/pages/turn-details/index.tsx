import { useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GAMES_SELECTORS } from '../../store/gamesSlice.ts';
import NavBar from '../../components/navbar';
import TurnDetailsInternal from '../../components/turn-details-internal';
import { APP_ROUTES } from '../../routes.tsx';

function TurnDetails() {
	const navigate = useNavigate();
	const params = useParams();
	if (params.gameId == undefined) {
		navigate(APP_ROUTES.gamesRoute())
		throw new Error('');
	}
	const gameId = params.gameId;
	if (params.turnIndex == undefined) {
		navigate(APP_ROUTES.gameDetailsRoute(gameId))
		throw new Error('');
	}
	const game = useSelector(GAMES_SELECTORS.gameById(params.gameId));
	if (game == undefined) {
		navigate(APP_ROUTES.notFoundRoute())
		throw new Error('');
	}
	const turns = game.turns.slice(0, game.turns.length - 1);
	const turnIndex = parseInt(params.turnIndex) - 1;
	if (turnIndex > turns.length) {
		navigate(APP_ROUTES.gameDetailsRoute(gameId))
		throw new Error('');
	}
	const turn = turns[turnIndex];

	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<TurnDetailsInternal turn={turn} />
			</main>
		</div>
	);

}

export default TurnDetails;