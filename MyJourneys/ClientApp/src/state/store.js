import React, {createContext, useReducer} from "react";
import Reducer from './reducer';

const savedDarkMode = localStorage.getItem('theme') && localStorage.getItem('theme') === 'dark';
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialState = {
  darkMode: savedDarkMode || (!localStorage.getItem('theme') && prefersDarkMode),
  user: null,
  journeys: [],
  articles: []
};

const Store = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
};

export const Context = createContext(initialState);
export default Store;