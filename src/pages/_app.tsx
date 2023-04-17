import { type AppType } from 'next/dist/shared/lib/utils';

import '~/styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { wrapper } from '~/store/store';
import { Provider } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import {ThemeProvider} from "@mui/system";

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
const MyApp: AppType = ({ Component, ...rest }) => {
	const storeAndProps = wrapper.useWrappedStore(rest);

	return (
		<ThemeProvider theme={theme}>
			<Provider store={storeAndProps.store}>
				<Component {...storeAndProps.props} />
			</Provider>
		</ThemeProvider>
	);
};

export default MyApp;
