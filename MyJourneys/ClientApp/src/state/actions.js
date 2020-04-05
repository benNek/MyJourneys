export const setUser = (dispatch, user) => dispatch({type: 'SET_USER', payload: user});
export const setJourneys = (dispatch, journeys) => dispatch({type: 'SET_JOURNEYS', payload: journeys});
export const setPopularTags = (dispatch, tags) => dispatch({type: 'SET_POPULAR_TAGS', payload: tags});
export const setActiveTag = (dispatch, tag) => dispatch({type: 'SET_ACTIVE_TAG', payload: tag});
export const setBlogs = (dispatch, blogs) => dispatch({type: 'SET_BLOGS', payload: blogs});
export const loadBlogs = (dispatch, blogs) => dispatch({type: 'LOAD_BLOGS', payload: blogs});