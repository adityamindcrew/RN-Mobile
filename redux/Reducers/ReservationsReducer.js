import {
  RESERVATIONS_ALL,
  RESERVATION_LOADING,
  RESERVATION_TYPE,
} from "../Type";

const initialState = {
  reservationsAll: [],
  loading: false,
  reservationType: 1,
};
function ReservationsReducer(state = initialState, action) {
  switch (action.type) {
    case RESERVATIONS_ALL:
      return { ...state, reservationsAll: action.payload };
    case RESERVATION_LOADING:
      return { ...state, loading: action.payload };
    case RESERVATION_TYPE:
      return { ...state, reservationType: action.payload };
    default:
      return state;
  }
}
export default ReservationsReducer;
