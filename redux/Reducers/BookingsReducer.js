import { BOOKINGS_ALL, BOOKINGS_TYPE } from "../Type";

const initialState = {
  bookingsAll: [],
  bookingType: 1,
};
function BookingsReducer(state = initialState, action) {
  switch (action.type) {
    case BOOKINGS_ALL:
      return { ...state, bookingsAll: action.payload };
    case BOOKINGS_TYPE:
      return { ...state, bookingType: action.payload };
    default:
      return state;
  }
}
export default BookingsReducer;
