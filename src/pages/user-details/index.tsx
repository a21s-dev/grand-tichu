import { useParams } from '@tanstack/router';
import { useSelector } from 'react-redux';
import { USERS_SELECTORS } from '../../store/usersSlice.ts';
import { Card, CardContent, Typography } from '@mui/material';
import NavBar from '../../components/navbar';

function UserDetails() {
	const params = useParams();
	if (params.userId == undefined) {
		throw new Error('');
	}
	const user = useSelector(USERS_SELECTORS.appUserById(params.userId));
	if (user == undefined) {
		throw new Error('');
	}
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main className='flex h-full w-full flex-col overflow-hidden'>
				<Card>
					<CardContent>
						<Typography>
							{user.id}
						</Typography>
						<Typography variant='h5'>
							Name: {user.name}
						</Typography>
					</CardContent>
				</Card>
			</main>
		</div>
	);

}

export default UserDetails;