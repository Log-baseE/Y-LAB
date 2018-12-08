import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { lightBlue } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const THEME = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Bahnschrift Light', 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
    fontSize: 12,
    lineHeight: 1,
  },
  palette: {
    type: 'dark',
    background: {
      default: '#272729',
      paper: '#2F2F35',
    },
    text: {
      default: '#fff',
      disabled: "rgba(255, 255, 255, 0.25)",
    },
    primary: {
      main: '#9A67EA',
    },
    action: {
      disabled: "rgba(255, 255, 255, 0.075)",
    }
  },
  
});

ReactDOM.render(
  <MuiThemeProvider theme={THEME}>
    <CssBaseline key='css-baseline' />
    <App key='app'/>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
