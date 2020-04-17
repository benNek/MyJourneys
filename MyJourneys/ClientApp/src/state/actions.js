export const setDarkMode = (dispatch, darkMode) => dispatch({type: 'SET_DARK_MODE', payload: darkMode});
export const setUser = (dispatch, user) => dispatch({type: 'SET_USER', payload: user});
export const setJourneys = (dispatch, journeys) => dispatch({type: 'SET_JOURNEYS', payload: journeys});
export const setArticles = (dispatch, articles) => dispatch({type: 'SET_ARTICLES', payload: articles});
export const loadArticles = (dispatch, articles) => dispatch({type: 'LOAD_ARTICLES', payload: articles});