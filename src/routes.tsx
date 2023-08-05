import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import NotFound from './pages/not-found';
import Index from './pages/index';
import SubmitScore from './pages/submit-score';
import Users from './pages/users';
import UserDetails from './pages/user-details';
import CurrentGameDetails from './pages/current-game-details';
import CurrentGameTurnDetails from './pages/current-game-turn-details';
import Games from './pages/games';
import GameDetails from './pages/game-details';
import TurnDetails from './pages/turn-details';
import About from './pages/about';
import { useStore } from 'react-redux';
import { GlobalState } from './store/store.ts';
import { USERS_WEIRD_SELECTORS } from './store/usersSlice.ts';
import SignIn from './pages/firebase/sign-in';
import Signup from './pages/firebase/sign-up';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.ts';


const INDEX_ROUTE = '/';
const LOGIN_ROUTE = '/login';
const SIGNUP_ROUTE = '/signup';
const LOGOUT_ROUTE = '/logout';
const SUBMIT_SCORE_ROUTE = 'submit-score';
const USERS_ROUTE = '/users';
const SPECIFIC_USER_DETAILS_ROUTE = '/users/:userId';
const CURRENT_GAME_ROUTE = '/current-game';
const CURRENT_GAME_SPECIFIC_TURN_DETAILS_ROUTE = '/current-game/turns/:turnIndex';
const GAMES_ROUTE = '/games';
const GAME_DETAILS_ROUTE = '/games/:gameId';
const GAME_TURN_DETAILS_ROUTE = '/games/:gameId/turns/:turnIndex';
const ABOUT_ROUTE = '/about';
const NOT_FOUND_ROUTE = '/not-found';

export const APP_ROUTES = {
	indexRoute: () => INDEX_ROUTE,
	loginRoute: () => LOGIN_ROUTE,
	signupRoute: () => SIGNUP_ROUTE,
	logoutRoute: () => LOGOUT_ROUTE,
	submitScoreRoute: () => SUBMIT_SCORE_ROUTE,
	usersRoute: () => USERS_ROUTE,
	specificUserDetailsRoute: (userId: string) => SPECIFIC_USER_DETAILS_ROUTE.replace(':userId', userId),
	currentGameRoute: () => CURRENT_GAME_ROUTE,
	currentGameSpecificTurnDetailsRoute: (turnIndex: string) => CURRENT_GAME_SPECIFIC_TURN_DETAILS_ROUTE.replace(':turnIndex', turnIndex),
	gamesRoute: () => GAMES_ROUTE,
	gameDetailsRoute: (gameId: string) => GAME_DETAILS_ROUTE.replace(':gameId', gameId),
	gameTurnDetailsRoute: (gameId: string, turnIndex: string) => GAME_TURN_DETAILS_ROUTE.replace(':gameId', gameId).replace(':turnIndex', turnIndex),
	aboutRoute: () => ABOUT_ROUTE,
	notFoundRoute: () => NOT_FOUND_ROUTE,
};

interface GuardedRouteProps {
	isRouteAccessible?: boolean;
	redirectRoute?: string;
}

const GuardedRoute = ({
												isRouteAccessible = false,
												redirectRoute = '/',
											}: GuardedRouteProps): JSX.Element =>
	isRouteAccessible ? <Outlet /> : <Navigate to={redirectRoute} replace />;


const Needs4UsersComponent = ({ Component }: { Component: any }) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const store = useStore();
	const state = store.getState() as GlobalState;
	const players = USERS_WEIRD_SELECTORS.users(state);
	return players.length < 4 ? <Navigate to={USERS_ROUTE} /> : <Component />;
};

const PrivateComponent = ({ Component, isAuthenticated, needs4Users = true }: {
	Component: any,
	isAuthenticated: boolean,
	needs4Users?: boolean
}) => {
	if (!isAuthenticated) return <Navigate to={LOGIN_ROUTE} replace />;
	if (!needs4Users) return <Component />;
	return <Needs4UsersComponent Component={Component} />;
};
const AppRoutes = (): JSX.Element => {
		const [isAuthenticated, setIsAuthenticated] = useState(false);
		useEffect(() => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					// User is signed in, see docs for a list of available properties
					// https://firebase.google.com/docs/reference/js/firebase.User
					const uid = user.uid;
					// ...
					console.log('uid', uid);
					setIsAuthenticated(true);
				} else {
					// User is signed out
					// ...
					console.log('user is logged out');
					setIsAuthenticated(false);
				}
			});
		}, []);

		return (
			<Routes>
				<Route path={ABOUT_ROUTE} element={<About />} />
				<Route
					element={
						<GuardedRoute
							isRouteAccessible={!isAuthenticated}
							redirectRoute={INDEX_ROUTE}
						/>
					}
				>
					<Route path={LOGIN_ROUTE} element={<SignIn />} />
				</Route>
				<Route
					element={
						<GuardedRoute
							isRouteAccessible={!isAuthenticated}
							redirectRoute={INDEX_ROUTE}
						/>
					}
				>
					<Route path={SIGNUP_ROUTE} element={<Signup />} />
				</Route>
				<Route path={INDEX_ROUTE} element={<PrivateComponent Component={Index} isAuthenticated={isAuthenticated} />} />
				<Route path={SUBMIT_SCORE_ROUTE}
							 element={<PrivateComponent Component={SubmitScore} isAuthenticated={isAuthenticated} />} />
				<Route path={USERS_ROUTE}
							 element={<PrivateComponent Component={Users} isAuthenticated={isAuthenticated} needs4Users={false} />} />
				<Route path={SPECIFIC_USER_DETAILS_ROUTE}
							 element={<PrivateComponent Component={UserDetails} isAuthenticated={isAuthenticated} />} />
				<Route path={CURRENT_GAME_ROUTE}
							 element={<PrivateComponent Component={CurrentGameDetails} isAuthenticated={isAuthenticated} />} />
				<Route path={CURRENT_GAME_SPECIFIC_TURN_DETAILS_ROUTE}
							 element={<PrivateComponent Component={CurrentGameTurnDetails} isAuthenticated={isAuthenticated} />} />
				<Route path={GAMES_ROUTE} element={<PrivateComponent Component={Games} isAuthenticated={isAuthenticated} />} />
				<Route path={GAME_DETAILS_ROUTE}
							 element={<PrivateComponent Component={GameDetails} isAuthenticated={isAuthenticated} />} />
				<Route path={GAME_TURN_DETAILS_ROUTE}
							 element={<PrivateComponent Component={TurnDetails} isAuthenticated={isAuthenticated} />} />
				<Route path={GAME_DETAILS_ROUTE}
							 element={<PrivateComponent Component={GameDetails} isAuthenticated={isAuthenticated} />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		);
	}
;

export default AppRoutes;