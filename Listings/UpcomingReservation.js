import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import PostAPIs from "../../api/post_api";
import * as Button from "../../components/Button";
import currencyList from "../../../Currencies.json";
import BackButton from "../../components/backButton";
import BookingCard from "../../components/bookingCard";
import EmptyCard from "../../components/forms/emptyCard";
import SpinnerOverlay from "../../components/spinner";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { useDispatch } from "react-redux";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import formatDate from "../../utils/formatDate";
import { LISTINGS, OTHER_USER_PROFILE } from "../../navigation/RouteNames";
import FastImage from "react-native-fast-image";
import { STOCK_PHOTO } from "../../helpers/Constants";
import {
  GetReservationsList,
  updateReservationType,
} from "../../redux/Actions/ReservationsAction";
import GetAPIs from "../../api/get_api";
import Seperator from "../../components/Seperator";
import { Text } from "react-native";
import priceFormat from "../../utils/priceFormat";
import calculatePromotionWithCap from "../../utils/calculatePromotionWithCap";
const UpcomingReservation = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [checkInDate, setCheckInDate] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [addressComponents, setAddressComponents] = useState([]);
  const [location, setLocation] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [currencyType, setCurrencyType] = useState("");
  const [diffInDays, setDiffInDays] = useState(0);
  const [currencyPrice, setCurrencyPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [userImgUri, setUserImgUri] = useState(STOCK_PHOTO);
  const [propertyImage, setPropertyImage] = useState(STOCK_PHOTO);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [promotion, setPromotion] = useState(0);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(updateReservationType(2));
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (data.length !== 0) {
      const today = moment();
      const isDateGreaterThanToday = moment(
        data[0]?.bookingId?.checkinDate
      ).isSameOrBefore(today);
      setButtonStatus(isDateGreaterThanToday);
      setUserImgUri(
        data[0]?.bookingId?.userId?.personalImgs?.length !== 0
          ? data[0]?.bookingId.userId.personalImgs[0]?.uri
          : STOCK_PHOTO
      );
      let positionedPhotos = data[0]?.bookingId?.listingId.images.sort(
        (a, b) => a.position - b.position
      );
      setPropertyImage(
        data[0]?.bookingId?.listingId.images.length !== 0
          ? positionedPhotos[0].uri
          : STOCK_PHOTO
      );
      setCurrencyType(
        currencyList.find(
          (res) => res.currencyCode === data[0]?.bookingId?.currency
        )
      );
      setPropertyLocation(
        data[0]?.bookingId?.listingId.title +
          " in " +
          data[0]?.bookingId?.listingId.city +
          " " +
          data[0]?.bookingId?.listingId.country
      );
      setPropertyType(
        data[0]?.bookingId?.listingId.selection +
          " " +
          data[0]?.bookingId?.listingId.type +
          " in " +
          data[0]?.bookingId?.listingId.city
      );
      setCheckInDate(moment(data[0]?.bookingId?.checkinDate));
      setCheckOutDate(moment(data[0]?.bookingId?.checkoutDate));

      var checkin = moment(data[0]?.bookingId?.checkinDate, "YYYY-MM-DD");
      var checkout = moment(data[0]?.bookingId?.checkoutDate, "YYYY-MM-DD");

      var diffInDays = checkout.diff(checkin, "days");

      setDiffInDays(diffInDays);

      const hostPromotion =
        (data[0]?.bookingId?.amount *
          data[0]?.bookingId?.listingId?.userId?.hostPromotion) /
        100;

      setCurrencyPrice(Number(data[0]?.bookingId?.amount) / Number(diffInDays));

      const getPromoAmount = calculatePromotionWithCap({
        diff: diffInDays,
        cap: data[0]?.bookingId?.listingId?.userId?.hostPromotionMaxCap,
        promotion: hostPromotion,
      });
      setPromotion(getPromoAmount);
      setTotalAmount(data[0]?.bookingId?.amount + Number(getPromoAmount));
    }
  }, [data]);

  useEffect(() => {
    getBookingData();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        getBookingData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getBookingData = async () => {
    setLoader(true);
    try {
      const res = await GetAPIs.getOneReservation(route?.params?.id);
      setData([res.data]);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error.response.data);
    }
  };

  const dialCall = (userId) => {
    navigation.navigate(OTHER_USER_PROFILE, {
      userId,
    });
  };

  const cancelReservation = () => {
    const params = {
      id: route?.params?.id,
      status: "cancelled",
    };
    Alert.alert(
      "Cercles",
      "Are you sure you want to cancel this booking?\nYou can view cancellation policy under profile > settings > cancellation policy",
      [
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setLoader(true);
              const res = await PostAPIs.updatedReservations(params);
              console.log(res);
              setLoader(false);
              dispatch(GetReservationsList());
              navigation.goBack();
            } catch (error) {
              console.log(error);
              setLoader(false);
              if (error?.response?.data) {
                Alert.alert(error?.response?.data?.message[0]);
              } else {
                Alert.alert("Something went wrong!");
              }
            }
          },
        },
        {
          text: "Go back",
          onPress: () => null,
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.navigate(LISTINGS, { key: 2 })}
        Text={buttonStatus ? "Current reservation" : "Upcoming reservation"}
      />
      <SpinnerOverlay textContent={"Loading..."} loaderState={loader} />
      <BookingCard
        title={propertyType}
        description={propertyLocation}
        propertyImage={propertyImage}
      />
      <ScrollView>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.contentSet}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={500}
            >
              Dates
            </Typography.ChileLine>
            <View style={styles.saparator} />

            <Typography.ChileLine
              color={colors.grayText}
              size={16}
              fontweight={500}
            >
              {formatDate(checkInDate, checkOutDate)}
            </Typography.ChileLine>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.contentSet}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={500}
            >
              Guest
            </Typography.ChileLine>
            <View style={styles.saparator} />

            <Typography.ChileLine
              color={colors.grayText}
              size={16}
              fontweight={500}
            >
              {(data[0]?.bookingId?.listingId.guests || 0) + " guests"}
            </Typography.ChileLine>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.contentSet}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={18}
              fontweight={700}
            >
              Price details
            </Typography.ChileLine>
            <View style={styles.priceContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={500}
              >
                {currencyType.symbol}
                {priceFormat(currencyPrice)} x {diffInDays}{" "}
                {diffInDays > 1 ? "nights" : "night"}
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  {currencyType.symbol}
                  {priceFormat(currencyPrice * diffInDays)}
                </Typography.ChileLine>
              </View>
            </View>
            {data[0]?.bookingId?.listingId?.userId?.hostPromotion ? (
              <View style={styles.priceContainer}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  Promotion
                </Typography.ChileLine>
                <View style={styles.priceView}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={500}
                  >
                    {currencyType.symbol + priceFormat(promotion)}
                  </Typography.ChileLine>
                </View>
              </View>
            ) : (
              <></>
            )}

            <View style={styles.priceContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={700}
              >
                Total ({data[0]?.bookingId?.currency})
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={700}
                >
                  {currencyType.symbol}
                  {priceFormat(totalAmount)}
                </Typography.ChileLine>
              </View>
            </View>
            <Seperator />
            <View
              style={{
                height: 1,
                backgroundColor: colors.horizontalLineColor,
                width: "95%",
              }}
            />
          </View>
          <Text style={styles.descriptionText}>
            Your payout will be dispatched 24 hours after your guest checks in.
            You can view your payout summary in profile > settings > payments
            and payouts > your payouts.
          </Text>
          <Seperator seperate={10} />
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.imgHostView}>
            <FastImage
              style={styles.userImg}
              source={{
                uri: userImgUri,
              }}
            />
            <View style={styles.hostNameView}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={18}
                fontweight={700}
              >
                {buttonStatus ? "Current reservation" : "Upcoming reservation"}{" "}
                by {data[0]?.bookingId?.userId.firstName}
              </Typography.ChileLine>
            </View>
          </View>

          <View style={styles.ContactHostBtn}>
            <Button.BtnContain
              label="Contact Guest"
              color={colors.darkBlue}
              labelcolor="white"
              onPress={() => dialCall(data[0]?.bookingId?.userId)}
            />
          </View>
        </EmptyCard>
        {!buttonStatus ? (
          <View style={styles.bottomViewStyle}>
            <Button.BtnConfirmCancel
              disabled={loader}
              onPressConfirm={() => cancelReservation()}
              onPressCancel={() => navigation.navigate(LISTINGS, { key: 2 })}
              confirmTitle={"Cancel reservation"}
              cancelTitle={"Back"}
              cancelButtonColor={colors.white}
              cancelTextColor={colors.darkBlue}
            />
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomViewStyle: {
    marginTop: "20%",
    marginBottom: "5%",
  },
  addPaymentBtn: {
    width: "90%",
    alignSelf: "center",
    marginTop: 50,
    bottom: 20,
  },

  insuranceIconView: {
    left: 5,
    alignSelf: "center",
    bottom: 2,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  priceView: {
    marginRight: 20,
  },
  contentSet: {
    marginLeft: 20,
    marginTop: 40,
    bottom: 20,
  },
  description: {
    fontSize: 16,
  },
  saparator: {
    marginTop: 10,
  },
  imgHostView: {
    flexDirection: "row",
    marginTop: 10,
  },
  ContactHostBtn: {
    marginTop: 40,
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  hostMszView: {
    marginTop: 10,
    marginLeft: 20,
  },
  hostNameView: {
    alignSelf: "center",
    marginLeft: 20,
    maxWidth: 250,
  },
  userImg: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 16.94,
    fontWeight: "500",
    color: colors.grayText,
    paddingHorizontal: 18,
  },
});

export default UpcomingReservation;
