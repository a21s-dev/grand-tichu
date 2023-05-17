import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import { Link, useNavigate } from '@tanstack/router';
import StartNewGameDialog from '../start-new-game-dialog';
import { useSelector } from 'react-redux';
import { USERS_SELECTORS } from '../../store/usersSlice.ts';

function NavBar() {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const users = useSelector(USERS_SELECTORS.appUsers);
	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const [newGameDialog, setNewGameDialog] = React.useState(false);

	return (
		<React.Fragment>
			<AppBar color='primary' position='fixed'>
				<Toolbar className='grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center gap-3'>
					<Typography variant='h2' className='col-start-2 text-3xl'>
						<Link to='/'>
							Grand Tichu
						</Link>
					</Typography>
					<div className='ml-auto'>
						<IconButton color='secondary' onClick={handleMenu}>
							<MenuIcon />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={anchorEl != null}
							onClose={handleClose}
						>
							<MenuItem onClick={() => {
								if (users.length >= 4) {
									setNewGameDialog(true);
								}
								handleClose();
							}}>
								<Typography variant='body1'>New Game</Typography>
							</MenuItem>
							<MenuItem onClick={() => {
								navigate({ to: '/current-game' });
								handleClose();
							}}>
								<Typography variant='body1'>Current game</Typography>
							</MenuItem>
							<MenuItem onClick={() => {
								navigate({ to: '/users' });
								handleClose();
							}}>
								<Typography variant='body1'>All users</Typography>
							</MenuItem>
							<MenuItem onClick={() => {
								navigate({ to: '/games' });
								handleClose();
							}}>
								<Typography variant='body1'>All games</Typography>
							</MenuItem>
							<MenuItem onClick={() => {
								navigate({ to: '/about' });
								handleClose();
							}}>
								<Typography variant='body1'>About</Typography>
							</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<Toolbar />
			{(newGameDialog) &&
				<StartNewGameDialog
					keepMounted={false}
					open={newGameDialog}
					onClose={() => {
						setNewGameDialog(false);
					}}
				/>
			}
		</React.Fragment>
	);
}

export default NavBar;
