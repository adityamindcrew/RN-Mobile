import React from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";
import { NEW_PLAN, SELECT_LOCATION, TRAVEL_PLANS } from "./RouteNames";

//import screens
import NewPlan from "../screens/Travelplans/Newplan";
import SelectLocation from "../screens/Travelplans/SelectLocation";
import TravelPlans from "../screens/Travelplans/TravelPlans";
import EditPlan from "../screens/Travelplans/EditPlan";

//import styles and assets

const Stack = createStackNavigator();

const TravelPlansStack = (props) => {
  // console.log(props);
  return (
    <Stack.Navigator
      {...props}
      initialRouteName={TRAVEL_PLANS}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={TRAVEL_PLANS} component={TravelPlans} />
      <Stack.Screen name={NEW_PLAN} component={NewPlan} />
      <Stack.Screen name={"EditPlan"} component={EditPlan} />
      <Stack.Screen name={SELECT_LOCATION} component={SelectLocation} />
    </Stack.Navigator>
  );
};

export default TravelPlansStack;
