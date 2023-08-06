import { useState } from 'react';
import { auth } from '../../../firebase.ts';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../routes.tsx';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

function Signup() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = async (e: any) => {
		e.preventDefault();

		await createUserWithEmailAndPassword(auth, email, password)
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert('Something went wrong.');
			});
	};
	return (
		<>
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
		</>
	);

}

export default Signup;