import {
  EDIT_USER_LISTINGS,
  GET_SINGLE_LISTINGS,
  GET_USER_LIST,
  GUEST_PLACE_TYPE,
  INFO_FOR_GUESTS,
  MASTER_DATA,
  MASTER_DATA_HIGHLIGHTS,
  PLACE_AMENITIES,
  PLACE_DATE,
  PLACE_DESC,
  PLACE_INFO,
  PLACE_LOCATION,
  PLACE_PHOTOS,
  PLACE_PRICE,
  PLACE_TITLE,
  PLACE_TYPE,
} from "../Type";

const initialState = {
  PlaceType: "",
  PlaceLocation: "",
  PlaceInfo: "",
  PlacePhoto: [],
  PlaceTitle: "",
  PlaceDesc: "",
  PlacePrice: "",
  PlaceDate: "",
  guestPlaceType: "",
  userListing: [],
  userSingleListing: [],
  masterData: [],
  placeAmenities: [],
  placeHighLights: [],
  EditUserListings: [],
  infoForGuest: {
    wifiName: "",
    wifiPassword: "",
    checkinInfo: "",
    houseRules: "",
    houseManual: "",
  },
};

function userListingReducer(state = initialState, action) {
  switch (action.type) {
    case PLACE_TYPE:
      return { ...state, PlaceType: action.payload };
    case PLACE_LOCATION:
      return { ...state, PlaceLocation: action.payload };
    case PLACE_INFO:
      return { ...state, PlaceInfo: action.payload };
    case PLACE_PHOTOS:
      return { ...state, PlacePhoto: action.payload };
    case PLACE_TITLE:
      return { ...state, PlaceTitle: action.payload };
    case PLACE_DESC:
      return { ...state, PlaceDesc: action.payload };
    case PLACE_PRICE:
      return { ...state, PlacePrice: action.payload };
    case PLACE_DATE:
      return { ...state, PlaceDate: action.payload };
    case GUEST_PLACE_TYPE:
      return { ...state, guestPlaceType: action.payload };
    case GET_USER_LIST:
      return { ...state, userListing: action.payload };
    case GET_SINGLE_LISTINGS:
      return { ...state, userSingleListing: action.payload };
    case MASTER_DATA:
      return { ...state, masterData: action.payload };
    case PLACE_AMENITIES:
      return { ...state, placeAmenities: action.payload };
    case MASTER_DATA_HIGHLIGHTS:
      return { ...state, placeHighLights: action.payload };
    case EDIT_USER_LISTINGS:
      return { ...state, EditUserListings: action.payload };
    case INFO_FOR_GUESTS:
      return { ...state, infoForGuest: action.payload };
    default:
      return state;
  }
}

export default userListingReducer;
