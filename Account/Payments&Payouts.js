import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BackButton from "../../components/backButton";
import images from "../../assets/index";
import { BottomButton, CircularBtnIcon } from "../../components/Button";
import colors from "../../config/colors";
import {
  CURRENCY,
  PAYMENTS_METHODS,
  PAYOUT_METHODS,
  YOUR_PAYMENTS,
  YOUR_PAYOUTS,
} from "../../navigation/RouteNames";
import { useSelector } from "react-redux";
import Seperator from "../../components/Seperator";

const PaymentsPayouts = ({ navigation }) => {
  const { currency, profileData } = useSelector(
    (state) => state.AccountReducer
  );

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Payments & Payouts"}
      />
      <View style={styles.mainContainer}>
        <Text style={styles.optionHeading}>Payments</Text>
        <Seperator />
        <View style={styles.optionContainer}>
          <CircularBtnIcon
            rightArrowIconStatus
            onPress={() => navigateTo(PAYMENTS_METHODS)}
            iconStatus
            icon={images.PaymentIcon(colors.primary)}
            label={"Payment methods"}
          />
          <CircularBtnIcon
            rightArrowIconStatus
            onPress={() => navigateTo(YOUR_PAYMENTS)}
            iconStatus
            icon={images.CoinsIcon(colors.primary)}
            label={"Your payments"}
          />
        </View>
        <Seperator seperate={15} />
        <Text style={styles.optionHeading}>Payouts</Text>
        <Seperator />
        <View style={styles.optionContainer}>
          <CircularBtnIcon
            rightArrowIconStatus
            onPress={() => navigateTo(PAYOUT_METHODS)}
            iconStatus
            icon={images.Payout(colors.primary)}
            label={"Payout methods"}
          />
          <CircularBtnIcon
            rightArrowIconStatus
            onPress={() => navigateTo(YOUR_PAYOUTS)}
            iconStatus
            icon={images.CoinsIcon(colors.primary)}
            label={"Your payouts"}
          />
        </View>
        <Seperator seperate={15} />
        <Text style={styles.optionHeading}>Currency</Text>
        <Seperator />
        <CircularBtnIcon
          onPress={() => navigateTo(CURRENCY)}
          iconStatus
          icon={images.CoinsIcon(colors.primary)}
          label={currency || "Select a currency"}
          rightArrowIconStatus
          // isoCode={currency.countryCode || "IN"}
        />
      </View>
      <View style={styles.BackButton}>
        <BottomButton onPress={() => navigation.goBack()} label={"Back"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  seperator: {
    marginVertical: 5,
  },
  optionHeading: {
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "flex-start",
  },
  optionContainer: {
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
});

export default PaymentsPayouts;
