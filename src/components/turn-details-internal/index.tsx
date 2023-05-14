import { List, ListItem, ListSubheader } from '@mui/material';
import { PlayerIndex, TurnDetails } from '../../store/currentGameSlice.ts';


export interface GameDetailsProps {
	turn: TurnDetails;
}

function TurnDetailsInternal(props: GameDetailsProps) {
	const { turn } = props;

	const players = turn.players;

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
		<div className='grow-[1.5] flex flex-col justify-center'>
			<List className='pt-0 max-h-[400px]' sx={{ overflow: 'auto' }}>
				<ListSubheader className='text-black flex flex-col'>
					<div className='flex flex-row justify-around items-center'>
						<div className='w-[50%] flex justify-center items-center font-bold text-2xl'>
							{turn.score.team1.toString(10)}
						</div>
						<div className='w-[50%] flex justify-center items-center font-bold text-2xl'>
							{turn.score.team2.toString(10)}
						</div>
					</div>
					<div className='flex flex-row justify-around items-center'>
						<div className='font-bold'>{players.t1p1.name}</div>
						<div className='font-bold'>{players.t1p2.name}</div>
						<div className='font-bold'>{players.t2p1.name}</div>
						<div className='font-bold'>{players.t2p2.name}</div>
					</div>
				</ListSubheader>
				<ListItem className={'flex flex-col w-full h-[70px]'}>
					<div className='flex w-full flex-row justify-around items-center p-0'>
						<div>{playerTichuGrandTichu(turn, 't1p1')}</div>
						<div>{playerTichuGrandTichu(turn, 't1p2')}</div>
						<div>{playerTichuGrandTichu(turn, 't2p1')}</div>
						<div>{playerTichuGrandTichu(turn, 't2p2')}</div>
					</div>
				</ListItem>
			</List>
		</div>
	);

}

export default TurnDetailsInternal;