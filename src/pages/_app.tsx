import { AppProps } from "next/app";
import "@/styles/styles.scss";
import MobileOverlayWrapper from "./components/MobileOverlay";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Discover Lately</title>
        <link rel="icon" href="assets/favicon.ico" sizes="any" />
      </Head>
      <MobileOverlayWrapper>
        <Component {...pageProps} />
      </MobileOverlayWrapper>
    </>
  );
}

export default MyApp;
