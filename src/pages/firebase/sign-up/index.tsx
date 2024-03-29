import { useState } from 'react';
import { authService } from '../../../firebase.ts';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../routes.tsx';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import NavBar from '../../../components/navbar';

function Signup() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = async (e: any) => {
		e.preventDefault();

		await authService.register(email, password)
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert('Something went wrong.');
			});
	};
	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			<p className='flex justify-center items-center font-bold text-xl underline'>Register</p>
			<main>
				<br />
				<section>
					<form className='flex flex-col justify-center items-center' onSubmit={onSubmit}>
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
								onClick={onSubmit}
							>
								Sign up
							</Button>
						</div>
					</form>
					<hr />
					<hr />
					<br /><br /><br />
					<p className='text-sm text-black text-center'>
						Have an account? {' '}
						<Button
							onClick={() => {
								navigate(APP_ROUTES.loginRoute());
							}}>
							Login
						</Button>
					</p>
				</section>
			</main>
		</div>
	);

}

export default Signup;