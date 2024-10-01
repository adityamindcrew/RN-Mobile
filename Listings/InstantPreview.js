import {
  PlatformPay,
  confirmPlatformPayPayment,
} from "@stripe/stripe-react-native";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import PostAPIs from "../../api/post_api";
import images from "../../assets";
import * as Button from "../../components/Button";
import currencyList from "../../../Currencies.json";
import PaypalWeb from "../../components/Payments/PaypalWeb";
import BookingRequestBanner from "../../components/bookingRequestBanner";
import EmptyCard from "../../components/forms/emptyCard";
import HorizontalFlatlist from "../../components/horizontalFlatList";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import Seperator from "../../components/Seperator";
import mapStyle from "../../../mapStyle.json";
import FastImage from "react-native-fast-image";
import { STOCK_PHOTO } from "../../helpers/Constants";
import { GetBookingsList } from "../../redux/Actions/BookingsAction";
import PopOverModal from "../../components/PopOverModal";
import Slider from "../../components/ImageCarousel/Slider";
import formatDate from "../../utils/formatDate";
import {
  BOOKINGS,
  LISTINGS,
  OTHER_USER_PROFILE,
} from "../../navigation/RouteNames";
import featuresText from "../../utils/featuresText";
import { GetFeedList } from "../../redux/Actions/FeedActions";
import SpinnerOverlay from "../../components/spinner";
import GetAPIs from "../../api/get_api";
import BackButton from "../../components/backButton";
import {
  GetReservationsList,
  updateReservationType,
} from "../../redux/Actions/ReservationsAction";
import calculatePromotionWithCap from "../../utils/calculatePromotionWithCap";
import priceFormat from "../../utils/priceFormat";

const InstantPreview = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const button = route.params.isPrevious;
  const touchable = useRef();
  const [showPop, setShowPop] = useState(false);
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [aparmentInfoArr, setAparmentInfoArr] = useState([]);
  const [mergedArray, setMergedArray] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [allImages, setAllImages] = useState([{ uri: STOCK_PHOTO }]);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [promotion, setPromotion] = useState(0);

  const mapRef = useRef(null);
  const dispatch = useDispatch();
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
    getData();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        getData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await GetAPIs.getOneBooking(route?.params?.id);
      setData([res.data]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (data.length !== 0) {
      setAllImages(
        data[0].listingId.images.length !== 0
          ? data[0].listingId.images
          : [{ uri: STOCK_PHOTO }]
      );
      setCheckInDate(moment(data[0].checkinDate));
      setPlaceType(
        data[0].listingId.selection === "Entire"
          ? data[0].listingId.selection +
              " " +
              data[0].listingId.type.toLowerCase()
          : data[0].listingId.selection + " room"
      );
      const today = moment();
      const isDateGreaterThanToday = moment(data[0].checkinDate).isAfter(today);
      setButtonStatus(isDateGreaterThanToday);
      setPropertyLocation(data[0].listingId.title);
      const newAddressComponents = [];
      let apartStreet = "";
      if (
        data[0].listingId.apartment !== "null" &&
        data[0].listingId.apartment
      ) {
        apartStreet = data[0].listingId.apartment;
      }
      if (data[0].listingId.streetAddress) {
        apartStreet =
          (apartStreet ? apartStreet + " " : "") +
          data[0].listingId.streetAddress;
      }
      if (data[0].listingId.city) {
        newAddressComponents.push(data[0].listingId.city);
      }
      if (data[0].listingId.country) {
        newAddressComponents.push(data[0].listingId.country);
      }
      if (data[0].listingId.zipCode) {
        newAddressComponents.push(data[0].listingId.zipCode);
      }
      setAddressComponents(newAddressComponents);
      setLocation(`${apartStreet}, ${newAddressComponents.join(", ")}`);
      setCheckOutDate(moment(data[0].checkoutDate));
      let chin = moment(data[0].checkinDate, "YYYY-MM-DD");
      let chout = moment(data[0].checkoutDate, "YYYY-MM-DD");
      setCheckin(moment(data[0].checkinDate, "YYYY-MM-DD"));
      setCheckout(moment(data[0].checkoutDate, "YYYY-MM-DD"));

      setCurrencyType(
        currencyList.find((res) => res.currencyCode === data[0].currency)
      );

      let diff = chout.diff(chin, "days") === 0 ? 1 : chout.diff(chin, "days");

      setDiffInDays(
        chout.diff(chin, "days") === 0 ? 1 : chout.diff(chin, "days")
      );

      setCurrencyPrice(data[0].amount / diff);
      // setTotalAmount(data[0].amount);

      const hostPromotion =
        (data[0]?.bookingId?.amount *
          data[0]?.bookingId?.listingId?.userId?.hostPromotion) /
        100;

      console.log(hostPromotion);

      const getPromoAmount = calculatePromotionWithCap({
        diff: diff,
        cap: data[0]?.listingId?.userId?.hostPromotionMaxCap,
        promotion: hostPromotion,
      });
      setPromotion(getPromoAmount);
      setTotalAmount(data[0]?.amount + Number(getPromoAmount));

      setAparmentInfoArr([
        { data: { name: `${data[0].listingId.guests} guests` } },
        { data: { name: `${data[0].listingId.bedrooms} bedrooms` } },
        { data: { name: `${data[0].listingId.beds} beds` } },
        { data: { name: `${data[0].listingId.bathrooms} bathrooms` } },
      ]);

      setMergedArray([
        `${data[0].listingId.guests} guests`,
        `${data[0].listingId.bedrooms} bedrooms`,
        `${data[0].listingId.beds} beds`,
        `${data[0].listingId.bathrooms} bathrooms`,
      ]);

      setAllAmenities(
        data[0].listingId.amenities.concat(
          data[0].listingId.additionalAmenities
        )
      );
      init = {
        latitude: data[0].listingId.latitude,
        longitude: data[0].listingId.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      setInitialRegion(init);
      if (mapRef.current) {
        mapRef.current.animateToRegion(init);
      }
    }
  }, [data]);

  // var checkInDate = moment(data[0].checkinDate);

  // var placeType =
  //   data[0].listingId.selection === "Entire"
  //     ? data[0].listingId.selection +
  //       " " +
  //       data[0].listingId.type.toLowerCase()
  //     : data[0].listingId.selection + " room";

  // var propertyLocation = data[0].listingId.title;

  // var addressComponents = [];

  // if (data[0].listingId.apartment) {
  //   addressComponents.push(data[0].listingId.apartment);
  // }
  // if (data[0].listingId.streetAddress) {
  //   addressComponents.push(data[0].listingId.streetAddress);
  // }
  // if (data[0].listingId.city) {
  //   addressComponents.push(data[0].listingId.city);
  // }

  // if (data[0].listingId.country) {
  //   addressComponents.push(data[0].listingId.country);
  // }

  // if (data[0].listingId.zipCode) {
  //   addressComponents.push(data[0].listingId.zipCode);
  // }

  // var location = addressComponents.join(", ");

  // var checkOutDate = moment(data[0].checkoutDate);

  // var checkin = moment(data[0].checkinDate, "YYYY-MM-DD");
  // var checkout = moment(data[0].checkoutDate, "YYYY-MM-DD");

  // let currencyType = currencyList.find(
  //   (res) => res.currencyCode === data[0].currency
  // );

  // var diffInDays =
  //   checkout.diff(checkin, "days") === 0 ? 1 : checkout.diff(checkin, "days");

  // var currencyPrice = data[0].amount / diffInDays;
  // var totalAmount = data[0].amount;

  // var aparmentInfoArr = [];
  // aparmentInfoArr.push({
  //   data: { name: data[0].listingId.guests + " " + "guests" },
  // });
  // aparmentInfoArr.push({
  //   data: { name: data[0].listingId.bedrooms + " " + "bedrooms" },
  // });
  // aparmentInfoArr.push({
  //   data: { name: data[0].listingId.beds + " " + "beds" },
  // });
  // aparmentInfoArr.push({
  //   data: { name: data[0].listingId.bathrooms + " " + "bathrooms" },
  // });

  // var mergedArray = [
  //   ...[
  //     data[0].listingId.guests + " " + "guests",
  //     data[0].listingId.bedrooms + " " + "bedrooms",
  //     data[0].listingId.beds + " " + "beds",
  //     data[0].listingId.bathrooms + " " + "bathrooms",
  //   ],
  // ];

  // var allAmenities = data[0].listingId.amenities.concat(
  //   data[0].listingId.additionalAmenities
  // );

  const sliceAmenities = () => {
    setShowAll(true);
  };

  const showCancelPopUp = (status) => {
    Alert.alert(
      "Cercles",
      "Are you sure you want to cancel this booking?\nYou can view cancellation policy under profile > settings > cancellation policy",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: () => updateReservationStatus(status),
        },
        {
          text: "No",
          onPress: () => null,
          style: "cancel",
        },
      ]
    );
  };

  const updateReservationStatus = async (response) => {
    if (data[0].listingId.instantBookingAllowed) {
      let formdata = {
        id: data[0].id,
        status: response,
      };
      try {
        setLoading(true);
        const res = await PostAPIs.updatedBookings(formdata);
        dispatch(GetReservationsList());
        dispatch(GetFeedList());
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (error?.response?.data) {
          Alert.alert(error?.response?.data?.message[0]);
        } else {
          Alert.alert("Something went wrong!");
        }
      }
    } else {
      let formdata = {
        id: data[0].reservation.id,
        status: response,
      };
      try {
        setLoading(true);
        const res = await PostAPIs.updatedReservations(formdata);
        dispatch(GetReservationsList());
        dispatch(GetFeedList());
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (error?.response?.data) {
          Alert.alert(error?.response?.data?.message[0]);
        } else {
          Alert.alert("Something went wrong!");
        }
      }
    }
  };

  const showAllAmenities = () => {
    const amenitiesToDisplay = showAll
      ? allAmenities
      : allAmenities.slice(0, 5);

    return amenitiesToDisplay.map((data) => {
      let uri = "";
      if (data.amenityId) {
        uri = data.amenityId.uri;
      } else if (data.additionalAmenityId) {
        uri = data.additionalAmenityId.uri;
      }
      let name = "";
      if (data.amenityId) {
        name = data.amenityId.name;
      } else if (data.additionalAmenityId) {
        name = data.additionalAmenityId.name;
      }
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginVertical: 5,
          }}
        >
          <FastImage style={{ height: 24, width: 24 }} source={{ uri: uri }} />
          <Text style={[styles.houseText, { fontSize: 14 }]}>{name}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <SpinnerOverlay loaderState={loading} textContent={"Loading..."} />
      <ScrollView contentContainerStyle={{ paddingBottom: "5%" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(LISTINGS, { key: 2 })}
          style={styles.backIcon}
        >
          <SvgXml xml={images.backArrow()} />
        </TouchableOpacity>
        <View style={styles.imageSliderView}>
          <Slider height={350} images={allImages} />
        </View>
        <Seperator seperate={10} />
        <EmptyCard>
          <View style={styles.title}>
            <Typography.H color={colors.darkBlue} fontsize={18}>
              {propertyLocation}
            </Typography.H>
          </View>
          <View style={styles.locationView}>
            <Typography.ChileLine color={colors.grayText} size={14}>
              {location}
            </Typography.ChileLine>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <Text style={styles.descriptionText}>
          Payouts will be dispatched 24 hours post guest check in, and may take
          few business days.
        </Text>

        <Seperator />

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
              {(data[0]?.listingId.guests || 0) + " guests"}
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
                {currencyPrice} x {diffInDays}{" "}
                {diffInDays > 1 ? "nights" : "night"}
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  {currencyType.symbol}
                  {(currencyPrice * diffInDays)
                    .toLocaleString("en-US")
                    .toString()}
                </Typography.ChileLine>
              </View>
            </View>
            {/* <View style={styles.priceContainer}>
              <PopOverModal
                text={"Accidental damage protection to property contents"}
                isVisible={showPop}
                ref={touchable}
                onRequestClose={() => setShowPop(!showPop)}
              />
              <TouchableOpacity
                onPress={() => setShowPop(!showPop)}
                ref={touchable}
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
                  {data[0]?.insuranceFees}
                </Typography.ChileLine>
              </View>
            </View> */}
            {/* <View style={styles.priceContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={500}
              >
                Cercles fee
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  {currencyType.symbol}1.26
                </Typography.ChileLine>
              </View>
            </View> */}
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
                    +{currencyType.symbol + priceFormat(promotion || 0)}
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
                  {totalAmount.toLocaleString("en-US").toString()}
                </Typography.ChileLine>
              </View>
            </View>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />
        <EmptyCard>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: data[0]?.userId,
              })
            }
            style={styles.userDesCard}
          >
            <View style={styles.textStyle}>
              <Typography.H color={colors.darkBlue} fontsize={18}>
                {placeType}, Reserved by {data[0]?.userId?.firstName}
              </Typography.H>
            </View>
            <FastImage
              style={styles.userImg}
              source={{
                uri:
                  data[0]?.userId?.personalImgs?.length > 0
                    ? data[0]?.userId?.personalImgs[0]?.uri
                    : STOCK_PHOTO,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: data[0]?.listingId.userId,
              })
            }
            style={{
              marginTop: 10,
            }}
          >
            {featuresText(mergedArray)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: data[0]?.listingId.userId,
              })
            }
            style={styles.horizontalLine}
          />
          <Seperator />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: data[0]?.listingId.userId,
              })
            }
            style={styles.propertyType}
          >
            <SvgXml
              style={{ alignSelf: "center" }}
              width={24}
              height={24}
              xml={
                data[0]?.listingId.selection === "Entire"
                  ? images.HouseIcon()
                  : images.SaparateRoomIcon()
              }
            />
            <View style={{ marginLeft: 20 }}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={700}
              >
                {placeType}
              </Typography.ChileLine>
              <Text style={styles.houseText}>
                {data[0]?.listingId.selection === "Entire"
                  ? "you will have the whole place to yourself"
                  : "You will have your own room but there may be other people in other rooms"}
              </Text>
            </View>
          </TouchableOpacity>
          <Seperator seperate={10} />
        </EmptyCard>
        <View style={styles.saparator} />

        {data[0]?.listingId.description && (
          <>
            <EmptyCard>
              <View style={styles.apartmentDes}>
                <Typography.H color={colors.darkBlue} fontsize={16}>
                  About apartment
                </Typography.H>
                <Text
                  style={{
                    color: colors.grayText,
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 22,
                  }}
                >
                  {data[0]?.listingId.description}
                </Text>
              </View>
            </EmptyCard>
            <View style={styles.saparator} />
          </>
        )}

        <EmptyCard>
          <View style={styles.apartmentDes}>
            <Typography.H color={colors.darkBlue} fontsize={16}>
              Apartment location
            </Typography.H>
          </View>
          <MapView
            // customMapStyle={mapStyle}
            style={styles.map}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            onRegionChangeComplete={(region) => {
              mapRef.current.__lastRegion = region;
            }}
          >
            <Marker coordinate={initialRegion}></Marker>
          </MapView>
          <View style={styles.apartmentDes}>
            <Typography.H color={colors.darkBlue} fontsize={16}>
              {location}
            </Typography.H>
            <Text style={styles.houseText}>
              Located at {data[0]?.listingId.city}
            </Text>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.apartmentDes}>
            <Seperator />
            <Typography.H color={colors.darkBlue} fontsize={16}>
              What this place offers?
            </Typography.H>
            <Seperator />
            {showAllAmenities()}
            {allAmenities.length > 5 && !showAll && (
              <>
                <Seperator seperate={10} />
                <Button.BtnContain
                  label={`Show all ${allAmenities.length} amenities`}
                  color={colors.darkBlue}
                  labelcolor="white"
                  onPress={sliceAmenities}
                />
              </>
            )}
            {/* {amenitiesMergedArray.map((item) => (
              <View key={item.amenityId.id}>
                <View style={{ flexDirection: "row", margin: 5 }}>
                  <Image
                    width={20}
                    height={20}
                    source={{ uri: item.amenityId.uri }}
                  />
                  <Text style={{ color: colors.grayText, marginLeft: 10 }}>
                    {item.amenityId.name}
                  </Text>
                </View>
              </View>
            ))} */}
          </View>
        </EmptyCard>
        <Seperator seperate={10} />
        {!button && (
          <View style={styles.confirmButtons}>
            <Button.CircularSmallButton
              backgroundColor={colors.white}
              title={"Back"}
              textColor={colors.black}
              onPress={() => navigation.navigate(LISTINGS, { key: 2 })}
            />

            <Button.CircularSmallButton
              disabled={loading}
              backgroundColor={colors.primary}
              title={"Cancel Booking"}
              textColor={colors.white}
              onPress={() => showCancelPopUp("cancelled")}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmButtons: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  title: {
    marginVertical: 3,
    marginLeft: 10,
    padding: 10,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  insuranceIconView: {},
  priceView: {
    marginRight: 20,
  },
  map: {
    height: 200,
    width: "90%",
    alignSelf: "center",
  },

  propertyType: {
    marginLeft: 20,
    flexDirection: "row",
  },
  saparator: {
    marginTop: 10,
  },
  locationView: { marginLeft: 20, bottom: 20, marginTop: 10 },
  houseText: {
    color: colors.grayText,
    fontSize: 12,
    fontWeight: "500",
    maxWidth: 260,
  },
  horizontalLine: {
    height: 1,
    width: "90%",
    backgroundColor: colors.grayText,
    alignSelf: "center",
    marginTop: 10,
  },
  contentSet: {
    marginLeft: 20,
    marginTop: 40,
    bottom: 20,
  },
  userDesCard: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  horizontalFlatListBar: {
    height: 20,
    width: 1,
    backgroundColor: colors.grayText,
    alignSelf: "center",
    marginLeft: 10,
    bottom: 5,
  },
  bottomViewStyle: {
    marginTop: "5%",
    marginBottom: "5%",
    width: "80%",
    alignSelf: "center",
  },
  backBottomViewStyle: {
    marginTop: "0%",
    width: "80%",
    alignSelf: "center",
  },
  flatListContainer: { margin: 5, alignSelf: "center", flexDirection: "row" },
  flatListItemView: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  userImg: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
  },
  textStyle: {
    maxWidth: 250,
  },
  apartmentDes: {
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  imageSliderView: {
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  backIcon: {
    position: "absolute",
    left: "3%",
    top: "1%",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 13,
    zIndex: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 19.36,
    fontWeight: "500",
    color: colors.grayText,
    paddingHorizontal: 24,
  },
});

export default InstantPreview;
