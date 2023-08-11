// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AuthService } from './service/AuthService.ts';
import { StateService } from './service/StateService.ts';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: 'AIzaSyBUr-0xvlsdtIaL35nYBRKFhS9wAkGFNdY',
	authDomain: 'grand-tichu-4594d.firebaseapp.com',
	projectId: 'grand-tichu-4594d',
	storageBucket: 'grand-tichu-4594d.appspot.com',
	messagingSenderId: '435485002597',
	appId: '1:435485002597:web:57ef35156133e4fb32af8c',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const authService = new AuthService(auth);
export const stateService = new StateService(getFirestore(app), authService);
