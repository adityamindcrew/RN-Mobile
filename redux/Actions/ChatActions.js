import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import { storage } from "../../components/asyncStorageToken";
import {
  DELETE_ONE_CHAT,
  GET,
  GET_ALL_CHATS,
  GET_USER_CHATS,
  IS_ONLINE,
  NOTIFICATIONS_LIST,
  READ_CHATS,
} from "../../api/base_url";
import { ALL_CHATS, ALL_NOTIFICATIONS, USER_CHATS } from "../Type";
import { buildSearchParams } from "../../helpers/buildParams";

export const getAllChats = () => {
  return async (dispatch) => {
    try {
      const config = {
        method: GET,
        url: GET_ALL_CHATS,
        headers: {
          Authorization: `Bearer ${storage.getString("user_token")}`,
        },
      };
      const response = await axios(config);
      if (response.status) {
        const sortedChats = response.data.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        dispatch({
          type: ALL_CHATS,
          payload: sortedChats,
        });
      }
    } catch (error) {
      console.log("sfdghjhklhgfdfsasdfghj1", error);
    }
  };
};
export const getUserChats = (id) => {
  return async (dispatch) => {
    try {
      const config = {
        method: GET,
        url: GET_USER_CHATS + id,
        headers: {
          Authorization: `Bearer ${storage.getString("user_token")}`,
        },
      };
      const response = await axios(config);
      // console.log("dsfghjkh", id);
      if (response.status) {
        dispatch({
          type: USER_CHATS,
          payload: response.data.data.chat,
        });
      }
    } catch (error) {
      console.log("sfdghjhklhgfdfsasdfghj2", error.response.data);
    }
  };
};
export const readChats = (id) => {
  return async (dispatch) => {
    try {
      const config = {
        method: GET,
        url: READ_CHATS + id,
        headers: {
          Authorization: `Bearer ${storage.getString("user_token")}`,
        },
      };
      const response = await axios(config);

      if (response.status) {
        dispatch(getAllChats());
      }
    } catch (error) {
      console.log("sfdghjhklhgfdfsasdfghj3", error.response.data);
    }
  };
};
export const deleteChat = (id) => {
  return async (dispatch) => {
    try {
      const config = {
        method: GET,
        url: DELETE_ONE_CHAT + id,
        headers: {
          Authorization: `Bearer ${storage.getString("user_token")}`,
        },
      };
      const response = await axios(config);
      console.log(response.data);
      if (response.status) {
        dispatch(getAllChats());
      }
    } catch (error) {
      console.log("sfdghjhklhgfdfsasdfghj4", error.response.data);
    }
  };
};
export const isOnChat = (id, status) => {
  return async (dispatch) => {
    let params = {
      otherUser: id,
      status,
    };

    try {
      const config = {
        method: GET,
        url: IS_ONLINE + buildSearchParams(params),
        headers: {
          Authorization: `Bearer ${storage.getString("user_token")}`,
        },
      };
      const response = await axios(config);
    } catch (error) {
      console.log("sfdghjhklhgfdfsasdfghj5", error.response.data);
    }
  };
};
export const getNotificationsList = () => {
  return async (dispatch) => {
    try {
      const config = {
        method: GET,
        url: NOTIFICATIONS_LIST,
        headers: {
          Authorization: `Bearer ${storage.getString("user_token")}`,
        },
      };
      const response = await axios(config);
      dispatch({
        type: ALL_NOTIFICATIONS,
        payload: response.data.data,
      });
    } catch (error) {
      console.log("getNotificationsList", error.response.data);
    }
  };
};
