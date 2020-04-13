const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_JOURNEYS':
      return {
        ...state,
        journeys: action.payload
      };
    case 'SET_POPULAR_TAGS':
      return {
        ...state,
        popularTags: action.payload
      };
    case 'SET_ACTIVE_TAG':
      return {
        ...state,
        activeTag: action.payload
      };
    case 'SET_SORT_TYPE':
      return {
        ...state,
        sortType: action.payload
      };
    case 'SET_ARTICLES':
      return {
        ...state,
        articles: action.payload
      };
    case 'LOAD_ARTICLES':
      return {
        ...state,
        articles: [...state.articles, ...action.payload]
      };
    default:
      return state;
  }
};

export default Reducer;