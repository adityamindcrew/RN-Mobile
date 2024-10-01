import {
  PHONE_VERIFY,
  PHONE_VERIFY_FAILED,
  PHONE_VERIFY_START,
  TAB_BAR_VISIBILITY,
} from "../Type";

const initialState = {
  users: [],
  usersError: [],
  loading: false,
  tabBarVisibility: "flex",
};
function userReducer(state = initialState, action) {
  switch (action.type) {
    case PHONE_VERIFY_START:
      return { ...state, usersError: null, loading: false };
    case PHONE_VERIFY:
      return { ...state, users: action.payload, loading: true };
    case PHONE_VERIFY_FAILED:
      return { ...state, usersError: action.payload, loading: false };
    case TAB_BAR_VISIBILITY:
      return { ...state, tabBarVisibility: action.payload };

    default:
      return state;
  }
}

export default userReducer;
