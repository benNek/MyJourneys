import * as React from 'react';
import {Route} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {useContext} from "react";
import {Context} from "../state/store";

export const PrivateRoute = ({component: Component, ...rest}) => {
  const [state] = useContext(Context);
  const {user} = state;

  console.log(user);
  return (
    <Route
      {...rest}
      render={props => (
        user
          ? <Component {...props} />
          : (
            <Redirect to={{
              pathname: '/',
              state: {
                error: 'You must login to proceed!',
                fallback: this ? props.location.pathname : '/'
              }
            }}
            />
          )
      )}
    />
  );
};

export default PrivateRoute;