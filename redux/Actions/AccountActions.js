import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Alert } from "react-native";
import {
  ADD_PAYMENT_METHODS,
  ADD_PAYOUT_METHODS,
  CREATE_PAYMENT_INTENT,
  DELETE_PROFILE_PHOTO,
  EDIT_PROFILE,
  EDIT_PROFILE_PHOTO,
  GET,
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_METHODS,
  GET_PAYOUT_HISTORY,
  GET_PAYOUT_METHODS,
  GET_PROFILE,
  GET_REFERRED_FRIENDS,
  MAKE_PAYMENT_METHOD_DEFAULT,
  MAKE_PAYOUT_METHOD_DEFAULT,
  POST,
  REFER_CONTACTS,
  REMOVE_PAYMENT_METHOD,
  REMOVE_PAYOUT_METHOD,
  UPDATE_CURRENCY,
} from "../../api/base_url";
import { storage } from "../../components/asyncStorageToken";
import {
  ADD_PAYOUT_METHOD_FAILED,
  ADD_PAYOUT_METHOD_SUCCESS,
  COUNTRY_NAME,
  CURRENCY_NAME,
  GET_REFER_FRIENDS,
  GET_REFER_FRIENDS_ERROR,
  PAYMENT_FORM_VISIBILITY,
  PAYMENT_HISTORY,
  PAYMENT_METHODS_DATA,
  PAYMENT_METHODS_DATA_FAILED,
  PAYOUT_HISTORY,
  PAYOUT_METHODS_DATA,
  PROFILE_DATA,
  PROFILE_DATA_FAILED,
  PROFILE_IMAGES,
  REFER_FRIENDS_API,
  REFER_FRIENDS_FAILED,
  TAB_BAR_VISIBILITY,
} from "../Type";
import { SIGN_IN, WELCOME } from "../../navigation/RouteNames";
import SessionExpired from "../../utils/SessionExpired";

export const GetProfile = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_PROFILE,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              if (response.data.data.status === "active") {
                storage.set("account_status", true);
              } else {
                storage.set("account_status", false);
              }
              dispatch({
                type: PROFILE_DATA,
                payload: response.data.data ? response.data.data : [],
              });
              dispatch({
                type: PROFILE_DATA_FAILED,
                payload: null,
              });
            }
          })
          .catch(function (error) {
            dispatch({
              type: PROFILE_DATA_FAILED,
              payload: error,
            });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: PROFILE_DATA_FAILED,
        payload: error,
      });
    }
  };
};

export const GetPaymentHistory = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_PAYMENT_HISTORY,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: PAYMENT_HISTORY,
                payload: response.data.data ? response.data.data : [],
              });
            }
          })
          .catch(function (error) {});
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log("jhcbjhvbcjhvvcj", error);
    }
  };
};
export const GetReferredFriends = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_REFERRED_FRIENDS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: GET_REFER_FRIENDS,
                payload: response.data.data ? response.data.data : [],
              });
            }
          })
          .catch(function (error) {
            dispatch({
              type: GET_REFER_FRIENDS_ERROR,
              payload: error,
            });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const EditProfile = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: EDIT_PROFILE,
          data: data,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
            }
          })
          .catch(function (error) {
            console.log(error.response.data.message[0]);
            Alert.alert(error.response.data.message[0]);
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const ReferFriendsAPI = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: REFER_CONTACTS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              dispatch({
                type: REFER_FRIENDS_API,
                payload: response.data.data,
              });
              dispatch(GetReferredFriends());
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
            dispatch({
              type: REFER_FRIENDS_FAILED,
              payload: error,
            });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const GetPaymentMethods = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_PAYMENT_METHODS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: PAYMENT_METHODS_DATA,
                payload: response.data.data ? response.data.data : [],
              });
              dispatch({
                type: PAYMENT_METHODS_DATA_FAILED,
                payload: null,
              });
            }
          })
          .catch(function (error) {
            dispatch({
              type: PAYMENT_METHODS_DATA_FAILED,
              payload: error,
            });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      dispatch({
        type: PAYMENT_METHODS_DATA_FAILED,
        payload: error,
      });
      console.log(" ", error);
    }
  };
};
export const AddPaymentMethods = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: ADD_PAYMENT_METHODS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              console.log(response.data);
              Alert.alert("Card Added!");
              dispatch(GetPaymentMethods());
              dispatch(FormVisibilty(false));
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const MakePaymentMethodDefault = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: "POST",
          url: MAKE_PAYMENT_METHOD_DEFAULT,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              dispatch(GetPaymentMethods());
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const RemovePaymentMethod = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: "POST",
          url: REMOVE_PAYMENT_METHOD,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              dispatch(GetPaymentMethods());
              // Alert.alert("Card Added!");
              // dispatch({
              //   type: PAYMENT_METHODS_DATA,
              //   payload: response.data.data,
              // });
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
            // Alert.alert("Something went wrong");
            // dispatch({
            //   type: PAYMENT_METHODS_DATA_FAILED,
            //   payload: error,
            // });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const UpdateCurrency = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: UPDATE_CURRENCY,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              // Alert.alert("Card Added!");
              // dispatch({
              //   type: PAYMENT_METHODS_DATA,
              //   payload: response.data.data,
              // });
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
            // Alert.alert("Something went wrong");
            // dispatch({
            //   type: PAYMENT_METHODS_DATA_FAILED,
            //   payload: error,
            // });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const EditProfilePhotos = (data, navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: EDIT_PROFILE_PHOTO,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch(GetProfile(navigation));
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const DeleteProfilePhotos = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: DELETE_PROFILE_PHOTO,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              console.log(response.data);
              // dispatch(GetProfile());
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const CreatePaymentIntent = (data) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: CREATE_PAYMENT_INTENT,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response);
            if (response.status) {
              // Alert.alert("Success");
              // dispatch({
              //   type: PAYMENT_METHODS_DATA,
              //   payload: response.data.data,
              // });
            }
          })
          .catch(function (error) {
            Alert.alert(error.response.data.message[0]);
            // dispatch({
            //   type: PAYMENT_METHODS_DATA_FAILED,
            //   payload: error,
            // });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const AddPayoutMethods = (data, navigation, callback) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: ADD_PAYOUT_METHODS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              callback(response);
              dispatch(GetPayoutMethods(navigation));
              dispatch({
                type: ADD_PAYOUT_METHOD_SUCCESS,
                payload: response.data,
              });
            }
          })
          .catch(function (error) {
            callback(error.response.data);
            // Alert.alert(error.response.data.message[0]);
            dispatch({
              type: ADD_PAYOUT_METHOD_FAILED,
              payload: error.response.data.message[0],
            });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const GetPayoutMethods = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_PAYOUT_METHODS,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        axios(config)
          .then(function (response) {
            if (response.status) {
              dispatch({
                type: PAYOUT_METHODS_DATA,
                payload: response.data.data,
              });
            }
          })
          .catch(function (error) {
            console.log(error.response.data);
            // Alert.alert(error.response.data.message[0]);
            // dispatch({
            //   type: PAYMENT_METHODS_DATA_FAILED,
            //   payload: error,
            // });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const MakePayoutMethodDefault = (data, navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: POST,
          url: MAKE_PAYOUT_METHOD_DEFAULT,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
          data: data,
        };
        console.log(data);
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              dispatch(GetPayoutMethods(navigation));
              // Alert.alert("Success");
              // dispatch({
              //   type: PAYMENT_METHODS_DATA,
              //   payload: response.data.data,
              // });
            }
          })
          .catch(function (error) {
            console.log(error.response.data);
            Alert.alert(error.response.data.message[0]);
            // dispatch({
            //   type: PAYMENT_METHODS_DATA_FAILED,
            //   payload: error,
            // });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const RemovePayoutMethod = (data, navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: REMOVE_PAYOUT_METHOD + data,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        console.log(config.url);
        axios(config)
          .then(function (response) {
            console.log(response.data);
            if (response.status) {
              setInterval(() => {
                dispatch(GetPayoutMethods(navigation));
              }, 2000);
              // Alert.alert("Success");
              // dispatch({
              //   type: PAYMENT_METHODS_DATA,
              //   payload: response.data.data,
              // });
            }
          })
          .catch(function (error) {
            console.log(error.response.data);
            Alert.alert(error.response.data.message[0]);
            // dispatch({
            //   type: PAYMENT_METHODS_DATA_FAILED,
            //   payload: error,
            // });
          });
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log(" ", error);
    }
  };
};
export const getPayoutHistory = (navigation) => {
  return async (dispatch) => {
    try {
      const state = await NetInfo.fetch();
      if (state) {
        const config = {
          method: GET,
          url: GET_PAYOUT_HISTORY,
          headers: {
            Authorization: `Bearer ${storage.getString("user_token")}`,
          },
        };
        const response = await axios(config);
        if (response.status) {
          dispatch({
            type: PAYOUT_HISTORY,
            payload: response.data.data,
          });
        }
      } else {
        Alert.alert("Please check device's internet connection");
      }
    } catch (error) {
      console.log("dsfdgfhgjhfdgs", error);
      SessionExpired(error, navigation);
      if (error?.response?.data) {
        console.log(error?.response?.data.message[0]);
      }
      // Alert.alert(error.response.data.message[0]);
    }
  };
};
export const SelectCountry = (data) => {
  return {
    type: COUNTRY_NAME,
    payload: data,
  };
};

export const SelectCurrency = (data) => {
  return {
    type: CURRENCY_NAME,
    payload: data,
  };
};

export const FormVisibilty = (data) => {
  return {
    type: PAYMENT_FORM_VISIBILITY,
    payload: data,
  };
};

export const TabBarVisibility = (data) => {
  return {
    type: TAB_BAR_VISIBILITY,
    payload: data,
  };
};
export const profileImagesArr = (data) => {
  return {
    type: PROFILE_IMAGES,
    payload: data,
  };
};
