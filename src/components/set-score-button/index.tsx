import { Typography } from '@mui/material';
import { useNavigate } from '@tanstack/router';
import { useSelector } from 'react-redux';
import { CURRENT_TURN_DETAILS_SELECTORS } from '../../store/currentGameSlice.ts';
import * as React from 'react';
import GameEndedDialog from '../game-ended-dialog';

export interface SetScoreProps {
	gameEnded: boolean;
}

function SetScore(props: SetScoreProps) {
	const { gameEnded } = props;
	const navigate = useNavigate();
	const winner = useSelector(CURRENT_TURN_DETAILS_SELECTORS.winnerOfGame);
	const [openGameEndedDialog, setOpenGameEndedDialog] = React.useState(gameEnded);

	return (
		<>
			<div className='mt-auto flex items-center justify-center pt-10'>
				<Typography variant='h2' className='h-[3em] w-full text-[2em] text-white'>
					<button
						className='h-full w-full'
						onClick={() => {
							if (winner == undefined) {
								navigate({ to: '/submit-score' });
								return;
							}
							setOpenGameEndedDialog(true);
						}}
					>
						Set Score
					</button>
				</Typography>
			</div>
			{(openGameEndedDialog && winner != undefined) &&
				<GameEndedDialog
					keepMounted={false}
					open={openGameEndedDialog}
					team={winner}
					onClose={() => {
						setOpenGameEndedDialog(false);
					}}
				/>
			}
		</>
	);
}

export default SetScore;
