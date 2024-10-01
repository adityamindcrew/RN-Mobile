import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import {
  ALL_TRAVEL_PLANS,
  DELETE_PLAN,
  GET,
  RENDER_PLAN,
} from "../../api/base_url";
import { storage } from "../../components/asyncStorageToken";
import {
  ALL_LOCATIONS,
  PLAN_ALL,
  TRAVEL_PLANS_LOADING,
  WORLD_TRAVEL_PLANS,
} from "../Type";
import { buildSearchParams } from "../../helpers/buildParams";

export const GetTravelPlanList = () => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: RENDER_PLAN,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        dispatch({
          type: TRAVEL_PLANS_LOADING,
          payload: true,
        });
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: PLAN_ALL,
                payload: response.data.data ? response.data.data : [],
              });
              dispatch({
                type: TRAVEL_PLANS_LOADING,
                payload: false,
              });
            }
          })
          .catch(function (error) {
            dispatch({
              type: TRAVEL_PLANS_LOADING,
              payload: false,
            });
            console.log("error action asdfghtjyuki", error.response.data);
            if (error.response.data.code === 403) {
              Alert.alert("Session Expired");
            }
          });
      } else {
        dispatch({
          type: TRAVEL_PLANS_LOADING,
          payload: false,
        });
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: TRAVEL_PLANS_LOADING,
        payload: false,
      });
    }
  };
};
export const GetWorldTravelPlanList = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: `${ALL_TRAVEL_PLANS}${buildSearchParams(data)}`,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        dispatch({
          type: TRAVEL_PLANS_LOADING,
          payload: true,
        });
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: TRAVEL_PLANS_LOADING,
                payload: false,
              });
              dispatch({
                type: WORLD_TRAVEL_PLANS,
                payload: response.data.data,
              });
            }
          })
          .catch(function (error) {
            dispatch({
              type: TRAVEL_PLANS_LOADING,
              payload: false,
            });
            console.log("error action asdfghtjyuki", error.response.data);
          });
      } else {
        dispatch({
          type: TRAVEL_PLANS_LOADING,
          payload: false,
        });
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: TRAVEL_PLANS_LOADING,
        payload: false,
      });
    }
  };
};
export const deleteOnePlan = (id) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: `${DELETE_PLAN}=${id}`,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              //   dispatch({
              //     type: PLAN_ALL,
              //     payload: response.data.data ? response.data.data : [],
              //   });
              dispatch(GetTravelPlanList());
            }
          })
          .catch(function (error) {
            console.log("dsfghjklkhjghfgdfsvbnf", error.response.data);
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log("hkjhjghfgdfsda", error);
    }
  };
};

export const addDeleteLocations = (data) => {
  return {
    type: ALL_LOCATIONS,
    payload: data,
  };
};
