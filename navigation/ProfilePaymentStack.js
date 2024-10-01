import React from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";

//import screens
import Account from "../screens/Account/Account";
import AddBankAccountInfo from "../screens/Account/AddBankAccountInfo";
import AddPaymentMethod from "../screens/Account/AddPayoutMethod";
import CompletePayoutProcess from "../screens/Account/CompletePayoutProcess";
import ContactInfo from "../screens/Account/ContactInfo";
import ContactUs from "../screens/Account/ContactUs";
import Contacts from "../screens/Account/Contacts";
import CountryList from "../screens/Account/CountryList";
import Currency from "../screens/Account/Currency";
import DeleteAccount from "../screens/Account/DeleteAccount";
import EditPhotos from "../screens/Account/EditPhotos";
import NotificationsSettings from "../screens/Account/NotificationsSettings";
import PaymentMethods from "../screens/Account/PaymentMethods";
import PaymentsPayouts from "../screens/Account/Payments&Payouts";
import PayoutMethods from "../screens/Account/PayoutMethods";
import ReferFriends from "../screens/Account/ReferFriends";
import ReviewInfo from "../screens/Account/ReviewInfo";
import Settings from "../screens/Account/Settings";
import SetupPayouts from "../screens/Account/SetupPayouts";
import VerifyIdentity from "../screens/Account/VerifyIdentity";
import YourPayments from "../screens/Account/YourPayments";
import YourPayouts from "../screens/Account/YourPayouts";
import {
  ACCOUNT,
  ADD_BANK_ACCOUNT_INFO,
  ADD_PAYOUT_METHOD,
  CANCELLATION_POLICY,
  COMPLETE_PAYOUT_PROCESS,
  CONTACTS,
  CONTACT_INFO,
  CONTACT_US,
  COUNTRY_LIST,
  CURRENCY,
  DELETE_ACCOUNT,
  EDIT_PHOTOS,
  NATIVE_PAY,
  NOTIFICATIONS_SETTINGS,
  PAYMENTS_METHODS,
  PAYMENTS_PAYOUTS,
  PAYOUT_METHODS,
  REFER_FRIENDS,
  REVIEW_INFO,
  SETTINGS,
  SETUP_PAYOUTS,
  VERIFY_IDENTITY,
  YOUR_PAYMENTS,
  YOUR_PAYOUTS,
} from "./RouteNames";
import NativePay from "../screens/Account/NativePay";
import CancellationPolicy from "../screens/Account/CancellationPolicy";

//import styles and assets

const Stack = createStackNavigator();

const ProfilePaymentStack = (props) => {
  return (
    <Stack.Navigator
      {...props}
      initialRouteName={ACCOUNT}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ACCOUNT} component={Account} />
      <Stack.Screen name={SETTINGS} component={Settings} />
      <Stack.Screen name={CONTACT_INFO} component={ContactInfo} />
      <Stack.Screen name={PAYMENTS_PAYOUTS} component={PaymentsPayouts} />
      <Stack.Screen name={VERIFY_IDENTITY} component={VerifyIdentity} />
      <Stack.Screen
        name={NOTIFICATIONS_SETTINGS}
        component={NotificationsSettings}
      />
      <Stack.Screen name={CONTACT_US} component={ContactUs} />
      <Stack.Screen name={DELETE_ACCOUNT} component={DeleteAccount} />
      <Stack.Screen name={REFER_FRIENDS} component={ReferFriends} />
      <Stack.Screen name={PAYMENTS_METHODS} component={PaymentMethods} />
      <Stack.Screen name={YOUR_PAYMENTS} component={YourPayments} />
      <Stack.Screen name={PAYOUT_METHODS} component={PayoutMethods} />
      <Stack.Screen name={YOUR_PAYOUTS} component={YourPayouts} />
      <Stack.Screen name={CURRENCY} component={Currency} />
      <Stack.Screen name={ADD_PAYOUT_METHOD} component={AddPaymentMethod} />
      <Stack.Screen
        name={ADD_BANK_ACCOUNT_INFO}
        component={AddBankAccountInfo}
      />
      <Stack.Screen name={SETUP_PAYOUTS} component={SetupPayouts} />
      <Stack.Screen name={REVIEW_INFO} component={ReviewInfo} />
      <Stack.Screen
        name={COMPLETE_PAYOUT_PROCESS}
        component={CompletePayoutProcess}
      />
      <Stack.Screen name={COUNTRY_LIST} component={CountryList} />
      <Stack.Screen name={CONTACTS} component={Contacts} />
      <Stack.Screen name={EDIT_PHOTOS} component={EditPhotos} />
      <Stack.Screen name={NATIVE_PAY} component={NativePay} />
      <Stack.Screen name={CANCELLATION_POLICY} component={CancellationPolicy} />
    </Stack.Navigator>
  );
};

export default ProfilePaymentStack;
