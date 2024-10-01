//import navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useMemo } from "react";
// import screens
import FeedStack from "./FeedStack";
// import libraries
import { SvgXml } from "react-native-svg";

// import assets
import { useDispatch, useSelector } from "react-redux";
import images from "../assets/index";
import colors from "../config/colors";
import {
  GetPaymentHistory,
  GetPaymentMethods,
  GetPayoutMethods,
  GetProfile,
  GetReferredFriends,
} from "../redux/Actions/AccountActions";
import ProfilePaymentStack from "./ProfilePaymentStack";
import {
  ACCOUNT_STACK,
  BOOKINGS_STACK,
  FEED_STACK,
  LISTINGS_STACK,
  TRAVEL_PLANS_STACK,
} from "./RouteNames";
import TravelPlansStack from "./TravelPlansStack";
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
import ListingStack from "./ListingStack";
import BookingsStack from "./BookingStack";
import { getAllChats } from "../redux/Actions/ChatActions";
import { socket } from "../utils/Socket";
import { Platform, StyleSheet } from "react-native";
import { askNotificationPermission } from "../helpers/Permissions";
import getDeviceToken from "../utils/getDeviceToken";
import { storage } from "../components/asyncStorageToken";

const Tab = createBottomTabNavigator();

const BottomStack = ({ navigation }) => {
  // const dispatch = useDispatch();

  // useMemo(async () => {
  //   dispatch(GetReferredFriends(navigation));
  //   dispatch(GetPaymentMethods(navigation));
  //   dispatch(GetPayoutMethods(navigation));
  //   dispatch(GetProfile(navigation));
  //   dispatch(GetPaymentHistory(navigation));
  //   dispatch(GetFeedList(navigation));
  //   dispatch(getMasterData(navigation));
  //   dispatch(GetBookingsList(navigation));
  //   dispatch(getUserListing(navigation));
  //   dispatch(GetTravelPlanList(navigation));
  //   dispatch(getAllChats());
  //   dispatch(getUnreadMessages());
  //   dispatch(
  //     GetWorldTravelPlanList({
  //       page: 1,
  //       perPage: 30,
  //       city: "all",
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   socket.on("receive_message", (res) => {
  //     dispatch(getAllChats());
  //   });
  // }, []);

  // useEffect(async () => {
  //   try {
  //     await askNotificationPermission();
  //     const devToken = await getDeviceToken();
  //     storage.set("deviceToken", devToken);

  //     dispatch(
  //       updateDeviceToken({
  //         deviceToken: devToken,
  //         deviceType: Platform.OS,
  //       })
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  const routes = [
    {
      name: FEED_STACK,
      component: FeedStack,
      icon: images.FeedIcon,
      title: "Explore",
    },
    ,
    {
      name: BOOKINGS_STACK,
      component: BookingsStack,
      icon: images.BookingsIcon,
      title: "My Trips",
    },
    {
      name: LISTINGS_STACK,
      component: ListingStack,
      icon: images.Listings,
      title: "My Home",
    },
    {
      name: TRAVEL_PLANS_STACK,
      component: TravelPlansStack,
      icon: images.MapMarker,
      title: "Travel Plans",
    },
    {
      name: ACCOUNT_STACK,
      component: ProfilePaymentStack,
      icon: images.accountIcon,
      title: "Profile",
    },
  ];

  const { tabBarVisibility } = useSelector((state) => state.userReducer);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: "10%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          display: tabBarVisibility,
        },
      }}
    >
      {routes.map((item, index) => (
        <Tab.Screen
          key={index}
          options={{
            title: item.title,
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarIcon: ({ focused }) => (
              <SvgXml
                xml={
                  item.icon === images.MapMarker
                    ? item.icon(focused, colors.black)
                    : item.icon(focused)
                }
              />
            ),
          }}
          name={item.name}
          component={item.component}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    color: colors.black,
    bottom: 10,
  },
});

export default BottomStack;
