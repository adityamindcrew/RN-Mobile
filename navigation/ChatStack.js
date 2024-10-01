import React, { useEffect, useMemo } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Inbox from "../screens/Messages&Notifications/Inbox";
import UserChat from "../screens/Messages&Notifications/UserChat";
import BottomStack from "./BottomStack";
import { BOTTOM_STACK } from "./RouteNames";
import {
  GetPaymentHistory,
  GetPaymentMethods,
  GetPayoutMethods,
  GetProfile,
  GetReferredFriends,
  getPayoutHistory,
} from "../redux/Actions/AccountActions";
import {
  GetFeedList,
  getUnreadMessages,
  updateDeviceToken,
} from "../redux/Actions/FeedActions";
import {
  getMasterData,
  getUserListing,
} from "../redux/Actions/userListingAction";
import { GetBookingsList } from "../redux/Actions/BookingsAction";
import {
  GetTravelPlanList,
  GetWorldTravelPlanList,
} from "../redux/Actions/travelPlanAction";
import {
  getAllChats,
  getNotificationsList,
} from "../redux/Actions/ChatActions";
import { socket } from "../utils/Socket";
import { useDispatch } from "react-redux";
import { askNotificationPermission } from "../helpers/Permissions";
import { storage } from "../components/asyncStorageToken";
import { Platform } from "react-native";
import getDeviceToken from "../utils/getDeviceToken";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import PdfViewer from "../components/PdfViewer";
import { GetReservationsList } from "../redux/Actions/ReservationsAction";

const Drawer = createDrawerNavigator();

const ChatStack = ({ navigation }) => {
  const dispatch = useDispatch();

  useMemo(async () => {
    dispatch(GetReferredFriends(navigation));
    dispatch(GetPaymentMethods(navigation));
    dispatch(GetPayoutMethods(navigation));
    dispatch(GetProfile(navigation));
    dispatch(GetPaymentHistory(navigation));
    dispatch(GetFeedList(navigation));
    dispatch(getMasterData(navigation));
    dispatch(GetBookingsList(navigation));
    dispatch(getUserListing(navigation));
    dispatch(GetTravelPlanList(navigation));
    dispatch(getAllChats());
    dispatch(getNotificationsList());
    dispatch(getUnreadMessages());
    dispatch(GetReservationsList());
    dispatch(getPayoutHistory());
    dispatch(
      GetWorldTravelPlanList({
        page: 1,
        perPage: 30,
        city: "all",
      })
    );
  }, []);

  useEffect(() => {
    socket.on("receive_message", (res) => {
      dispatch(getAllChats());
      dispatch(getNotificationsList());
      dispatch(getUnreadMessages());
    });
  }, []);

  useEffect(() => {
    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   console.log("onNotificationOpenedApp", remoteMessage);
    // });
    // messaging()
    //   .getInitialNotification()
    //   .then((remoteMessage) => {
    //     console.log("getInitialNotification", remoteMessage);
    //   });
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   const channelId = await notifee.createChannel({
    //     id: "default",
    //     name: "Default Channel",
    //   });
    //   notifee.displayNotification({
    //     id: remoteMessage.messageId,
    //     body: remoteMessage.notification.body,
    //     title: remoteMessage.notification.title,
    //     android: {
    //       channelId,
    //       pressAction: {
    //         id: "default",
    //       },
    //     },
    //   });
    //   console.log("setBackgroundMessageHandler", remoteMessage);
    // });
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   const channelId = await notifee.createChannel({
    //     id: "default",
    //     name: "Default Channel",
    //   });
    //   notifee.displayNotification({
    //     id: remoteMessage.messageId,
    //     body: remoteMessage.notification.body,
    //     title: remoteMessage.notification.title,
    //     android: {
    //       channelId,
    //       pressAction: {
    //         id: "default",
    //       },
    //     },
    //   });
    //   console.log("sdfgnfbds", remoteMessage);
    // });
    // return unsubscribe;
  }, []);

  useEffect(async () => {
    try {
      await askNotificationPermission();
      const devToken = await getDeviceToken();
      storage.set("deviceToken", devToken);

      dispatch(
        updateDeviceToken({
          deviceToken: devToken,
          deviceType: Platform.OS,
        })
      );
    } catch (error) {
      console.log("adsfghjkgfdgsf", error);
    }
  }, []);
  return (
    <Drawer.Navigator
      initialRouteName={BOTTOM_STACK}
      screenOptions={{ headerShown: false, swipeEdgeWidth: 0 }}
    >
      <Drawer.Screen name={"Inbox"} component={Inbox} />
      <Drawer.Screen name={"UserChat"} component={UserChat} />
      <Drawer.Screen name={BOTTOM_STACK} component={BottomStack} />
      <Drawer.Screen name={"PdfViewer"} component={PdfViewer} />
    </Drawer.Navigator>
  );
};

export default ChatStack;
