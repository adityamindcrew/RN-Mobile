import {
  ALL_LOCATIONS,
  FILTER_TYPE,
  OPTION_BUTTON_STATUS,
  PLAN_ALL,
  SLIDER_VALUE,
  TRAVEL_PLANS_LOADING,
  WORLD_TRAVEL_PLANS,
} from "../Type";

const initialState = {
  travelPlansList: [],
  allLocations: [],
  worldTravelPlans: [],
  sliderValue: [],
  loading: false,
  optionButtonStatus: false,
  filterType: "Everywhere",
};
function travelPlanReducer(state = initialState, action) {
  switch (action.type) {
    case PLAN_ALL:
      return { ...state, travelPlansList: action.payload };
    case ALL_LOCATIONS:
      return { ...state, allLocations: action.payload };
    case WORLD_TRAVEL_PLANS:
      return { ...state, worldTravelPlans: action.payload };
    case SLIDER_VALUE:
      return { ...state, sliderValue: action.payload };
    case TRAVEL_PLANS_LOADING:
      return { ...state, loading: action.payload };
    case OPTION_BUTTON_STATUS:
      return { ...state, optionButtonStatus: action.payload };
    case FILTER_TYPE:
      return { ...state, filterType: action.payload };
    default:
      return state;
  }
}

export default travelPlanReducer;
