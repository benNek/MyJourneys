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
    case 'SET_BLOGS':
      return {
        ...state,
        blogs: action.payload
      };
    case 'LOAD_BLOGS':
      return {
        ...state,
        blogs: [...state.blogs, ...action.payload]
      };
    default:
      return state;
  }
};

export default Reducer;