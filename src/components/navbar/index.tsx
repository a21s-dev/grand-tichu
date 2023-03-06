import {type NextPage} from "next";
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';

const NavBar: NextPage = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// setAuth(event.target.checked);
	};

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<React.Fragment>
			<AppBar color='primary' position="fixed">
				<Toolbar className='grid grid-cols-[1fr_repeat(1,auto)_1fr] justify-items-center gap-3'>
					<Typography variant="title" className='col-start-2 text-3xl'>
						Grand Tichu
					</Typography>
					<div className='ml-auto'>
						<IconButton
							color="secondary"
							onClick={handleMenu}
						>
							<MenuIcon/>
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
							<MenuItem onClick={handleClose}>New Game</MenuItem>
							<MenuItem onClick={handleClose}>Settings</MenuItem>
							<MenuItem onClick={handleClose}>Player Statistics</MenuItem>
							<MenuItem onClick={handleClose}>About</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<Toolbar/>
		</React.Fragment>
	);
};

export default NavBar;
