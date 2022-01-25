import "../styles/globals.css";
import Script from "next/script";
import { onGoogleScriptsLoad } from "utils/google";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://apis.google.com/js/api.js"
        onLoad={onGoogleScriptsLoad}
      ></Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
