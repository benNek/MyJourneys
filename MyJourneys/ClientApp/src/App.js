import React, {useEffect, useMemo, useState} from 'react';
import {Route} from 'react-router';
import {parseUser} from "./utils/auth";
import {UserContext} from "./contexts/userContext";
import Planner from "./components/Planner/Planner";
import Retrospective from "./components/Retrospective/Retrospective";
import Articles from "./components/Sharing/Articles";
import ArticleCreation from "./components/Sharing/ArticleCreation";
import Blog from "./components/Sharing/Blog";
import Layout from "./components/Layout";

export default function App() {

  const [user, setUser] = useState(null);
  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);

  useEffect(() => {
    setUser(parseUser());
  }, []);

  return (
    <UserContext.Provider value={providerValue}>
      <Layout>
        <Route exact path='/' component={Retrospective}/>
        <Route exact path='/planner' component={Planner}/>
        <Route exact path='/articles' component={Articles}/>
        <Route exact path='/articles/new' component={ArticleCreation}/>
        <Route exact path='/articles/:id' component={Blog}/>
      </Layout>
    </UserContext.Provider>
  );
}
