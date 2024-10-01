import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import { GET, RESERVATIONS_LISTINGS } from "../../api/base_url";
import { storage } from "../../components/asyncStorageToken";
import {
  RESERVATIONS_ALL,
  RESERVATION_LOADING,
  RESERVATION_TYPE,
} from "../Type";

export const GetReservationsList = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const fetchData = async (status) => {
          const config = {
            method: GET,
            url: `${RESERVATIONS_LISTINGS}`,
            headers: {
              Authorization: `Bearer ${storage.getString("user_token")}`,
            },
          };
          dispatch({
            type: RESERVATION_LOADING,
            payload: true,
          });
          const response = await axios(config);
          if (response.status) {
            return response.data.data;
          } else {
            return [];
          }
        };
        const mergedArray = await fetchData(data);
        dispatch({
          type: RESERVATIONS_ALL,
          payload: mergedArray,
        });
        dispatch({
          type: RESERVATION_LOADING,
          payload: false,
        });
      } else {
        dispatch({
          type: RESERVATION_LOADING,
          payload: false,
        });
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: RESERVATION_LOADING,
        payload: false,
      });
      console.log("xsdfhghjghfgdfs", error.response.data);
    }
  };
};

export const updateReservationType = (data) => {
  return {
    type: RESERVATION_TYPE,
    payload: data,
  };
};
