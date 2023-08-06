import NavBar from '../../../components/navbar';
import Button from '@mui/material/Button';
import { auth, getStateFromFirestore, saveStateToFirestore } from '../../../firebase.ts';
import { useDispatch, useStore } from 'react-redux';
import { GlobalState } from '../../../store/store.ts';
import { usersSlice } from '../../../store/usersSlice.ts';
import { gamesSlice } from '../../../store/gamesSlice.ts';
import { currentGameSlice } from '../../../store/currentGameSlice.ts';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


function Auth() {
	const navigate = useNavigate();
	const store = useStore();
	const dispatch = useDispatch();
	const [email, setEmail] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState(false);
	const [fetchOrSend, setFetchOrSend] = React.useState<'fetch' | 'send' | null>(null);
	const [localState, setLocalState] = React.useState<GlobalState | null>(null);
	const [remoteState, setRemoteState] = React.useState<GlobalState | null>(null);
	const [success, setSuccess] = React.useState(false);
	const [error, setError] = React.useState(false);
	const openConfirmationDialog = () => {
		setOpen(true);
	};
	const handleClose = (confirmed: boolean) => {
		setOpen(false);
		if (localState == null || remoteState == null) {
			return;
		}
		if (confirmed) {
			if (fetchOrSend === 'send') {
				try {
					saveStateToFirestore(localState);
					setSuccess(true);
					setTimeout(() => {
						setSuccess(false);
					}, 2000);
				} catch (e) {
					console.error(e);
					setError(true);
					setTimeout(() => {
						setError(false);
					}, 2000);
				}

				return;
			}
			if (fetchOrSend === 'fetch') {
				dispatch(usersSlice.actions.REPLACE_WHOLE_STATE(remoteState.users));
				dispatch(gamesSlice.actions.REPLACE_WHOLE_STATE(remoteState.games));
				dispatch(currentGameSlice.actions.REPLACE_WHOLE_STATE(remoteState.currentGame));
				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
				}, 2000);
				return;
			}
		}
	};

	const isOnline = window.navigator.onLine;


	React.useEffect(() => {
		setTimeout(() => {
			const user = auth.currentUser;
			if (user == null) {
				return;
			}
			const email = user.email;
			setEmail(email);
		}, 1000);

	}, []);


	return (
		<div className='fixed flex h-full w-full flex-col'>
			<NavBar />
			{!isOnline && <div>Offline!</div>}
			<br />
			{email && <div className='flex justify-center items-center'>Logged in as {email}</div>}
			{isOnline && <main className='flex h-full w-full flex-col overflow-hidden justify-center items-center'>
				<Button
					variant='outlined'
					className='m-2 text-black'
					onClick={async () => {
						const localState = store.getState() as GlobalState;
						const remoteState = await getStateFromFirestore();
						if (remoteState == null) {
							saveStateToFirestore(localState);
							return;
						}
						setFetchOrSend('send');
						setLocalState(localState);
						setRemoteState(remoteState);
						openConfirmationDialog();
					}}
				>
					Save local state to remote
				</Button>
				<Button
					variant='outlined'
					className='m-2 text-black'
					onClick={async () => {
						const localState = store.getState() as GlobalState;
						const remoteState = await getStateFromFirestore();
						if (remoteState == null) {
							console.warn('Remote state is null. Doing nothing!');
							return;
						}
						setFetchOrSend('fetch');
						setLocalState(localState);
						setRemoteState(remoteState);
						openConfirmationDialog();
					}}
				>
					Load remote state to local
				</Button>
				<Button
					variant='contained'
					className='m-2 text-black flex flex-col'
					onClick={() => {
						signOut(auth).then(() => {
							navigate('/');
							console.log('Signed out successfully');
						});
					}}
				>
					<b>Logout</b>
					<p>
					(Local state will be lost)
					</p>
				</Button>
				{success &&
					<Alert severity='success' variant='filled' onClose={() => {
						setSuccess(false);
					}}>
						Success
					</Alert>
				}
				{error &&
					<Alert severity='error' variant='filled' onClose={() => {
						setError(false);
					}}>
						Something went wrong
					</Alert>
				}
			</main>
			}
			<ConfirmationDialogRaw
				id='ringtone-menu'
				keepMounted
				open={open}
				onClose={handleClose}
				fetchOrSend={fetchOrSend}
				localUsersLength={localState && Object.keys(localState.users).length || 0}
				localGamesLength={localState && Object.keys(localState.games).length || 0}
				remoteUsersLength={remoteState && Object.keys(remoteState.users).length || 0}
				remoteGamesLength={remoteState && Object.keys(remoteState.games).length || 0}
			/>;
		</div>
	);
}

interface ConfirmationDialogRawProps {
	id: string;
	keepMounted: boolean;
	open: boolean;
	onClose: (value: boolean) => void;
	fetchOrSend: 'fetch' | 'send' | null;
	localUsersLength: number;
	localGamesLength: number;
	remoteUsersLength: number;
	remoteGamesLength: number;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
	const {
		onClose,
		open,
		fetchOrSend,
		localUsersLength,
		localGamesLength,
		remoteUsersLength,
		remoteGamesLength,
		...other
	} = props;
	const handleCancel = () => {
		onClose(false);
	};

	const handleOk = () => {
		onClose(true);
	};

	const moreRemoteUsers = () => remoteUsersLength > localUsersLength;
	const moreRemoteGames = () => remoteGamesLength > localGamesLength;

	const moreLocalUsers = () => localUsersLength > remoteUsersLength;
	const moreLocalGames = () => localGamesLength > remoteGamesLength;

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
			maxWidth='xs'
			open={open}
			{...other}
		>
			<DialogTitle>
				Are you sure?
			</DialogTitle>
			<DialogContent>
				<ul>
					<li>[users] Remote:{remoteUsersLength} | Local: {localUsersLength}</li>
					<li>[games] Remote:{remoteGamesLength} | Local: {localGamesLength}</li>
					{fetchOrSend === 'send' && (
						<>
							{moreRemoteUsers() && <li>Remote state has more users!</li>}
							{moreRemoteGames() && <li>Remote state has more games!</li>}
						</>
					)}
					{fetchOrSend === 'fetch' && (
						<>
							{moreLocalUsers() && <li>Local state has more users!</li>}
							{moreLocalGames() && <li>Local state has more games!</li>}
						</>
					)}
				</ul>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel}>
					Cancel
				</Button>
				<Button onClick={handleOk}>Ok</Button>
			</DialogActions>
		</Dialog>
	);
}

export default Auth;