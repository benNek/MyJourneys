import React, {useContext, useEffect} from 'react';
import {Route} from 'react-router';
import {parseUser} from "./utils/auth";
import Retrospective from "./components/Overview/Retrospective";
import Articles from "./components/Sharing/Articles";
import Layout from "./components/Layout";
import Journeys from "./components/Planner/Journeys";
import {Context} from "./state/store";
import {setUser} from "./state/actions";
import Journey from "./components/Planner/Journey";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import ArticleForm from "./components/Sharing/ArticleForm";
import Article from "./components/Sharing/Article";
import UploadPhotosPage from "./components/Overview/UploadPhotosPage";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {CssBaseline} from "@material-ui/core";
import PrivateRoute from "./components/PrivateRoute";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#FFF"
    }
  }
});

export default function App() {
  const [state, dispatch] = useContext(Context);
  const {darkMode} = state;
  
  useEffect(() => {
    setUser(dispatch, parseUser());
  }, [dispatch]);
  
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={darkMode ? darkTheme : createMuiTheme()}>
        <CssBaseline/>
        <Layout>
          <Route exact path='/' component={Retrospective}/>
          <PrivateRoute exact path='/journeys' component={Journeys}/>
          <PrivateRoute exact path='/journeys/:location.:id' component={Journey}/>
          <Route exact path='/articles' component={Articles}/>
          <PrivateRoute Route exact path='/article' component={ArticleForm}/>
          <Route exact path='/articles/:id' component={Article}/>
          <PrivateRoute Route exact path='/upload' component={UploadPhotosPage}/>
        </Layout>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}
