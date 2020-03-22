import React, {useContext, useEffect} from 'react';
import {Route} from 'react-router';
import {parseUser} from "./utils/auth";
import Retrospective from "./components/Retrospective/Retrospective";
import Articles from "./components/Sharing/Articles";
import ArticleCreation from "./components/Sharing/ArticleCreation";
import Blog from "./components/Sharing/Blog";
import Layout from "./components/Layout";
import Journeys from "./components/Planner/Journeys";
import {Context} from "./state/store";
import {setUser} from "./state/actions";
import Journey from "./components/Planner/Journey";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

export default function App() {
  const dispatch = useContext(Context)[1];
  useEffect(() => {
    setUser(dispatch, parseUser());
  }, [dispatch]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Layout>
        <Route exact path='/' component={Retrospective}/>
        <Route exact path='/journeys' component={Journeys}/>
        <Route exact path='/journeys/:location.:id' component={Journey}/>
        <Route exact path='/articles' component={Articles}/>
        <Route exact path='/articles/new' component={ArticleCreation}/>
        <Route exact path='/articles/:id' component={Blog}/>
      </Layout>
    </MuiPickersUtilsProvider>
  );
}
