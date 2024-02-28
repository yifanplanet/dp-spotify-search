import { AppProps } from "next/app";
import "@/styles/styles.scss";
import MobileOverlayWrapper from "./components/MobileOverlay";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MobileOverlayWrapper>
      <Component {...pageProps} />
    </MobileOverlayWrapper>
  );
}

export default MyApp;
