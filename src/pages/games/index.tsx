import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import NavBar from '../../components/navbar';
import Box from '@mui/material/Box';
import { GAMES_SELECTORS } from '../../store/gamesSlice.ts';


const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 120, sortable: false, disableColumnMenu: true },
	{ field: 't1p1', headerName: '[1]Player1', width: 170, disableColumnMenu: true },
	{ field: 't1p2', headerName: '[1]Player2', width: 170, disableColumnMenu: true },
	{ field: 'score1', headerName: '[1]Score', width: 170, disableColumnMenu: true },
	{ field: 't2p1', headerName: '[2]Player1', width: 170, disableColumnMenu: true },
	{ field: 't2p2', headerName: '[2]Player2', width: 170, disableColumnMenu: true },
	{ field: 'score2', headerName: '[2]Score', width: 170, disableColumnMenu: true },
	{ field: 'winningScore', headerName: 'Winning score', width: 170, disableColumnMenu: true },

];

function Games() {
	const games = Array.from(Object.values(useSelector(GAMES_SELECTORS.games)))
		.map(game => {
			const latestTurn = game.turns[game.turns.length - 1];
			return {
				id: game.id,
				t1p1: latestTurn.players.t1p1.name,
				t1p2: latestTurn.players.t1p2.name,
				t2p1: latestTurn.players.t2p1.name,
				t2p2: latestTurn.players.t2p2.name,
				score1: game.currentScore.team1,
				score2: game.currentScore.team2,
				winningScore: game.winningScore,
			};
		});

	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<Box className='w-full h-full mt-auto flex flex-col items-center justify-center'>
					<DataGrid
						className='w-full'
						rows={games}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 },
							},
						}}
						pageSizeOptions={[5]}
						// onRowClick={(e) => {
						// }}
					/>
				</Box>
			</main>
		</div>
	);

}

export default Games;