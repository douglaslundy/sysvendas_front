import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme/theme";
import createEmotionCache from "../src/createEmotionCache";
import FullLayout from "../src/layouts/FullLayout";
import "../styles/style.css";
import { Provider } from "react-redux";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
import store from "../src/store";
import Messages from "../src/components/messages";
import AlertDialog from "../src/components/alertDialog";
import Loading from "../src/components/loading";
import { parseCookies } from 'nookies';
import { AuthContext, AuthProvider } from "../src/contexts/AuthContext";

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [token, setToken] = useState();
  const { 'sysvendas.token': value } = parseCookies();
  const { tokens } = useContext(AuthContext);

  useEffect(() => {
    setToken(value);
  },[value, tokens])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>SysVendas - Sistema de Automação Comercial</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            {token ?
              <>
                <CssBaseline />
                <FullLayout>

                  <Loading />
                  <AlertDialog />
                  <Messages />

                  <Component {...pageProps} />

                </FullLayout>
              </>
              :
              <Component {...pageProps} />
            }
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
