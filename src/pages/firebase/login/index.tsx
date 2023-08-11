import { useState } from 'react';
import { authService, stateService } from '../../../firebase.ts';
import { useNavigate } from 'react-router-dom';
import { Alert, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { APP_ROUTES } from '../../../routes.tsx';
import { useDispatch } from 'react-redux';
import { usersSlice } from '../../../store/usersSlice.ts';
import { gamesSlice } from '../../../store/gamesSlice.ts';
import { currentGameSlice } from '../../../store/currentGameSlice.ts';
import NavBar from '../../../components/navbar';

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onLogin = (e: any) => {
		e.preventDefault();
		authService.login(email, password)
			.then(async () => {
				const remoteState = await stateService.remoteState();
				if (remoteState == null) {
					console.warn('Remote state is null. Doing nothing.');
					return;
				}
				dispatch(usersSlice.actions.REPLACE_WHOLE_STATE(remoteState.users));
				dispatch(gamesSlice.actions.REPLACE_WHOLE_STATE(remoteState.games));
				dispatch(currentGameSlice.actions.REPLACE_WHOLE_STATE(remoteState.currentGame));
			})
			.catch((error) => {
				console.log(error);
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
				alert('Something is wrong :(');
			});

	};
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<main>
				<p className='flex justify-center items-center font-bold text-xl underline'>Login</p>
				<br />
				<section>
					<form className='flex flex-col justify-center items-center' onSubmit={onLogin}>
						<TextField
							label='Email address'
							required={true}
							autoFocus={true}
							name='email'
							type='email'
							placeholder='Email address'
							variant='outlined'
							onChange={(e) => setEmail(e.target.value)}
						/>

						<TextField
							label='Password'
							required={true}
							name='password'
							type='password'
							placeholder='Password'
							variant='outlined'
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div>
							<Button
								type='submit'
								onClick={onLogin}
							>
								Login
							</Button>
						</div>
					</form>
					<hr />
					<hr />

					<Alert severity='error'>Your local progress(as a guest) will be deleted if you have already some progress
						remotely</Alert>

					<br /><br /><br />
					<p className='text-sm text-black text-center'>
						No account yet? {' '}
						<Button
							onClick={() => {
								navigate(APP_ROUTES.signupRoute());
							}}>
							Sign up
						</Button>
					</p>
					<p className='text-sm text-black text-center'>
						Or continue as a guest pressing
						<Button
							onClick={() => {
								navigate(APP_ROUTES.indexRoute());
							}}>
							here
						</Button>
					</p>
				</section>
			</main>
		</div>
	);

}

export default Login;