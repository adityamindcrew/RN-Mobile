import React from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";

//import screens
import ConfrimAndPay from "../screens/feed/confirm&pay";
import FeedSummary from "../screens/feed/feedSummary";
import Filters from "../screens/feed/filter";
import Feed from "../screens/feed/home";
import Maps from "../screens/feed/maps";
import NumOfRooms from "../screens/feed/numOfRooms";
import PaymentStatus from "../screens/feed/paymentStatus";
import RequestBook from "../screens/feed/requestBook";
import RequestSent from "../screens/feed/requestSent";
import StayBooked from "../screens/feed/stayBooked";
import WhenWantToTravel from "../screens/feed/whenWantToTravel";
import WhereWantToTravel from "../screens/feed/whereWantToTravel";
import { FEED } from "./RouteNames";
import PaymentLoading from "../screens/feed/PaymentLoading";
import ChatStack from "./ChatStack";
import SearchLocation from "../screens/feed/Search";
import InfoforGuestPreview from "../screens/feed/InfoForGuestsPreview";
//import styles and assets

const Stack = createStackNavigator();

const FeedStack = () => (
  <Stack.Navigator
    // initialRouteName={"PaymentLoading"}
    initialRouteName={FEED}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name={FEED} component={Feed} />
    <Stack.Screen name="Filters" component={Filters} />
    <Stack.Screen name="Maps" component={Maps} />
    <Stack.Screen name="WhereWantToTravel" component={WhereWantToTravel} />
    <Stack.Screen name="WhenWantToTravel" component={WhenWantToTravel} />
    <Stack.Screen name="NumOfRooms" component={NumOfRooms} />
    <Stack.Screen name="FeedSummary" component={FeedSummary} />
    <Stack.Screen name="ConfrimAndPay" component={ConfrimAndPay} />
    <Stack.Screen name="RequestBook" component={RequestBook} />
    <Stack.Screen name="RequestSent" component={RequestSent} />
    <Stack.Screen name="PaymentStatus" component={PaymentStatus} />
    <Stack.Screen name="StayBooked" component={StayBooked} />
    <Stack.Screen name="PaymentLoading" component={PaymentLoading} />
    <Stack.Screen name="SearchLocation" component={SearchLocation} />
    <Stack.Screen name="InfoForGuestsPreview" component={InfoforGuestPreview} />
    {/* <Stack.Screen name="ChatStack" component={ChatStack} /> */}
  </Stack.Navigator>
);

export default FeedStack;
