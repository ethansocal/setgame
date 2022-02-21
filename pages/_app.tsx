import "../styles/globals.css";
import Head from "next/head";

function SetApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Set Game!</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default SetApp;
