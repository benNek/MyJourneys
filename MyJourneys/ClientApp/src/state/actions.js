export const setUser = (dispatch, user) => dispatch({type: 'SET_USER', payload: user});
export const setJourneys = (dispatch, journeys) => dispatch({type: 'SET_JOURNEYS', payload: journeys});
export const setPopularTags = (dispatch, tags) => dispatch({type: 'SET_POPULAR_TAGS', payload: tags});
export const setActiveTag = (dispatch, tag) => dispatch({type: 'SET_ACTIVE_TAG', payload: tag});
export const setSortType = (dispatch, sortType) => dispatch({type: 'SET_SORT_TYPE', payload: sortType});
export const setArticles = (dispatch, articles) => dispatch({type: 'SET_ARTICLES', payload: articles});
export const loadArticles = (dispatch, articles) => dispatch({type: 'LOAD_ARTICLES', payload: articles});