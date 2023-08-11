import {
	Auth,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

export class AuthService implements IAuthService {
	private static readonly LOCAL_STORAGE_USER_AUTH_STATUS_KEY = 'USER_AUTH_STATUS';
	private readonly _firebaseAuth: Auth;
	private readonly _authStatus: BehaviorSubject<AuthStatus>;


	constructor(firebaseAuth: Auth) {
		this._firebaseAuth = firebaseAuth;
		this._authStatus = new BehaviorSubject(this.initialUserAuthStatus());
		onAuthStateChanged(this._firebaseAuth, (user) => {
			console.log('Auth state changed:', user != null ? 'logged in' : 'logged out');
			if (user) {
				localStorage.setItem(AuthService.LOCAL_STORAGE_USER_AUTH_STATUS_KEY, AuthStatus.LoggedIn);
				this._authStatus.next(AuthStatus.LoggedIn);
			} else {
				if (this._authStatus.getValue() !== AuthStatus.LoggedIn) {
					return;
				}
				localStorage.setItem(AuthService.LOCAL_STORAGE_USER_AUTH_STATUS_KEY, AuthStatus.NotLoggedIn);
				this._authStatus.next(AuthStatus.NotLoggedIn);
			}
		});
	}

	private initialUserAuthStatus(): AuthStatus {
		const status = localStorage.getItem(AuthService.LOCAL_STORAGE_USER_AUTH_STATUS_KEY);
		if (status == null) {
			return AuthStatus.NotLoggedIn;
		}
		return status as AuthStatus;
	}

	currentUser(): { id: string; email: string | null } | null {
		const user = this._firebaseAuth.currentUser;
		if (user == null) {
			return null;
		}
		return { id: user.uid, email: user.email };
	}


	status(): Observable<AuthStatus> {
		return this._authStatus;
	}

	async login(email: string, password: string): Promise<void> {
		await signInWithEmailAndPassword(this._firebaseAuth, email, password);
	}

	async logout(): Promise<void> {
		await signOut(this._firebaseAuth);
	}

	async register(email: string, password: string): Promise<void> {
		await createUserWithEmailAndPassword(this._firebaseAuth, email, password);
	}

}

export enum AuthStatus {
	LoggedIn = 'LoggedIn',
	NotLoggedIn = 'NotLoggedIn',
}


interface IAuthService {

	currentUser(): { id: string, email: string | null } | null;

	status(): Observable<AuthStatus>;

	login(email: string, password: string): Promise<void>;

	logout(): Promise<void>;

	register(email: string, password: string): Promise<void>;

}