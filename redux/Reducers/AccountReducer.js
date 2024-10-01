import {
  ADD_PAYOUT_METHOD_FAILED,
  ADD_PAYOUT_METHOD_SUCCESS,
  COUNTRY_NAME,
  CURRENCY_NAME,
  GET_REFER_FRIENDS,
  GET_REFER_FRIENDS_ERROR,
  PAYMENT_FORM_VISIBILITY,
  PAYMENT_HISTORY,
  PAYMENT_METHODS_DATA,
  PAYMENT_METHODS_DATA_FAILED,
  PAYOUT_ADDRESS,
  PAYOUT_HISTORY,
  PAYOUT_METHODS_DATA,
  PROFILE_DATA,
  PROFILE_DATA_FAILED,
  PROFILE_IMAGES,
} from "../Type";

const initialState = {
  country: "",
  currency: null,
  referredFriends: [],
  referredFriendsError: [],
  profileData: [],
  profileDataFailed: null,
  paymentMethodData: [],
  paymentMethodDataFailed: [],
  paymentFormVisibility: false,
  payoutMethodData: [],
  addPayoutMethodSuccess: true,
  addPayoutMethodFailed: false,
  paymentHistory: [],
  payoutHistory: [],
  profileImages: [],
  payoutAddress: {
    lineOne: "",
    lineTwo: "",
    zipCode: "",
    state: "",
    city: "",
    country: "",
  },
};
function AccountReducer(state = initialState, action) {
  switch (action.type) {
    case PROFILE_DATA:
      return { ...state, profileData: action.payload };
    case PROFILE_DATA_FAILED:
      return { ...state, profileDataFailed: action.payload };
    case COUNTRY_NAME:
      return { ...state, country: action.payload };
    case CURRENCY_NAME:
      return { ...state, currency: action.payload };
    case GET_REFER_FRIENDS:
      return { ...state, referredFriends: action.payload };
    case GET_REFER_FRIENDS_ERROR:
      return { ...state, referredFriendsError: action.payload };
    case PAYMENT_METHODS_DATA:
      return { ...state, paymentMethodData: action.payload };
    case PAYMENT_METHODS_DATA_FAILED:
      return { ...state, paymentMethodDataFailed: action.payload };
    case PAYMENT_FORM_VISIBILITY:
      return { ...state, paymentFormVisibility: action.payload };
    case PAYOUT_METHODS_DATA:
      return { ...state, payoutMethodData: action.payload };
    case ADD_PAYOUT_METHOD_SUCCESS:
      return { ...state, addPayoutMethodSuccess: action.payload };
    case ADD_PAYOUT_METHOD_FAILED:
      return { ...state, addPayoutMethodFailed: action.payload };
    case PAYMENT_HISTORY:
      return { ...state, paymentHistory: action.payload };
    case PAYOUT_HISTORY:
      return { ...state, payoutHistory: action.payload };
    case PROFILE_IMAGES:
      return { ...state, profileImages: action.payload };
    case PAYOUT_ADDRESS:
      return { ...state, payoutAddress: action.payload };
    default:
      return state;
  }
}
export default AccountReducer;
