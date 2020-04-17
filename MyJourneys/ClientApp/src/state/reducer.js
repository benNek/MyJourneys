const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
      return {
        ...state,
        darkMode: action.payload
      };
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