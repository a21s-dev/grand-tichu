import { useState } from 'react';
import { auth } from '../../../firebase.ts';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../routes.tsx';

function Signup() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = async (e: any) => {
		e.preventDefault();

		await createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log(user);
				// navigate('/login');
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};
	return (
		<main>
			<section>
				<div>
					<div>
						<form>
							<div>
								<label htmlFor='email-address'>
									Email address
								</label>
								<input
									type='email'
									// label='Email address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									placeholder='Email address'
								/>
							</div>

							<div>
								<label htmlFor='password'>
									Password
								</label>
								<input
									type='password'
									// label='Create password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									placeholder='Password'
								/>
							</div>

							<button
								type='submit'
								onClick={onSubmit}
							>
								Sign up
							</button>

						</form>

						<p>
							Already have an account?{' '}
							<button
								onClick={() => {
									navigate(APP_ROUTES.loginRoute());
								}}
							>
								Sign in
							</button>
						</p>
					</div>
				</div>
			</section>
		</main>
	);

}

export default Signup;