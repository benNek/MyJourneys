import React, {useContext} from 'react';
import {Route} from 'react-router';
import Articles from "./components/Sharing/Articles";
import Layout from "./components/Layout";
import Journeys from "./components/Planner/Journeys";
import {Context} from "./state/store";
import Journey from "./components/Planner/Journey";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import ArticleForm from "./components/Sharing/ArticleForm";
import Article from "./components/Sharing/Article";
import UploadPhotosPage from "./components/Overview/UploadPhotosPage";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {CssBaseline} from "@material-ui/core";
import PrivateRoute from "./components/PrivateRoute";
import Overview from "./components/Overview/Overview";
import SettingsPage from "./components/SettingsPage";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#FFF"
    },
    info: {
      main: "#FFF"
    }
  }
});

export default function App() {
  const [state] = useContext(Context);
  const {darkMode} = state;
  
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={darkMode ? darkTheme : createMuiTheme()}>
        <CssBaseline/>
        <Layout>
          <Route exact path='/' component={Overview}/>
          <PrivateRoute exact path='/journeys' component={Journeys}/>
          <PrivateRoute exact path='/journeys/:location.:id' component={Journey}/>
          <Route exact path='/articles' component={Articles}/>
          <PrivateRoute Route exact path='/article' component={ArticleForm}/>
          <Route exact path='/articles/:id' component={Article}/>
          <PrivateRoute Route exact path='/upload' component={UploadPhotosPage}/>
          <PrivateRoute Route exact path='/settings' component={SettingsPage}/>
        </Layout>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}
