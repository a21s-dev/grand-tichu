import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import { Provider } from 'react-redux';
import { STORE } from './store/store.ts';
import { orange } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes.tsx';


const theme = createTheme({
	palette: {
		primary: {
			main: orange['A400'],
		},
		secondary: {
			main: '#FFFFFF',
		},
		text: {
			primary: '#000000',
			secondary: '#FFFFFF',
		},
	},
	typography: {
		fontFamily: ['Roboto'].join(','),
		h2: {
			color: 'white',
			backgroundColor: orange['A400'],
		},
		body1: {
			color: 'black',
			backgroundColor: 'white',
		},
	},
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	const persistor = persistStore(STORE);
	root.render(
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<Provider store={STORE}>
					<PersistGate loading={null} persistor={persistor}>
						<BrowserRouter>
							<AppRoutes isAuthenticated={true} />
						</BrowserRouter>
					</PersistGate>
				</Provider>
			</ThemeProvider>
		</React.StrictMode>,
	);
}
