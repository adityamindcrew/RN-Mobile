import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import { storage } from "../../components/asyncStorageToken";
import {
  FEED_LIST,
  FILTER_RESULTS,
  GET,
  HOTEL_BOOKING,
  POST,
  RELEVANT_RESULTS,
  UNREAD_MESSAGES,
  UPDATE_DEVICE_TOKEN,
} from "../../api/base_url";
import {
  ADD_FEED_LIST,
  BOOK_HOTEL,
  FEED_LOADING,
  FILTERED_RESULTS,
  FILTER_OBJ,
  RELEVANT,
  UNREAD_MESSAGE_COUNT,
} from "../Type";
import { buildSearchParams } from "../../helpers/buildParams";
import SessionExpired from "../../utils/SessionExpired";

let allSearch = [];

export const GetFeedList = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: FEED_LIST,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        dispatch({
          type: FEED_LOADING,
          payload: true,
        });
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: RELEVANT,
                payload: false,
              });
              dispatch({
                type: ADD_FEED_LIST,
                payload: response.data.data ? response.data.data : [],
              });
              dispatch({
                type: FEED_LOADING,
                payload: false,
              });
            }
          })
          .catch(function (error) {
            dispatch({
              type: FEED_LOADING,
              payload: false,
            });
            SessionExpired(error, navigation);
          });
      } else {
        dispatch({
          type: FEED_LOADING,
          payload: false,
        });
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log("xgfhjjgfgdfsdasasedrt", error);
      dispatch({
        type: FEED_LOADING,
        payload: false,
      });
    }
  };
};

export const getFilteredList = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: `${FILTER_RESULTS}${buildSearchParams(data)}`,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        dispatch({
          type: FEED_LOADING,
          payload: true,
        });
        axios(config)
          .then(function (response) {
            if (response.status) {
              if (response.data.data.length === 0) {
                dispatch({
                  type: RELEVANT,
                  payload: true,
                });
                let arr = [...response.data.data];
                allSearch = arr;
                dispatch(getRelevantResults(data));
                dispatch({
                  type: FEED_LOADING,
                  payload: false,
                });
                return;
              }
              let arr = [...response.data.data];
              allSearch = arr;
              dispatch(getRelevantResults(data));
              dispatch({
                type: RELEVANT,
                payload: false,
              });
              dispatch({
                type: FEED_LOADING,
                payload: false,
              });
            }
          })
          .catch(function (error) {
            console.log(error.response.data);
            dispatch({
              type: FEED_LOADING,
              payload: false,
            });
          });
      } else {
        dispatch({
          type: FEED_LOADING,
          payload: false,
        });
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: FEED_LOADING,
        payload: false,
      });
      console.log(error);
    }
  };
};
export const getRelevantResults = (data) => {
  const newData = {
    ...data,
    ExactListings: JSON.stringify([]),
  };
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: `${RELEVANT_RESULTS}${buildSearchParams(newData)}`,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        dispatch({
          type: FEED_LOADING,
          payload: true,
        });
        axios(config)
          .then(function (response) {
            if (response.status) {
              let arr = [...allSearch, ...response.data.data];
              const data = removeDuplicates(arr);
              allSearch = data;
              dispatch({
                type: ADD_FEED_LIST,
                payload: allSearch,
              });
              dispatch({
                type: FEED_LOADING,
                payload: false,
              });
            }
          })
          .catch(function (error) {
            console.log(error.response.data);
            dispatch({
              type: FEED_LOADING,
              payload: false,
            });
          });
      } else {
        dispatch({
          type: FEED_LOADING,
          payload: false,
        });
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: FEED_LOADING,
        payload: false,
      });
      console.log(error);
    }
  };
};

export const updateDeviceToken = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: UPDATE_DEVICE_TOKEN,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        await axios(config);
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUnreadMessages = (daa) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: UNREAD_MESSAGES,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        const res = await axios(config);
        dispatch({
          type: UNREAD_MESSAGE_COUNT,
          payload: res.data.data,
        });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const clearAllFilters = () => {
  return {
    type: FILTER_OBJ,
    payload: {
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
  };
};

function removeDuplicates(data) {
  const uniqueItems = {};
  const uniqueArray = [];

  data.forEach((item) => {
    if (!uniqueItems[item.id]) {
      uniqueItems[item.id] = true;
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
}
