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
    default:
      return state;
  }
};

export default Reducer;