import {
  ADD_FEED_LIST,
  BOOK_HOTEL,
  FEED_LOADING,
  FILTERED_RESULTS,
  FILTER_OBJ,
  MAP_LOCATION,
  PLAIN_FILTER,
  RELEVANT,
  UNREAD_MESSAGE_COUNT,
  CURRENT_LOCATION,
} from "../Type";

const initialState = {
  feedList: [],
  bookHotel: [],
  filteredResults: [],
  filterObj: {
    bedrooms: 1,
    city: "",
    travelTime: "",
    startDate: "",
    endDate: "",
    noOfWeeks: "",
    noOfWeekends: "",
    noOfMonths: "",
    noOfDays: "",
    month: [],
    continent: "",
    country: "",
    clearAll: true,
    fullAddress: "",
  },
  plainFilterObj: {
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    selection: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
    additionalAmenities: [],
    selectionId: "",
  },
  unreadMessageCount: 0,
  relevantSearch: false,
  mapLocation: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  },
  loading: false,
  currentLocation: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  },
};
function FeedReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FEED_LIST:
      return { ...state, feedList: action.payload };
    case BOOK_HOTEL:
      return { ...state, bookHotel: action.payload };
    case FILTERED_RESULTS:
      return { ...state, filteredResults: action.payload };
    case FILTER_OBJ:
      return { ...state, filterObj: action.payload };
    case PLAIN_FILTER:
      return { ...state, plainFilterObj: action.payload };
    case RELEVANT:
      return { ...state, relevantSearch: action.payload };
    case UNREAD_MESSAGE_COUNT:
      return { ...state, unreadMessageCount: action.payload };
    case MAP_LOCATION:
      return { ...state, mapLocation: action.payload };
    case FEED_LOADING:
      return { ...state, loading: action.payload };
    case CURRENT_LOCATION:
      return { ...state, currentLocation: action.payload };
    default:
      return state;
  }
}
export default FeedReducer;
