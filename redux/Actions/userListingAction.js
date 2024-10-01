import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import {
  GET,
  GET_MASTER_DATA,
  GET_SINGLE_LISTINGS_SUMMARY,
  GET_USER_LISTINGS,
} from "../../api/base_url";
import { storage } from "../../components/asyncStorageToken";
import {
  GET_SINGLE_LISTINGS,
  GET_USER_LIST,
  GUEST_PLACE_TYPE,
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
import SessionExpired from "../../utils/SessionExpired";
export const placeDate = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_DATE,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placeDesc = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_DESC,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const addAmenties = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_AMENITIES,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const addAmentiesHightLights = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: MASTER_DATA_HIGHLIGHTS,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placeInfo = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_INFO,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placeLocation = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_LOCATION,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placePhoto = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_PHOTOS,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placePrice = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_PRICE,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placeTitle = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_TITLE,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const placeType = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PLACE_TYPE,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const guestPlaceType = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: GUEST_PLACE_TYPE,
        payload: data,
      });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const getUserListing = () => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_USER_LISTINGS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: GET_USER_LIST,
                payload: response.data.data ? response.data.data : [],
              });
            }
          })
          .catch(function (error) {
            console.log("error action asdfghtjyuki", error.response.data);
            if (error.response.data.code === 403) {
              Alert.alert("Session Expired");
            }
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {}
  };
};

export const getSignleListingSummery = (id) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: `${GET_SINGLE_LISTINGS_SUMMARY}=${id}`,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: GET_SINGLE_LISTINGS,
                payload: response.data.data ? response.data.data : [],
              });
            }
          })
          .catch(function (error) {
            console.log("error action asdfghtjyuki", error.response.data);
            if (error.response.data.code === 403) {
              Alert.alert("Session Expired");
            }
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {}
  };
};

export const getMasterData = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_MASTER_DATA,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: MASTER_DATA,
                payload: response.data.data ? response.data.data : [],
              });
            }
          })
          .catch(function (error) {});
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {}
  };
};
