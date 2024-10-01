import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  MY_BASIC_PROFILE,
  PHONE_AUTH,
  PHONE_OTP,
  POST,
} from "../../api/base_url";
import {
  BASIC_INFO,
  BASIC_INFO_FAILED,
  PHONE_OTP_VERIFY,
  PHONE_OTP_VERIFY_FAILED,
  PHONE_VERIFY,
  PHONE_VERIFY_FAILED,
  PHONE_VERIFY_START,
} from "../Type";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViNTk3ZjY1LTcxZGMtNGI5Ni1hZTg0LTMyYjZmMjBmZmUzMiIsImZpcnN0TmFtZSI6IlRhaGlyIiwibGFzdE5hbWUiOiJNaXJ6YSIsImVtYWlsIjpudWxsLCJwaG9uZU5vIjoiODQ1ODg1NDU1MSIsInBob25lQ29kZSI6Iis5MSIsImRhdGVPZkJpcnRoIjpudWxsLCJnZW5kZXIiOm51bGwsImN1cnJlbnRMb2NhdGlvbiI6IkluZG9yZSwgTVAiLCJhY3R1YWxMb2NhdGlvbiI6IkluZG9yZSwgTVAiLCJjb21wYW55TmFtZSI6Ik1pbmRjcmV3Iiwiam9iVGl0bGUiOiJTb2Z0d2FyZSBFbmdpbmVlciIsImluc3RhZ3JhbSI6bnVsbCwibGlua2VkaW4iOm51bGwsImlzSW5zdGFDb25uZWN0ZWQiOmZhbHNlLCJpc0xpbmtlZGluQ29ubmVjdGVkIjpmYWxzZSwiYmlvIjoiVGhpcyBpcyBiaW8iLCJpc0FjdGl2ZSI6dHJ1ZSwib3RwIjo3NDUzNDUsImxhc3RTY3JlZW5OYW1lIjoiTXlQcm9mZXNzaW9uYWxJbmZvIiwiY3VycmVuY3kiOiJVU0QiLCJzdHJpcGVDdXN0b21lcklkIjpudWxsLCJjb25uZWN0QWNjb3VudE9uYm9hcmRpbmdMaW5rIjpudWxsLCJjb25uZWN0QWNjb3VudFN0YXR1cyI6InJlc3RyaWN0ZWQiLCJib29raW5nQW5kUmVzZXJ2YXRpb25BY3Rpdml0eSI6dHJ1ZSwibWVzc2FnZXMiOnRydWUsInJlbWluZGVycyI6dHJ1ZSwiYW5ub3VuY2VtZW50cyI6dHJ1ZSwidHJhdmVsUGxhbnMiOnRydWUsImNyZWF0ZWRBdCI6IjIwMjMtMDUtMjRUMDY6MDA6NDEuMzU3WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDUtMjVUMDk6NDE6NDMuMDAwWiIsImlhdCI6MTY4NTAwNzcxOSwiZXhwIjoxNjg3NTk5NzE5fQ.Q1Qd6MC9_X4Ret5n9R9pnzgaH-TV6CmwM-IjncudelI";

export const phoneAuth = (data) => {
  try {
    return async (dispatch) => {
      var config = {
        method: POST,
        url: PHONE_AUTH,
        data: data,
      };
      dispatch({ type: PHONE_VERIFY_START });

      axios(config)
        .then(function (response) {
          if (response.data) {
            dispatch({
              type: PHONE_VERIFY,
              payload: response.data,
            });
          }
        })
        .catch(function (error) {
          dispatch({
            type: PHONE_VERIFY_FAILED,
            payload: error,
          });
        });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const phoneOTPVerify = (data) => {
  try {
    return async (dispatch) => {
      var config = {
        method: POST,
        url: PHONE_OTP,
        data: data,
      };
      axios(config)
        .then(function (response) {
          if (response.data) {
            dispatch({
              type: PHONE_OTP_VERIFY,
              payload: response.data,
            });
            AsyncStorage.setItem("userToken", response.data.data.token);
          }
        })
        .catch(function (error) {
          console.log("eroror action ", error.response.data);
          dispatch({
            type: PHONE_OTP_VERIFY_FAILED,
            payload: error,
          });
        });
    };
  } catch (error) {
    console.log(" ", error);
  }
};

export const myBasicProfile = async (data) => {
  const token = await AsyncStorage.getItem("userToken");
  try {
    return async (dispatch) => {
      var config = {
        method: POST,
        url: MY_BASIC_PROFILE,
        data: data,
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      };
      axios(config)
        .then(function (response) {
          if (response.data) {
            dispatch({
              type: BASIC_INFO,
              payload: response.data,
            });
          }
        })
        .catch(function (error) {
          console.log("eroror action ", error.response.data);
          dispatch({
            type: BASIC_INFO_FAILED,
            payload: error,
          });
        });
    };
  } catch (error) {
    console.log(" ", error);
  }
};
