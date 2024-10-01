import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import AccountReducer from "./Reducers/AccountReducer";
import BookingsReducer from "./Reducers/BookingsReducer";
import FeedReducer from "./Reducers/FeedReducer";
import ReservationsReducer from "./Reducers/ReservationsReducer";
import travelPlanReducer from "./Reducers/TravelPlanReducer";
import userReducer from "./Reducers/UserReducer";
import userListingReducer from "./Reducers/userListingReducer";
import ChatReducer from "./Reducers/ChatReducer";
const rootReducer = combineReducers({
  userReducer,
  AccountReducer,
  userListingReducer,
  FeedReducer,
  ReservationsReducer,
  BookingsReducer,
  travelPlanReducer,
  ChatReducer,
});
const middleware = [thunk];

export const store = createStore(rootReducer, applyMiddleware(...middleware));
