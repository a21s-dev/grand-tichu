// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { GlobalState } from './store/store.ts';

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

export const saveStateToFirestore = (state: GlobalState) => {
	const firestore = getFirestore(app);

	// const collectionRef = firestore.collection('reduxPersistState');
	const user = auth.currentUser; // If using Firebase Authentication
	if (user === null) {
		console.error('No user logged in.');
		return;
	}

	// Customize the document path if you need to organize data differently
	// const docRef = collectionRef.doc(user ? user.uid : 'defaultUser').collection('state').doc('appState');
	const documentReference = doc(firestore, 'state', user.uid);
	setDoc(documentReference, state)
		.then(() => {
			console.log('State saved to Firestore.');
		})
		.catch((error) => {
			console.error('Error saving state to Firestore:', error);
		});

	// docRef
	// 	.set(state)
	// 	.then(() => {
	// 		console.log('State saved to Firestore.');
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error saving state to Firestore:', error);
	// 	});
};
