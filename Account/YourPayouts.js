import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BackButton from "../../components/backButton";
import { BottomButton, OptionTile } from "../../components/Button";
import images from "../../assets/index";
import colors from "../../config/colors";
import Seperator from "../../components/Seperator";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import * as Typography from "../../config/Typography";
import { currencyList } from "../../components/Currencies/StripeCurrencies";
import { useIsFocused } from "@react-navigation/native";
import { getPayoutHistory } from "../../redux/Actions/AccountActions";
import priceFormat from "../../utils/priceFormat";

const YourPayouts = ({ navigation }) => {
  const { payoutHistory } = useSelector((state) => state.AccountReducer);
  const dispatch = useDispatch();

  const [payments, setPayments] = useState(payoutHistory || []);
  const [openCard, setOpenCard] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(getPayoutHistory());
  }, [isFocused]);

  const card = (id) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? { ...payment, openCard: !payment.openCard || false }
          : payment
      )
    );
  };

  const renderPayments = ({ item }) => {
    const { id, openCard = false } = item;
    const user = item?.bookingId?.userId;
    const createdAt = item?.createdAt.split(",")[0];
    const payoutStatus = item?.status === "succeeded";
    const date = moment(createdAt, "DD/MM/YYYY");
    const paidDate = moment(date).format("MMM DD, YYYY");
    const checkIn = moment(item?.bookingId?.checkinDate).format("MMM D, YYYY");
    const checkOut = moment(item?.bookingId?.checkoutDate).format(
      "MMM D, YYYY"
    );
    const currency = item?.currency;
    const amount = priceFormat(item?.amount) || 0;
    const fullName = (user?.firstName || "") + " " + (user?.lastName || "");
    let currencyType = currencyList.find(
      (res) => res?.currencyCode === currency
    );
    const commission = priceFormat(item?.hostCommissionAmount) || 0;
    const promotion = priceFormat(item?.hostPromotionAmount) || 0;
    const guestAmount = priceFormat(Number(item?.bookingId?.amount)) || 0;
    return (
      <OptionTile
        textStatus
        onPress={() => card(id)}
        heading={paidDate}
        description={`${fullName} | ${checkIn}-${checkOut}`}
        price={`${currencyType?.symbol}${amount}`}
        currency={currency}
        icon2={openCard ? images.UpIcon() : images.DownIcon()}
        onPressRightIcon={() => card(id)}
        details1={"Payout from guests"}
        details1Pay={`${currencyType?.symbol}${guestAmount}`}
        details2={"Cercles Fee"}
        details2Pay={`${currencyType?.symbol}${commission}`}
        details3={"Host Promotion"}
        details3Pay={`${currencyType?.symbol}${promotion}`}
        details4={"Your Payout"}
        details4Pay={`${currencyType?.symbol}${amount}`}
        openCard={openCard}
        payoutStatus={payoutStatus}
      />
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackButton Text={"Your payouts"} onPress={() => navigation.goBack()} />
      {!payments.length === 0 ? (
        <View style={styles.noContainer}>
          <Typography.H color={colors.darkBlue} fontsize={24}>
            No payouts found
          </Typography.H>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <Text style={styles.descriptionText}>
            Payouts will be dispatched 24 hours post guest check in, and may
            take few business days.
          </Text>
          <Seperator seperate={6} />
          <Seperator />
          <View style={styles.optionContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.renderItemContainer}
              renderItem={renderPayments}
              data={payments}
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
    paddingHorizontal: 13,
    alignItems: "center",
    paddingBottom: "40%",
  },
  optionHeading: {
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "flex-start",
  },
  optionContainer: {
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
  renderItemContainer: {
    gap: 10,
  },
  noContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  descriptionText: {
    fontSize: 16,
    lineHeight: 19.36,
    fontWeight: "500",
    color: colors.grayText,
  },
});

export default YourPayouts;
