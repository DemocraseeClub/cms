import React from "react";
import "./App.css";
// import Footer from "./components/Footer";
import FirebaseCMS from "./FirebaseCMS";
import {createMuiTheme, responsiveFontSizes, ThemeProvider,} from "@material-ui/core/styles";

import {CMSMainView} from "@camberi/firecms";
import {UserContextProvider} from "./contexts/userContext"

const baseTheme = {
  typography: {
    fontFamily: [
      "Roboto",
      "Arial",
      '"Helvetica Neue"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      "sans-serif",
    ].join(","),
    button: { textDecoration: "none" },
    body: { fontSize: "1.75rem" },
    h1: { fontSize: "1.75rem" },
    h2: { fontSize: "1.5rem" },
    h3: { fontSize: "1.25rem" },
    h4: { fontSize: "1rem" },
    h5: { fontSize: ".9rem" },
    h6: { fontSize: ".8rem" }
  },
};

const lightMode = {
  spacing: 4,
  palette: {
    type: "light",
    primary: {
      main: "#095760",
      contrastText: "#C1D5D7",
    },
    secondary: {
      main: "#B9DFF4",
      contrastText: "#002866",
    },
    info: {
      main: "#005ea2",
      contrastText: "#ffffff",
    },
    error: {
      main: "#D83933",
      contrastText:"#fbffff"
    },
    background: {
      default: "#ffffff",
      paper: "#fbffff",
      contrastText:"#202020"
    },
  },
  overrides: {
    MuiPaper : {
      root : {
        color:'#000'
      }
    },
    MuiBox : {
      root : {
        color:'#000'
      }
    }
  }
};

const darkMode = {
  palette: {
    type: "dark",
    primary: {
      main: "#1194A3",
      contrastText: "#C1D5D7",
    },
    secondary: {
      main: "#B9DFF4",
      contrastText: "#04709a",
    },
    info: {
      main: "#005ea2",
      contrastText: "#ffffff",
    },
    error: {
      main: "#D83933",
      contrastText:"#fbffff"
    },
    background: {
      default: "#002e36",
      paper: "#132f36",
      contrastText: "#d0dce0",
    },
  },
  overrides: {
    MuiPaper : {
      root : {
        color:'#fff'
      }
    },
    MuiBox : {
      root : {
        color:'#fff'
      }
    }
  }
};

function App(props) {
  let appTheme = createMuiTheme(Object.assign(baseTheme, darkMode));
  appTheme = responsiveFontSizes(appTheme, { factor: 20 });
  if (process.env.NODE_ENV === "development") {
    console.log(appTheme);
  }

  const cmsParams = {
    primaryColor: appTheme.palette.primary[appTheme.palette.type],
    secondaryColor: appTheme.palette.secondary[appTheme.palette.type],
    name: "Democrasee",
    allowSkipLogin: false,
  };

  return (
    <ThemeProvider theme={appTheme}>
      <UserContextProvider>
        <FirebaseCMS dispatch={props.dispatch} {...cmsParams}>
            <div
              className="App"
              id={appTheme.palette.type === "dark" ? "darkMode" : "lightMode"}
              style={{ backgroundColor: appTheme.palette.background.default }}
            >
                <CMSMainView {...cmsParams} />
            </div>
        </FirebaseCMS>
      </UserContextProvider>
    </ThemeProvider>
  );
}

export default App;
