import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import currencyList from "../../../Currencies.json";
import BackButton from "../../components/backButton";
import BookingCard from "../../components/bookingCard";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import PopOverModal from "../../components/PopOverModal";
import formatDate from "../../utils/formatDate";
import { LISTINGS, OTHER_USER_PROFILE } from "../../navigation/RouteNames";
import FastImage from "react-native-fast-image";
import { STOCK_PHOTO } from "../../helpers/Constants";
import { updateBookingType } from "../../redux/Actions/BookingsAction";
import priceFormat from "../../utils/priceFormat";
const PreviousBooking = ({ navigation, ...props }) => {
  const { listingId } = props.route.params.item;
  const touchable = useRef();
  const [showPop, setShowPop] = useState(false);

  const propertyType =
    listingId.selection + " " + listingId.type + " in " + listingId.city;

  const propertyLocation =
    listingId.selection +
    " " +
    listingId.type +
    " in " +
    listingId.city +
    " " +
    listingId.country +
    " close to " +
    listingId.streetAddress;

  var checkInDate = moment(props.route.params.item.checkinDate);
  var formattedCheckInDate = checkInDate.format("DD-MM-YYYY");

  var checkOutDate = moment(props.route.params.item.checkoutDate);
  var formattedCheckOutDate = checkOutDate.format("DD-MM-YYYY");

  // Convert them into Moment.js objects
  var checkin = moment(props.route.params.item.checkinDate, "YYYY-MM-DD");
  var checkout = moment(props.route.params.item.checkoutDate, "YYYY-MM-DD");

  let currencyType = currencyList.find(
    (res) => res.currencyCode === props.route.params.item.currency
  );

  // Calculate the difference in days
  var diffInDays = checkout.diff(checkin, "days");

  const newPricing = props.route.params.item.guestFees * diffInDays;

  var currencyPrice = props.route.params.item.amount / diffInDays;
  var totalAmount =
    props.route.params.item.amount +
    Number(priceFormat(props.route.params.item.insuranceFees)) +
    newPricing -
    Number(priceFormat(props.route.params.item.promotion || 0));

  const ContactHost = (userId) => {
    navigation.navigate(OTHER_USER_PROFILE, {
      userId,
    });
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(updateBookingType(3));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Previous booking"}
      />

      <BookingCard
        title={propertyType}
        description={propertyLocation}
        propertyImage={
          listingId.images.length !== 0 ? listingId.images[0].uri : STOCK_PHOTO
        }
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
              {listingId.guests + " guests"}
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
            <View style={styles.priceContainer}>
              <PopOverModal
                text={"Accidental damage protection to property contents"}
                isVisible={showPop}
                ref={touchable}
                onRequestClose={() => setShowPop(!showPop)}
              />
              <TouchableOpacity
                ref={touchable}
                onPress={() => setShowPop(!showPop)}
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  Insurance fee
                </Typography.ChileLine>
                <SvgXml
                  style={styles.insuranceIconView}
                  height={12}
                  width={12}
                  xml={images.InformationIcon()}
                />
              </TouchableOpacity>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  {currencyType.symbol}
                  {priceFormat(props.route.params.item.insuranceFees)}
                </Typography.ChileLine>
              </View>
            </View>
            {props.route.params.item.promotion ? (
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
                    -
                    {currencyType.symbol +
                      priceFormat(props.route.params.item.promotion || 0)}
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
                Total ({currencyType.currencyCode})
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
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.imgHostView}>
            <FastImage
              style={styles.userImg}
              source={{
                uri:
                  listingId?.userId?.personalImgs.length > 0
                    ? listingId?.userId?.personalImgs[0]?.uri
                    : STOCK_PHOTO,
              }}
            />
            <View style={styles.hostNameView}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={16}
                fontweight={700}
              >
                Hosted by {listingId.userId.firstName}
              </Typography.ChileLine>
            </View>
          </View>

          <View style={styles.ContactHostBtn}>
            <Button.BtnContain
              label="Contact Host"
              color={colors.darkBlue}
              labelcolor="white"
              onPress={() => ContactHost(listingId.userId)}
            />
          </View>
        </EmptyCard>

        <View style={styles.addPaymentBtn}>
          <Button.BtnContain
            label="Back"
            color={colors.white}
            labelcolor={colors.darkBlue}
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addPaymentBtn: {
    width: "90%",
    alignSelf: "center",
    marginTop: 50,
    bottom: 20,
  },

  insuranceIconView: {},
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
  },
  userImg: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
    marginLeft: 20,
  },
});

export default PreviousBooking;
