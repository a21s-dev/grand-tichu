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
import CurrentGameDetails from './pages/current-game-details';
import Games from './pages/games';
import GameDetails from './pages/game-details';
import TurnDetails from './pages/turn-details';
import CurrentGameTurnDetails from './pages/current-game-turn-details';

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

const currentGameRootRoute = new Route({
	path: 'current-game',
	getParentRoute: () => rootRoute,
	component: () => {
		return (<>
			<Outlet />
		</>);
	},
});
const currentGameIndexRoute = new Route({
	path: '/',
	getParentRoute: () => currentGameRootRoute,
	component: CurrentGameDetails,
});
const currentGameTurnDetailsRoute = new Route({
	path: '/turns/$turnIndex',
	getParentRoute: () => currentGameRootRoute,
	component: CurrentGameTurnDetails,
});


const gamesHistoryRootRoute = new Route({
	path: 'games',
	getParentRoute: () => rootRoute,
	component: () => {
		return (<>
			<Outlet />
		</>);
	},
});

const gamesHistoryIndexRoute = new Route({
	getParentRoute: () => gamesHistoryRootRoute,
	path: '/',
	component: Games,
});

const gameDetailsRootRoute = new Route({
	path: '$gameId',
	getParentRoute: () => gamesHistoryRootRoute,
	component: () => {
		return (<>
			<Outlet />
		</>);
	},
});

const gameDetailsIndexRoute = new Route({
	getParentRoute: () => gameDetailsRootRoute,
	path: '/',
	component: GameDetails,
});


const turnDetailsRoute = new Route({
	path: '/turns/$turnIndex',
	getParentRoute: () => gameDetailsRootRoute,
	component: TurnDetails,
});
// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
	indexRoute,
	errorRoute,
	submitScoreRoute,
	usersRootRoute.addChildren([usersIndexRoute, userDetailsRoute]),
	gamesHistoryRootRoute.addChildren([
		gamesHistoryIndexRoute,
		gameDetailsRootRoute.addChildren([gameDetailsIndexRoute, turnDetailsRoute])]),
	currentGameRootRoute.addChildren([currentGameIndexRoute, currentGameTurnDetailsRoute]),
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
