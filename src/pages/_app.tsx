import {type AppType} from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const MyApp: AppType = ({Component, pageProps}) => {
  return <Component {...pageProps} />;
};

export default MyApp;
