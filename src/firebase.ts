// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyBUr-0xvlsdtIaL35nYBRKFhS9wAkGFNdY",
	authDomain: "grand-tichu-4594d.firebaseapp.com",
	projectId: "grand-tichu-4594d",
	storageBucket: "grand-tichu-4594d.appspot.com",
	messagingSenderId: "435485002597",
	appId: "1:435485002597:web:57ef35156133e4fb32af8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;