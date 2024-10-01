import React from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";

//import screens
import Bookings from "../screens/Bookings/Bookings";
import CurrentBooking from "../screens/Bookings/CurrentBooking";
import PendingBooking from "../screens/Bookings/PendingBooking";
import PreviousBooking from "../screens/Bookings/PreviousBooking";
import InfoforGuestView from "../screens/Bookings/InfoForGuestView";
//import styles and assets

const Stack = createStackNavigator();

const BookingsStack = () => (
  <Stack.Navigator
    initialRouteName={"Bookings"}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name={"Bookings"} component={Bookings} />
    <Stack.Screen name={"PendingBooking"} component={PendingBooking} />
    <Stack.Screen name={"PreviousBooking"} component={PreviousBooking} />
    <Stack.Screen name={"CurrentBooking"} component={CurrentBooking} />
    <Stack.Screen name={"InfoForGuestView"} component={InfoforGuestView} />
  </Stack.Navigator>
);

export default BookingsStack;
