import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BackButton from "../../components/backButton";
import { BottomButton, OptionTile } from "../../components/Button";
import images from "../../assets/index";
import colors from "../../config/colors";
import Seperator from "../../components/Seperator";
import { useDispatch, useSelector } from "react-redux";
import * as Typography from "../../config/Typography";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { GetPaymentHistory } from "../../redux/Actions/AccountActions";

const YourPayments = ({ navigation }) => {
  const [payments, setPayments] = useState(["l", "l", "s"]);
  const dispatch = useDispatch();
  const { paymentHistory } = useSelector((state) => state.AccountReducer);
  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(GetPaymentHistory());
  }, [isFocused]);

  const renderPayments = ({ item }) => {
    const {
      createdAt,
      paymentMethodType,
      bookingId,
      amount,
      currency,
      updatedAt,
    } = item;
    const { listingId, checkinDate, checkoutDate } = bookingId;
    const { city, country, images } = listingId;

    const dateCreatedAt = moment(createdAt, "DD/MM/YYYY").format("DD-MM-YYYY");
    const formattedDate = moment(dateCreatedAt, "DD-MM-YYYY").format("DD MMM");
    const checkinDateFormat = moment(checkinDate).format("DD MMM");
    const checkoutDateFormat = moment(checkoutDate).format("DD MMM");
    const thumbnailPath = images[0].uri;

    let paymentMethod;

    switch (paymentMethodType) {
      case "stripe":
        paymentMethod = "Card";
        break;
      case "apple-pay":
        paymentMethod = "Apple Pay";
        break;
      case "google-pay":
        paymentMethod = "Google Pay";
        break;
      default:
        paymentMethod = paymentMethodType;
        break;
    }

    return (
      <OptionTile
        disabled
        heading={`Paid | ${formattedDate}`}
        description={paymentMethod}
        secDescription={`${city}, ${country} | ${checkinDateFormat} - ${checkoutDateFormat}`}
        price={`$${Math.round(amount)}`}
        currency={currency}
        imageStatus
        thumbnailPath={thumbnailPath}
      />
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackButton Text={"Your payments"} onPress={() => navigation.goBack()} />
      {paymentHistory.length === 0 ? (
        <View style={styles.noContainer}>
          <Typography.H color={colors.darkBlue} fontsize={24}>
            No payments found
          </Typography.H>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {/* <Text style={styles.optionHeading}>Completed</Text>
          <Seperator /> */}
          <View style={styles.optionContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.renderItemContainer}
              renderItem={renderPayments}
              data={paymentHistory}
            />
          </View>
        </View>
      )}
      <View style={styles.BackButton}>
        <BottomButton onPress={goBack} color={colors.black} label={"Back"} />
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
  optionHeading: {
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "flex-start",
  },
  optionContainer: {
    gap: 10,
    width: "100%",
    paddingBottom: "30%",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  renderItemContainer: {
    gap: 10,
  },
  noContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default YourPayments;
