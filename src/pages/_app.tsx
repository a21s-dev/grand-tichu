import {type AppType} from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {wrapper} from "~/store/store";
import {Provider} from "react-redux";

const MyApp: AppType = ({Component, ...rest}) => {
	const {store, props} = wrapper.useWrappedStore(rest);
	const {pageProps} = props;

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
};

export default MyApp;
