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

interface AppRoutesProp {
	isAuthenticated: boolean;
}

const INDEX_ROUTE = '/';
const LOGIN_ROUTE = '/login';
const SIGNUP_ROUTE = '/signup';
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


const PrivateComponent = ({ Component, isAuthenticated }: { Component: any, isAuthenticated: boolean }) => {
	return isAuthenticated ? <Component /> : <Navigate to={LOGIN_ROUTE} />;
};

const AppRoutes = (props: AppRoutesProp): JSX.Element => {
		const { isAuthenticated } = props;

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
					<Route path={LOGIN_ROUTE} element={<p>Login Page</p>} />
				</Route>
				<Route
					element={
						<GuardedRoute
							isRouteAccessible={!isAuthenticated}
							redirectRoute={INDEX_ROUTE}
						/>
					}
				>
					<Route path={SIGNUP_ROUTE} element={<p>Signup Page</p>} />
				</Route>
				<Route path={INDEX_ROUTE} element={<PrivateComponent Component={Index} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={INDEX_ROUTE} isAuthenticated={isAuthenticated} element={<Index />} />*/}
				<Route path={SUBMIT_SCORE_ROUTE}
							 element={<PrivateComponent Component={SubmitScore} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={SUBMIT_SCORE_ROUTE} isAuthenticated={isAuthenticated} element={<SubmitScore />} />*/}
				<Route path={USERS_ROUTE} element={<PrivateComponent Component={Users} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={USERS_ROUTE} isAuthenticated={isAuthenticated} element={<Users />} />*/}
				<Route path={SPECIFIC_USER_DETAILS_ROUTE}
							 element={<PrivateComponent Component={UserDetails} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={SPECIFIC_USER_DETAILS_ROUTE} isAuthenticated={isAuthenticated} element={<UserDetails />} />*/}
				<Route path={CURRENT_GAME_ROUTE}
							 element={<PrivateComponent Component={CurrentGameDetails} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={CURRENT_GAME_ROUTE} isAuthenticated={isAuthenticated} element={<CurrentGameDetails />} />*/}
				<Route path={CURRENT_GAME_SPECIFIC_TURN_DETAILS_ROUTE}
							 element={<PrivateComponent Component={CurrentGameTurnDetails} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={CURRENT_GAME_SPECIFIC_TURN_DETAILS_ROUTE} isAuthenticated={isAuthenticated}*/}
				{/*								 element={<CurrentGameTurnDetails />} />*/}
				<Route path={GAMES_ROUTE} element={<PrivateComponent Component={Games} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={GAMES_ROUTE} isAuthenticated={isAuthenticated} element={<Games />} />*/}
				<Route path={GAME_DETAILS_ROUTE}
							 element={<PrivateComponent Component={GameDetails} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={GAME_DETAILS_ROUTE} isAuthenticated={isAuthenticated} element={<GameDetails />} />*/}
				<Route path={GAME_TURN_DETAILS_ROUTE}
							 element={<PrivateComponent Component={TurnDetails} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={GAME_TURN_DETAILS_ROUTE} isAuthenticated={isAuthenticated} element={<TurnDetails />} />*/}
				<Route path={GAME_DETAILS_ROUTE}
							 element={<PrivateComponent Component={GameDetails} isAuthenticated={isAuthenticated} />} />
				{/*<AppGuardedRoute path={GAME_DETAILS_ROUTE} isAuthenticated={isAuthenticated} element={<GameDetails />} />*/}
				<Route path='*' element={<NotFound />} />
			</Routes>
		);
	}
;

export default AppRoutes;