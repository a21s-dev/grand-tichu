import { List, ListItem, ListSubheader } from '@mui/material';
import { PlayerIndex, TurnDetails } from '../../store/currentGameSlice.ts';
import { Game } from '../../store/gamesSlice.ts';
import * as React from 'react';
import ChangeWinningScoreDialog from '../change-winning-score-dialog';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../routes.tsx';


export interface GameDetailsProps {
	game: Game;
	currentGame?: boolean;
}

function GameDetails(props: GameDetailsProps) {
	const navigate = useNavigate();
	const { game, currentGame = true } = props;

	const latestTurn = game.turns[game.turns.length - 1];
	const latestTurnPlayers = latestTurn.players;
	const turns = game.turns.slice(0, game.turns.length - 1);//Last turn is the dummy one

	const [openChangeWinningScoreDialog, setOpenChangeWinningScoreDialog] = React.useState(false);
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
		<div className='grow-[1.5]'>
			<List className='pt-0 max-h-[400px]' sx={{ overflow: 'auto' }}>
				<ListSubheader className='text-black flex flex-col'>
					<div className='flex flex-row justify-between items-center'>
						<div className='w-[33%] flex justify-center items-center font-bold text-2xl'>
							{game.currentScore.team1.toString(10)}
						</div>
						<div className='w-[33%] flex justify-center items-center' onClick={() => {
							if (!currentGame) {
								return;
							}
							setOpenChangeWinningScoreDialog(true);
						}}>
							<span className=' border-4 font-bold text-3xl border-amber-600 border-dashed'>
							{game.winningScore.toString(10)}
							</span>
						</div>
						<div className='w-[33%] flex justify-center items-center font-bold text-2xl'>
							{game.currentScore.team2.toString(10)}
						</div>
					</div>
					<div className='flex flex-row justify-between items-center'>
						<div className='font-bold'>{latestTurnPlayers.t1p1.name}</div>
						<div className='font-bold'>{latestTurnPlayers.t1p2.name}</div>
						<div className='font-bold'>{latestTurnPlayers.t2p1.name}</div>
						<div className='font-bold'>{latestTurnPlayers.t2p2.name}</div>
					</div>
				</ListSubheader>
				{turns.map(r => r).reverse().map((turn, index) => {
					return <ListItem
						key={index}
						className={'flex flex-col w-full h-[70px] ' + (currentGame && index === 0 ? 'border-4 border-orange-300' : 'border')}
						onClick={() => {
							if (!currentGame) {
								navigate(APP_ROUTES.gameTurnDetailsRoute(game.id, (turns.length - index).toString(10)));
								return;
							}
							navigate(APP_ROUTES.currentGameSpecificTurnDetailsRoute((turns.length - index).toString(10)));
						}}>
						<div className='flex w-full flex-row justify-between items-center'>
							<div className='w-[33%] flex justify-center items-center font-bold  '>
								{turn.score.team1.toString(10)}
							</div>
							<div className='w-[33%] '>
							</div>
							<div className='w-[33%] flex justify-center items-center font-bold'>
								{turn.score.team2.toString(10)}
							</div>
						</div>
						<div className='flex w-full flex-row justify-between items-center p-0'>
							<div>{playerTichuGrandTichu(turn, 't1p1')}</div>
							<div>{playerTichuGrandTichu(turn, 't1p2')}</div>
							<div>{playerTichuGrandTichu(turn, 't2p1')}</div>
							<div>{playerTichuGrandTichu(turn, 't2p2')}</div>
						</div>
					</ListItem>;
				})}
			</List>
			{(openChangeWinningScoreDialog) &&
				<ChangeWinningScoreDialog
					keepMounted={false}
					open={openChangeWinningScoreDialog}
					onClose={() => {
						setOpenChangeWinningScoreDialog(false);
					}}
				/>
			}
		</div>
	);

}

export default GameDetails;