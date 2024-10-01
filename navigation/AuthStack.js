import React, { useEffect } from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";

//import screens
import MyWebComponent from "../components/webview";
import { Linking, Platform } from "react-native";
import DOBSelection from "../screens/DOBSelection";
import MyBasics from "../screens/MyBasics";
import Welcome from "../screens/Welcome";
import AddProfilePhoto from "../screens/addProfilePhoto";
import AddUserPhoto from "../screens/addUserPhoto";
import MyCompleteProfile from "../screens/comleteProfile";
import MyIdentity from "../screens/myIdentity";
import MyLocation from "../screens/myLocation";
import MyProfessionalInfo from "../screens/myProfessional";
import MyShortBio from "../screens/myShortBio";
import MySocailMedia from "../screens/mySocial";
import SplashScreen from "react-native-splash-screen";

//import styles and assets
import { storage } from "../components/asyncStorageToken";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import {
  ADD_PROFILE_PHOTO,
  ADD_USER_PHOTO,
  DOB_SELECTION,
  MY_BASICS,
  MY_COMPLETE_PROFILE,
  MY_IDENTITY,
  MY_LOCATION,
  MY_PROFESSIONAL_INFO,
  MY_SHORT_BIO,
  MY_SOCIAL_MEDIA,
  MY_WEB_COMPONENT,
  OTHER_USER_PROFILE,
  PRIVACY_POLICY,
  SIGN_IN,
  SIGN_UP,
  TERMS_OF_USE,
  WELCOME,
} from "./RouteNames";
import OtherUserProfile from "../screens/otherUserProfile";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import TermsOfUse from "../screens/TermsOfUse";
import ChatStack from "./ChatStack";
import SignIn from "../screens/signIn";
import SignUp from "../screens/SignUp";
import Test from "../screens/Test";
import { useDispatch } from "react-redux";
import { GetBookingsList } from "../redux/Actions/BookingsAction";
import { getUserListing } from "../redux/Actions/userListingAction";
import { getAllChats } from "../redux/Actions/ChatActions";
import EnterOtp from "../screens/EnterOtp";
import isEmptyObject from "../utils/isObjectEmpty";
import { GetFeedList, getUnreadMessages } from "../redux/Actions/FeedActions";
import { GetReservationsList } from "../redux/Actions/ReservationsAction";
import { GetProfile } from "../redux/Actions/AccountActions";
const Stack = createStackNavigator();

const AuthStack = () => {
  const userToken = storage.getString("user_token");
  const userStatus = storage.getBoolean("user_onboarding_completed");

  const dispatch = useDispatch();

  useEffect(async () => {
    const unsubscribe = messaging().onMessage(async (message) => {
      dispatch(getAllChats());
      dispatch(getUnreadMessages());
      if (!message.data.frontendUri.includes("UserChat")) {
        dispatch(GetReservationsList());
        dispatch(GetFeedList());
        dispatch(GetProfile());
      }
      dispatch(getUserListing());
      try {
        const channelId = await notifee.createChannel({
          id: "default",
          name: "Default Channel",
        });
        notifee.displayNotification({
          messageId: message.messageId,
          body: message.notification.body,
          title: message.notification.title,
          android: {
            channelId,
            pressAction: {
              id: "default",
              launchActivity: "default",
            },
          },
          data: {
            additonalData: message?.data?.additonalData,
            frontendUri: message?.data?.frontendUri,
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
    messaging().onNotificationOpenedApp((message) => {
      redirectToScreen(message);
    });

    messaging()
      .getInitialNotification()
      .then((message) => {
        if (message) {
          if (Platform.OS === "android") {
            redirectToScreen(message);
          }
        }
      });

    return unsubscribe;
  }, []);

  messaging().setBackgroundMessageHandler(async (message) => {
    redirectToScreen(message);
  });

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      const { notification, pressAction } = detail;
      if (type === 1) {
        if (!isEmptyObject(notification.data)) redirectToScreen(notification);
      }
    });
  }, []);

  const redirectToScreen = (message) => {
    dispatch(GetProfile());
    dispatch(getAllChats());
    dispatch(getUnreadMessages());

    try {
      let data;
      let id;
      let fullName;
      let personalImgs;
      var deepLink;
      if (message.data.additonalData !== "{}") {
        if (message.data.frontendUri.includes("UserChat")) {
          data = JSON.parse(message.data.additonalData);
          id = data?.id || "";
          fullName = data?.firstName || "";
          personalImgs = data?.personalImgs[0]?.uri || "";
          deepLink = `${message.data.frontendUri}/${encodeURIComponent(
            id
          )}/${encodeURIComponent(fullName)}/${encodeURIComponent(
            personalImgs
          )}`;
        } else {
          data = JSON.parse(message.data.additonalData);
          id = data?.id || "";
          deepLink = `${message.data.frontendUri}/${encodeURIComponent(id)}`;
          dispatch(GetBookingsList());
          dispatch(GetReservationsList());
          dispatch(getUserListing());
          dispatch(GetFeedList());
        }
      } else {
        deepLink = `${message.data.frontendUri}`;
        dispatch(GetBookingsList());
        dispatch(GetReservationsList());
        dispatch(getUserListing());
        dispatch(GetFeedList());
      }
      Linking.openURL(deepLink);
    } catch (error) {
      console.log("dfghjhgfdsa", error);
    }
    // if (ios) {
    //   notifee.cancelNotification(message.remote.messageId);
    //   return;
    // }
    // notifee.cancelNotification(message.messageId);
  };

  const routes = [
    { name: WELCOME, component: Welcome },
    {
      name: SIGN_IN,
      component: SignIn,
    },
    {
      name: "EnterOTP",
      component: EnterOtp,
    },
    { name: MY_WEB_COMPONENT, component: MyWebComponent },
    {
      name: SIGN_UP,
      component: SignUp,
    },
    { name: MY_BASICS, component: MyBasics },
    { name: DOB_SELECTION, component: DOBSelection },
    { name: MY_LOCATION, component: MyLocation },
    { name: MY_SOCIAL_MEDIA, component: MySocailMedia },
    { name: ADD_PROFILE_PHOTO, component: AddProfilePhoto },
    { name: MY_SHORT_BIO, component: MyShortBio },
    { name: MY_IDENTITY, component: MyIdentity },
    { name: ADD_USER_PHOTO, component: AddUserPhoto },
    { name: MY_PROFESSIONAL_INFO, component: MyProfessionalInfo },
    { name: MY_COMPLETE_PROFILE, component: MyCompleteProfile },
    // { name: BOTTOM_STACK, component: BottomStack },
    { name: OTHER_USER_PROFILE, component: OtherUserProfile },
    { name: PRIVACY_POLICY, component: PrivacyPolicy },
    { name: TERMS_OF_USE, component: TermsOfUse },
    {
      name: "ChatStack",
      component: ChatStack,
    },
    {
      name: "Test",
      component: Test,
    },
  ];

  const initialRouteName = userToken && userStatus ? "ChatStack" : WELCOME;

  useEffect(async () => {
    SplashScreen.hide();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      {routes.map((item, i) => (
        <Stack.Screen
          key={i.toString}
          name={item.name}
          component={item.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthStack;
