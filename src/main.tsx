import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import { RootRoute, Route, Router, RouterProvider } from '@tanstack/router';
import { Provider } from 'react-redux';
import { STORE } from './store/store.ts';
import { orange } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material';
import SubmitScore from './pages/submit-score';
import Root from './components/Root.tsx';
import Index from './pages/index';

const rootRoute = new RootRoute({
	component: Root,
});
const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Index,
});

const submitScoreRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/submit-score',
	component: SubmitScore,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, submitScoreRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/router' {
	interface Register {
		router: typeof router;
	}
}
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
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<Provider store={STORE}>
					<RouterProvider router={router} />
				</Provider>
			</ThemeProvider>
		</React.StrictMode>,
	);
}
