import React from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";
import DescribePlace from "../screens/Listings/DescribePlace";
import EditListings from "../screens/Listings/EditListings";
import InfoforGuest from "../screens/Listings/InfoForGuest";
import LetsStart from "../screens/Listings/LetsStart";
import NewListings from "../screens/Listings/NewListings";
import PlaceLocation from "../screens/Listings/PlaceLocation";
import PlaceType from "../screens/Listings/PlaceType";
import PreviousReservation from "../screens/Listings/PreviousReservation";
import PrimaryInformation from "../screens/Listings/PrimaryInformation";
import ReservationRequest from "../screens/Listings/ReservationRequest";
import UpcomingReservation from "../screens/Listings/UpcomingReservation";
import AddPlacePhoto from "../screens/Listings/step-2/AddPlacePhoto";
import DescribePlaceSecond from "../screens/Listings/step-2/DescribePlaceSecond";
import DescribePlaceTitle from "../screens/Listings/step-2/DescribePlaceTitle";
import PlaceOffers from "../screens/Listings/step-2/PlaceOffer";
import PlaceTitle from "../screens/Listings/step-2/PlaceTitle";
import StepTwoListings from "../screens/Listings/step-2/Step-2-Listings";
import DescribePlaceDateSelect from "../screens/Listings/step-3/DescribePlaceDateSelect";
import DescribeYourPriceSelect from "../screens/Listings/step-3/DescribeYourPriceSelect";
import StepThreeListings from "../screens/Listings/step-3/Step-3-Listings";
import Summary from "../screens/Listings/step-3/Summary";
import PublishListings from "../screens/Listings/step-3/publishListing";
import ShareListings from "../screens/Listings/step-3/shareListing";
import Listing from "../screens/Listings/Listing";
import { LISTINGS } from "./RouteNames";
import PreviewListing from "../screens/Listings/PreviewListing";
import InstantPreview from "../screens/Listings/InstantPreview";

const Stack = createStackNavigator();

const ListingStack = () => (
  <Stack.Navigator
    initialRouteName={LISTINGS}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name={LISTINGS} component={Listing} />
    <Stack.Screen name={"ReservationRequest"} component={ReservationRequest} />
    <Stack.Screen
      name={"PreviousReservation"}
      component={PreviousReservation}
    />
    <Stack.Screen
      name={"UpcomingReservation"}
      component={UpcomingReservation}
    />
    <Stack.Screen name={"LetsStart"} component={LetsStart} />
    <Stack.Screen name={"NewListings"} component={NewListings} />
    <Stack.Screen name={"DescribePlace"} component={DescribePlace} />
    <Stack.Screen name={"PlaceType"} component={PlaceType} />
    <Stack.Screen name={"PrimaryInformation"} component={PrimaryInformation} />
    <Stack.Screen name={"PlaceLocation"} component={PlaceLocation} />
    <Stack.Screen name={"StepTwoListings"} component={StepTwoListings} />
    <Stack.Screen name={"PlaceOffers"} component={PlaceOffers} />
    <Stack.Screen name={"AddPlacePhoto"} component={AddPlacePhoto} />
    <Stack.Screen name={"PlaceTitle"} component={PlaceTitle} />
    <Stack.Screen name={"DescribePlaceTitle"} component={DescribePlaceTitle} />
    <Stack.Screen
      name={"DescribePlaceSecond"}
      component={DescribePlaceSecond}
    />
    <Stack.Screen name={"StepThreeListings"} component={StepThreeListings} />
    <Stack.Screen
      name={"DescribeYourPriceSelect"}
      component={DescribeYourPriceSelect}
    />
    <Stack.Screen
      name={"DescribePlaceDateSelect"}
      component={DescribePlaceDateSelect}
    />
    <Stack.Screen name={"EditListings"} component={EditListings} />
    <Stack.Screen name={"InfoforGuest"} component={InfoforGuest} />
    <Stack.Screen name={"Summary"} component={Summary} />
    <Stack.Screen name={"PublishListings"} component={PublishListings} />
    <Stack.Screen name={"ShareListings"} component={ShareListings} />
    <Stack.Screen name={"PreviewListing"} component={PreviewListing} />
    <Stack.Screen name={"InstantPreview"} component={InstantPreview} />
  </Stack.Navigator>
);

export default ListingStack;
