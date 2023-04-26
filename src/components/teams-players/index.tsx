import { type NextPage } from 'next';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectGamePlayersInWeirdOrder } from '~/store/gamePlayersSlice';

const TeamsPlayers: NextPage = () => {
	const players = useSelector(selectGamePlayersInWeirdOrder);

	return (
		<div className="grid grow-[1] grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] gap-y-[10px] gap-x-2.5">
			{players.map((player) => {
				return (
					<div
						className="flex flex-col items-center justify-center"
						key={player.id}
					>
						<div className="flex h-[2em] w-full items-center justify-center justify-items-center text-[1.5em]">
							{player.name}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TeamsPlayers;