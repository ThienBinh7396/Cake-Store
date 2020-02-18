import React from "react";
import "./App.css";

import MainLayout from "./views/MainLayout";
import { createMuiTheme, ThemeProvider,  IconButton } from "@material-ui/core";
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import { SnackbarProvider } from "notistack";
import BaseIcon from "./common/component/BaseIcon";
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3f6ad8"
    },
    secondary: {
      main: "#00ad5f"
    },
    blur: {
      main: "#999"
    },
    error: {
      main: "#ff1010"
    },
    default: {
      main: '#fff'
    },
    text: {
      main: '#343a40'
    },
    active: {
      main: '#3f6ad8'
    }
  }
});

const store = configureStore();

const notistackRef = React.createRef();
const onClickDismiss = key => () => { 
  notistackRef.current.closeSnackbar(key);
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          ref={notistackRef}
          autoHideDuration={5000}
          action={(key) => <IconButton component="span" size="small" onClick={onClickDismiss(key)}>
            <BaseIcon icon="fas fa-times" style={{ color: '#fff', marginRight: '6px' }}></BaseIcon>
          </IconButton>}
        >
          <MainLayout />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
