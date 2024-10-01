import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import { BOOKINGS_LISTINGS, GET } from "../../api/base_url";
import { storage } from "../../components/asyncStorageToken";
import { BOOKINGS_ALL, BOOKINGS_TYPE } from "../Type";

export const GetBookingsList = () => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const fetchData = async (status) => {
          const config = {
            method: "GET",
            url: `${BOOKINGS_LISTINGS}`,
            headers: {
              Authorization: `Bearer ${storage.getString("user_token")}`,
            },
          };
          const response = await axios(config);
          if (response.status) {
            return response.data.data;
          } else {
            return [];
          }
        };
        const data = await fetchData();
        dispatch({
          type: BOOKINGS_ALL,
          payload: data,
        });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log("xgfhjjgfgdfsdas", error.response.data);
    }
  };
};
export const updateBookingType = (data) => {
  return {
    type: BOOKINGS_TYPE,
    payload: data,
  };
};
