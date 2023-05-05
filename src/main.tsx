import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/router';
import { Provider } from 'react-redux';
import { STORE } from './store/store.ts';
import { orange } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material';
import SubmitScore from './pages/submit-score';
import Index from './pages/index';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Users from './pages/users';
import UserDetails from './pages/user-details';

const rootRoute = new RootRoute({
	component: () => {
		return (<>
			<Outlet />
		</>);
	},
});
const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Index,
});


const errorRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '404',
	component: () => {
		return (<>
			<div>404</div>
		</>);
	},
});

const submitScoreRoute = new Route({
	getParentRoute: () => rootRoute,
	path: 'submit-score',
	component: SubmitScore,
});

const usersRootRoute = new Route({
	path: 'users',
	getParentRoute: () => rootRoute,
	component: () => {
		return (<>
			<Outlet />
		</>);
	},
});

const usersIndexRoute = new Route({
	getParentRoute: () => usersRootRoute,
	path: '/',
	component: Users,
});

const userDetailsRoute = new Route({
	getParentRoute: () => usersRootRoute,
	path: '$userId',
	component: UserDetails,
});
// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
	indexRoute,
	errorRoute,
	submitScoreRoute,
	usersRootRoute.addChildren([usersIndexRoute, userDetailsRoute]),
]);

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
						<RouterProvider router={router} />
					</PersistGate>
				</Provider>
			</ThemeProvider>
		</React.StrictMode>,
	);
}
