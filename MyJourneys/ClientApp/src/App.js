import React, {useEffect, useMemo, useState} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {parseUser} from "./utils/auth";
import {UserContext} from "./contexts/userContext";
import Planner from "./components/Planner/Planner";
import Retrospective from "./components/Retrospective/Retrospective";

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
      </Layout>
    </UserContext.Provider>
  );
}
