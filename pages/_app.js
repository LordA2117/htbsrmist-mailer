import "../styles/globals.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };
    const handleComplete = () => setLoading(false);
    const handleError = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>HackTheBox CHENNAI</title>
        <meta name="title" content="HackTheBox CHENNAI" />
        <meta
          name="description"
          content="HackTheBox CHENNAI focuses on training the next-gen of cyber-warriors transforming cyberspace in CHENNAI and beyond."
        />
        <meta
          name="keywords"
          content="hack the box, hackthebox srmist, htbsrmist, cybersecurity, hacking, hack the box meetup, meetup, chennai, srmist"
        />
        <meta name="language" content="English" />
        <meta name="author" content="HackTheBox CHENNAI" />
        <meta
          name="copyright"
          content="All rights reserved | HackTheBox CHENNAI"
        />
        <meta httpEquiv="content-language" content="en" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.htbchennai.in" />
        <meta property="og:title" content="HackTheBox CHENNAI" />
        <meta
          property="og:description"
          content="HackTheBox CHENNAI focuses on training the next-gen of cyber-warriors transforming cyberspace in CHENNAI and beyond."
        />
        <meta property="og:image" content="/favicon.svg" />
        <link rel="icon" href="/favicon.svg" />
        <meta property="twitter:card" content="summary_large_image" />\
        <meta property="twitter:url" content="https://www.htbchennai.in" />
        <meta property="twitter:site" content="@htbsrmist" />
        <meta
          property="twitter:title"
          content="HackTheBox CHENNAI focuses on training the next-gen of cyber-warriors transforming cyberspace in CHENNAI and beyond."
        />
        <meta
          property="twitter:description"
          content="HackTheBox CHENNAI focuses on training the next-gen of cyber-warriors transforming cyberspace in CHENNAI and beyond."
        />
        <meta property="twitter:image" content="/favicon.svg" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          // crossorigin
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      
      {loading && (
        <div className="htb-loader-overlay">
          <div className="htb-spinner"></div>
          <div className="htb-loader-text">INITIALIZING...</div>
        </div>
      )}

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;