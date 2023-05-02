import { useSelector } from 'react-redux';
import { CURRENT_TURN_DETAILS_SELECTORS } from '../../store/currentTurnDetailsSlice.ts';

function TeamsPlayers() {
	const players = useSelector(CURRENT_TURN_DETAILS_SELECTORS.gamePlayersInWeirdOrder);

	return (
		<div className='grid grow-[1] grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] gap-y-[10px] gap-x-2.5'>
			{players.map((player) => {
				return (
					<div
						className='flex flex-col items-center justify-center'
						key={player.id}
					>
						<div className='flex h-[2em] w-full items-center justify-center justify-items-center text-[1.5em]'>
							{player.name}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default TeamsPlayers;
