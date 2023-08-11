import { GlobalState } from '../store/store.ts';
import { AuthService } from './AuthService.ts';
import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';

export class StateService implements IStateService {
	private readonly _firestore: Firestore;
	private readonly _authService: AuthService;


	constructor(firestore: Firestore, authService: AuthService) {
		this._firestore = firestore;
		this._authService = authService;
	}

	isLocalStateNullOrEmpty(): boolean {
		const state = this.localState();
		if (state == null) {
			return true;
		}
		return state.users == null || Object.keys(state.users).length === 0;
	}

	localState(): GlobalState | undefined {
		const raw = localStorage.getItem('persist:root');
		if (raw == null) {
			return undefined;
		}
		return JSON.parse(raw) as GlobalState;
	}

	async remoteState(): Promise<GlobalState | undefined> {
		const user = this._authService.currentUser();
		if (user === null) {
			return undefined;
		}
		const documentReference = doc(this._firestore, 'state', user.id);
		const docSnap = await getDoc(documentReference);
		if (docSnap.exists()) {
			console.log('Remote state:', docSnap.data());
			return docSnap.data() as GlobalState;
		}
		console.log('No remote state available!');
		return undefined;
	}

	async saveStateToFirestore(): Promise<void> {
		if (this.isLocalStateNullOrEmpty()) {
			console.log('Local state is null or empty. Aborting save to Firestore.');
			return;
		}
		const state = this.localState();
		if (state == null) {
			console.log('Should never happen');
			return;
		}
		const user = this._authService.currentUser();
		if (user === null) {
			console.error('No user logged in. Aborting save to Firestore.');
			return;
		}
		const documentReference = doc(this._firestore, 'state', user.id);
		setDoc(documentReference, state)
			.then(() => {
				console.log('State saved to Firestore.');
			})
			.catch((error) => {
				console.error('Error saving state to Firestore:', error);
			});
	}

	async restoreStateFromFirestore(): Promise<void> {
		const remoteState = await this.remoteState();
		if (remoteState == null) {
			console.log('No remote state available!');
			return;
		}
		localStorage.setItem('persist:root', JSON.stringify(remoteState));
	}


}


interface IStateService {

	localState(): GlobalState | undefined;

	remoteState(): Promise<GlobalState | undefined>;

	isLocalStateNullOrEmpty(): boolean;

	saveStateToFirestore(): Promise<void>;

	restoreStateFromFirestore(): Promise<void>;

}