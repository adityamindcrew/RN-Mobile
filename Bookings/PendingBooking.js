import {
  PlatformPay,
  confirmPlatformPayPayment,
  isPlatformPaySupported,
  useStripe,
} from "@stripe/stripe-react-native";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import PostAPIs from "../../api/post_api";
import images from "../../assets";
import * as Button from "../../components/Button";
import currencyList from "../../../Currencies.json";
import PaypalWeb from "../../components/Payments/PaypalWeb";
import BookingRequestBanner from "../../components/bookingRequestBanner";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import {
  FormVisibilty,
  GetPaymentMethods,
  TabBarVisibility,
} from "../../redux/Actions/AccountActions";
import Seperator from "../../components/Seperator";
import FastImage from "react-native-fast-image";
import { STOCK_PHOTO } from "../../helpers/Constants";
import {
  GetBookingsList,
  updateBookingType,
} from "../../redux/Actions/BookingsAction";
import PopOverModal from "../../components/PopOverModal";
import Slider from "../../components/ImageCarousel/Slider";
import formatDate from "../../utils/formatDate";
import {
  BOOKINGS,
  BOOKINGS_STACK,
  BOTTOM_STACK,
  FEED_STACK,
  OTHER_USER_PROFILE,
} from "../../navigation/RouteNames";
import featuresText from "../../utils/featuresText";
import { GetFeedList } from "../../redux/Actions/FeedActions";
import { CommonActions } from "@react-navigation/native";
import GetAPIs from "../../api/get_api";
import SpinnerOverlay from "../../components/spinner";
import BottomCard from "../../components/bottomCard";
import CreditCardForm from "../../components/forms/CreditCardForm";
import { storage } from "../../components/asyncStorageToken";
import BackButton from "../../components/backButton";
import priceFormat from "../../utils/priceFormat";
import { INFO_FOR_GUESTS } from "../../redux/Type";
import { TouchableWithoutFeedback } from "react-native";
import HomeDetails from "../../components/HomeDetails";
import ApartmentMapLocation from "../../components/ApartmentMapLocation";
import PlaceOffersAmenities from "../../components/PlaceOffersAmenities";
import AboutHome from "../../components/AboutHome";

const PendingBooking = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [placeImages, setPlaceImages] = useState([]);
  const touchable = useRef();
  const [showPop, setShowPop] = useState(false);
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [platformPaySupport, setPlatformPaySupport] = useState(false);
  const [bottomCard, setBottomCard] = useState(false);
  const { country } = useSelector((state) => state.AccountReducer);
  const { paymentMethodData, paymentFormVisibility } = useSelector(
    (state) => state.AccountReducer
  );
  const [fullName, setFullName] = useState("");
  const { createToken } = useStripe();
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [validDetails, setValidDetails] = useState(false);
  const [selectedPaymentMethodType, setSelectedPaymentMethodType] = useState(
    data[0]?.selectedPaymentMethodType || null
  );
  const [houseRules, setHouseRules] = useState(false);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useMemo(async () => {
    let defaultPaymentMethod = paymentMethodData.filter((res) => res.isDefault);

    if (defaultPaymentMethod.length > 0) {
      setSelectedCard(defaultPaymentMethod[0]?.paymentMethodId);
    }
    const support = await isPlatformPaySupported();

    setPlatformPaySupport(support);
  }, []);

  const mapRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(updateBookingType(1));
    });

    return unsubscribe;
  }, [navigation]);

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

  useEffect(() => {
    if (data.length !== 0) {
      setInitialRegion({
        latitude: data[0].listingId.latitude,
        longitude: data[0].listingId.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }, [data]);

  const getBookingData = async () => {
    setLoading(true);
    try {
      const res = await GetAPIs.getOneBooking(route?.params?.id);
      setData([res.data]);
      let positionedPhotos = res.data.listingId.images.sort(
        (a, b) => a.position - b.position
      );
      setPlaceImages(positionedPhotos);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };

  if (data.length !== 0) {
    var placeType =
      data[0].listingId.selection === "Entire"
        ? data[0].listingId.selection +
          " " +
          data[0].listingId.type.toLowerCase()
        : data[0].listingId.selection + " room";

    var propertyLocation = data[0].listingId.title;
    var location = data[0].listingId.city + ", " + data[0].listingId.country;

    var checkInDate = moment(data[0].checkinDate);

    var checkOutDate = moment(data[0].checkoutDate);

    var checkin = moment(data[0].checkinDate, "YYYY-MM-DD");
    var checkout = moment(data[0].checkoutDate, "YYYY-MM-DD");

    let currencyType = currencyList.find(
      (res) => res.currencyCode === data[0].currency
    );

    var diffInDays =
      checkout.diff(checkin, "days") === 0 ? 1 : checkout.diff(checkin, "days");

    const newPricing = data[0].guestFees * diffInDays;

    var guestFees = data[0].guestFees || 0;
    var currencyPrice = data[0].amount / diffInDays;
    var totalAmount =
      data[0].amount +
      Number(priceFormat(data[0].insuranceFees)) +
      newPricing -
      Number(priceFormat(data[0].promotion || 0));

    var aparmentInfoArr = [];
    aparmentInfoArr.push({
      data: { name: data[0].listingId.guests + " " + "guests" },
    });
    aparmentInfoArr.push({
      data: { name: data[0].listingId.bedrooms + " " + "bedrooms" },
    });
    aparmentInfoArr.push({
      data: { name: data[0].listingId.beds + " " + "beds" },
    });
    aparmentInfoArr.push({
      data: { name: data[0].listingId.bathrooms + " " + "bathrooms" },
    });

    var mergedArray = [
      ...[
        data[0].listingId.guests + " " + "guests",
        data[0].listingId.bedrooms + " " + "bedrooms",
        data[0].listingId.beds + " " + "beds",
        data[0].listingId.bathrooms + " " + "bathrooms",
      ],
    ];

    var allAmenities = data[0].listingId.amenities.concat(
      data[0].listingId.additionalAmenities
    );

    const sliceAmenities = () => {
      setShowAll(true);
    };

    let paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: new Date(),
          items: [
            {
              name: data[0].listingId.title,
              description: data[0].listingId.description,
              quantity: "1",
              unit_amount: {
                currency_code: data[0].currency,
                value: totalAmount.toFixed(1),
              },
            },
          ],
          amount: {
            currency_code: data[0].currency,
            value: totalAmount.toFixed(1),
            breakdown: {
              item_total: {
                currency_code: data[0].currency,
                value: totalAmount.toFixed(1),
              },
            },
          },
        },
      ],
      application_context: {
        return_url: "https://example.com/return",
        cancel_url: "https://example.com/cancel",
      },
    };

    const payViaPlatform = async () => {
      let intent = {
        amount: Number(totalAmount.toFixed(1)),
      };
      try {
        setLoading(true);
        let checkData = {
          checkinDate: data[0].checkinDate,
          checkoutDate: data[0].checkoutDate,
          listingId: data[0].listingId.id,
        };
        await PostAPIs.checkAvailability(checkData);
        const { client_secret } = await PostAPIs.createPaymentIntent(intent);
        const { paymentIntent } = await platformPay(client_secret);
        let formdata = {
          amount: totalAmount,
          insuranceFees: data[0].insuranceFees,
          checkinDate: data[0].checkinDate,
          checkoutDate: data[0].checkoutDate,
          transactionId: paymentIntent.id,
          paymentMethodType: selectedPaymentMethodType,
          listingId: data[0].listingId.id,
          bookingId: data[0].reservation.bookingId,
        };
        await PostAPIs.confirmBooking(formdata)
          .then((response) => {
            dispatch(GetBookingsList());
            dispatch(GetFeedList());
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: BOTTOM_STACK,
                    state: {
                      routes: [
                        {
                          name: FEED_STACK,
                          state: {
                            routes: [
                              {
                                name: "StayBooked",
                                params: {
                                  image: placeImages[0].uri,
                                  data: response.data,
                                  status: true,
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              })
            );
            setLoading(false);
          })
          .catch((e) => {
            Alert.alert(e.message[0]), setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const platformPay = async (client_secret) => {
      return new Promise(async (resolve, reject) => {
        const payment = await confirmPlatformPayPayment(client_secret, {
          applePay: {
            cartItems: [
              {
                label: data[0].listingId.title,
                amount: String(totalAmount.toFixed(2)),
                paymentType: PlatformPay.PaymentType.Immediate,
              },
              {
                label: "Total",
                amount: String(totalAmount.toFixed(2)),
                paymentType: PlatformPay.PaymentType.Immediate,
              },
            ],
            merchantCountryCode: currencyType.countryCode,
            currencyCode: data[0].listingId.currency,
          },
          googlePay: {
            amount: totalAmount,
            currencyCode: data[0].listingId.currency,
            testEnv: true,
            merchantName: "Test",
            merchantCountryCode: currencyType.countryCode,
          },
        });
        const error = payment.error;
        if (error) {
          console.log("error in if", error);
          reject(error);
        }
        resolve(payment);
      });
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
            <FastImage
              style={{ height: 24, width: 24 }}
              source={{ uri: uri }}
            />
            <Text style={[styles.houseText, { fontSize: 14 }]}>{name}</Text>
          </View>
        );
      });
    };

    const payWithPaypal = async (res) => {
      let formdata = {
        amount: totalAmount,
        insuranceFees: data[0].insuranceFees,
        checkinDate: data[0].checkinDate,
        checkoutDate: data[0].checkoutDate,
        transactionId: res.id,
        paymentMethodType: selectedPaymentMethodType,
        listingId: data[0].listingId.id,
        bookingId: data[0].id,
      };
      console.log(formdata);
      try {
        const response = await PostAPIs.confirmBooking(formdata);
        console.log(response);

        dispatch(GetBookingsList());
        dispatch(GetFeedList());
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: BOTTOM_STACK,
                state: {
                  routes: [
                    {
                      name: FEED_STACK,
                      state: {
                        routes: [
                          {
                            name: "StayBooked",
                            params: {
                              image: placeImages[0].uri,
                              data: response.data,
                              status: true,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          })
        );
      } catch (error) {
        console.log(error);
        if (error.message === "Internal server error") {
          // Alert.alert(error.message);
        } else {
          // Alert.alert(error.message[0]);
        }
      }
    };
    const showCancelPopUp = (status) => {
      Alert.alert(
        "Cercles",
        `Are you sure you want to cancel this booking request?`,
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

    const updateReservationStatus = async (gotData) => {
      let formdata = {
        id: data[0].reservation.id,
        status: gotData,
      };
      try {
        setLoading(true);
        const res = await PostAPIs.updatedReservations(formdata);
        console.log(res);
        dispatch(GetBookingsList());
        dispatch(GetFeedList());
        Alert.alert("Cercles", "Your request has been cancelled");
        navigation.goBack();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (error?.response?.data) {
          Alert.alert(error?.response?.data?.message[0]);
        } else {
          Alert.alert("Something went wrong!");
        }
      }
    };

    const payViaStripe = () => {
      let formdata = {
        amount: totalAmount,
        insuranceFees: data[0].insuranceFees,
        checkinDate: data[0].checkinDate,
        checkoutDate: data[0].checkoutDate,
        transactionId: "",
        paymentMethodType: "stripe",
        listingId: data[0].listingId.id,
        bookingId: data[0].id,
        paymentmethodid: selectedCard,
      };

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: BOTTOM_STACK,
              state: {
                routes: [
                  {
                    name: FEED_STACK,
                    state: {
                      routes: [
                        {
                          name: "PaymentLoading",
                          params: {
                            formdata,
                            image: placeImages[0].uri,
                            manual: true,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        })
      );
    };
    const handleCardSelection = (id) => {
      setSelectedCard(id);
      setSelectedPaymentMethodType(null);
      setCardId(id);
    };

    const handlePaymentMethodSelection = (method) => {
      setSelectedPaymentMethodType(method);
      setSelectedCard(null);
    };

    const bottomCardVisibility = () => {
      setBottomCard(!bottomCard);
      dispatch(FormVisibilty(false));
    };

    const stripePaymentFunction = async () => {
      if (!paymentFormVisibility) {
        dispatch(FormVisibilty(true));
        return;
      }
      try {
        if (fullName.length === 0) {
          Alert.alert("Please enter your full name");
          return;
        }
        if (!validDetails) {
          Alert.alert("Please enter valid card details");
          return;
        }
        if (country.length == 0) {
          Alert.alert("Please enter your country");
          return;
        }
        setLoading(true);
        const cardToken = await createToken({
          type: "Card",
          name: fullName,
        });
        if (!cardToken?.error) {
          let formData = {
            paymentMethodType: "stripe",
            zipCode: zipcode,
            country: country.country,
            token: cardToken.token.id,
            name: cardToken.token.card.name,
          };
          try {
            await PostAPIs.addPaymentMethod(formData);
            Alert.alert("Payment method added!");
            setLoading(false);
            setBottomCard(false);
            dispatch(GetPaymentMethods());
            dispatch(FormVisibilty(false));
          } catch (error) {
            console.log(error.response.data.message[0]);
            setLoading(false);
            Alert.alert(error.response.data.message[0]);
          }
        } else {
          setLoading(false);
          Alert.alert(cardToken.error.message);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    const getCardDetails = (data) => {
      const { complete, postalCode } = data;
      setZipcode(postalCode);
      setValidDetails(complete);
    };

    return (
      <View style={styles.container}>
        <SpinnerOverlay loaderState={loading} textContent={"Loading..."} />
        <ScrollView contentContainerStyle={{ paddingBottom: "5%" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          >
            <SvgXml xml={images.backArrow()} />
          </TouchableOpacity>
          <View style={styles.imageSliderView}>
            <Slider
              height={350}
              images={
                placeImages.length !== 0 ? placeImages : [{ uri: STOCK_PHOTO }]
              }
            />
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
                {data[0].listingId.guests + " guests"}
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
                  {priceFormat(currencyPrice + guestFees)} x {diffInDays}{" "}
                  {diffInDays > 1 ? "nights" : "night"}
                </Typography.ChileLine>
                <View style={styles.priceView}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={500}
                  >
                    {currencyType.symbol}
                    {priceFormat((currencyPrice + guestFees) * diffInDays)}
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
                    {priceFormat(data[0].insuranceFees)}
                  </Typography.ChileLine>
                </View>
              </View>
              {data[0]?.promotion ? (
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
                        priceFormat(data[0].promotion || 0)}
                    </Typography.ChileLine>
                  </View>
                </View>
              ) : (
                <></>
              )}
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
          <HomeDetails
            selection={data[0].listingId.selection}
            firstName={data[0].listingId.userId.firstName}
            type={data[0].listingId.type}
            personalImgs={data[0].listingId.userId.personalImgs}
            amenities={mergedArray}
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: data[0].listingId.userId,
              })
            }
          />
          {/* <EmptyCard>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(OTHER_USER_PROFILE, {
                  userId: data[0].listingId.userId,
                })
              }
              style={styles.userDesCard}
            >
              <View style={styles.textStyle}>
                <Typography.H color={colors.darkBlue} fontsize={18}>
                  {placeType}, hosted by {data[0].listingId.userId.firstName}
                </Typography.H>
              </View>
              <FastImage
                style={styles.userImg}
                source={{
                  uri:
                    data[0].listingId.userId.personalImgs.length > 0
                      ? data[0].listingId.userId.personalImgs[0].uri
                      : STOCK_PHOTO,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(OTHER_USER_PROFILE, {
                  userId: data[0].listingId.userId,
                })
              }
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              {featuresText(mergedArray)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(OTHER_USER_PROFILE, {
                  userId: data[0].listingId.userId,
                })
              }
              style={styles.horizontalLine}
            />
            <Seperator />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(OTHER_USER_PROFILE, {
                  userId: data[0].listingId.userId,
                })
              }
              style={styles.propertyType}
            >
              <SvgXml
                style={{ alignSelf: "center" }}
                width={24}
                height={24}
                xml={
                  data[0].listingId.selection === "Entire"
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
                  {data[0].listingId.selection === "Entire"
                    ? "you will have the whole place to yourself"
                    : "You will have your own room but there may be other people in other rooms"}
                </Text>
              </View>
            </TouchableOpacity>
            <Seperator seperate={10} />
          </EmptyCard> */}
          <View style={styles.saparator} />

          {data[0].listingId.description && (
            <>
              <AboutHome description={data[0].listingId.description} />
              <View style={styles.saparator} />
              {/* <EmptyCard>
                <View style={styles.apartmentDes}>
                  <Typography.H color={colors.darkBlue} fontsize={16}>
                    About apartment
                  </Typography.H>
                  <Text style={styles.houseText}>
                    {data[0].listingId.description}
                  </Text>
                </View>
              </EmptyCard>
              <View style={styles.saparator} /> */}
            </>
          )}
          <ApartmentMapLocation
            latitude={data[0]?.listingId?.latitude}
            longitude={data[0]?.listingId?.longitude}
            address={location}
          />
          {/* <EmptyCard>
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
              <Marker
                coordinate={{
                  latitude: data[0].listingId.latitude,
                  longitude: data[0].listingId.longitude,
                }}
              ></Marker>
            </MapView>
            <View style={styles.apartmentDes}>
              <Typography.H color={colors.darkBlue} fontsize={16}>
                {location}
              </Typography.H>
              <Text style={styles.houseText}>
                Located at {data[0].listingId.city}
              </Text>
            </View>
          </EmptyCard> */}
          {allAmenities.length !== 0 && (
            <>
              <View style={styles.saparator} />
              <PlaceOffersAmenities allAmenities={allAmenities} />
            </>
          )}

          {/* <EmptyCard>
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
            </View>
          </EmptyCard> */}
          {/* {data[0]?.listingId?.houseRules && (
          
            <>
              <View style={styles.saparator} />
              <EmptyCard>
                <TouchableOpacity
                  onPress={() => {
                    dispatch({
                      type: INFO_FOR_GUESTS,
                      payload: {
                        wifiName:
                          data[0].listingId.wifiName !== "null"
                            ? data[0].listingId.wifiName
                            : "",
                        wifiPassword:
                          data[0].listingId.wifiPassword !== "null"
                            ? data[0].listingId.wifiPassword
                            : "",
                        checkinInfo:
                          data[0].listingId.checkinInfo !== "null"
                            ? data[0].listingId.checkinInfo
                            : "",
                        houseRules:
                          data[0].listingId.houseRules !== "null"
                            ? data[0].listingId.houseRules
                            : "",
                        houseManual:
                          data[0].listingId.houseManual !== "null"
                            ? data[0].listingId.houseManual
                            : "",
                      },
                    });
                    navigation.navigate("InfoForGuestView");
                  }}
                  style={[
                    styles.apartmentDes,
                    {
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                >
                  <View>
                    <Typography.ChileLine
                      color={colors.darkBlue}
                      fontweight={500}
                      fontsize={16}
                    >
                      House rules
                    </Typography.ChileLine>
                    {houseRules && (
                      <>
                        <Seperator />
                        <Text style={styles.houseText}>
                          {data[0].listingId.houseRules}
                        </Text>
                      </>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.darkgray,
                      padding: 10,
                      borderRadius: 30,
                    }}
                  >
                    <SvgXml xml={images.RightArrow(colors.black)} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </EmptyCard>
            </>
          )} */}
          {(data[0]?.listingId?.houseRules ||
            data[0]?.listingId?.wifiName ||
            data[0]?.listingId?.wifiPassword ||
            data[0]?.listingId?.checkinInfo ||
            data[0]?.listingId?.houseManual) && (
            <>
              <Seperator />
              <EmptyCard>
                <TouchableWithoutFeedback
                  onPress={() => {
                    dispatch({
                      type: INFO_FOR_GUESTS,
                      payload: {
                        wifiName:
                          data[0].listingId?.wifiName !== "null"
                            ? data[0].listingId?.wifiName
                            : "",
                        wifiPassword:
                          data[0].listingId?.wifiPassword !== "null"
                            ? data[0].listingId?.wifiPassword
                            : "",
                        checkinInfo:
                          data[0].listingId?.checkinInfo !== "null"
                            ? data[0].listingId?.checkinInfo
                            : "",
                        houseRules:
                          data[0].listingId?.houseRules !== "null"
                            ? data[0].listingId?.houseRules
                            : "",
                        houseManual:
                          data[0].listingId?.houseManual !== "null"
                            ? data[0].listingId?.houseManual
                            : "",
                      },
                    });
                    navigation.navigate("InfoForGuestView");
                  }}
                >
                  <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
                    <Button.CircularBtnIcon
                      onPress={() => {
                        dispatch({
                          type: INFO_FOR_GUESTS,
                          payload: {
                            wifiName:
                              data[0].listingId?.wifiName !== "null"
                                ? data[0].listingId?.wifiName
                                : "",
                            wifiPassword:
                              data[0].listingId?.wifiPassword !== "null"
                                ? data[0].listingId?.wifiPassword
                                : "",
                            checkinInfo:
                              data[0].listingId?.checkinInfo !== "null"
                                ? data[0].listingId?.checkinInfo
                                : "",
                            houseRules:
                              data[0].listingId?.houseRules !== "null"
                                ? data[0].listingId?.houseRules
                                : "",
                            houseManual:
                              data[0].listingId?.houseManual !== "null"
                                ? data[0].listingId?.houseManual
                                : "",
                          },
                        });
                        navigation.navigate("InfoForGuestView");
                      }}
                      iconStatus
                      icon={images.InfoIcon(colors.primary)}
                      label={"Info for guests"}
                      rightArrowIconStatus
                      fontize={18}
                      fontWeight={"bold"}
                    />
                    <View style={{ width: "90%" }}>
                      <Typography.HH>
                        This includes Check-in instructions, Wifi details, House
                        Manual, and House Rules
                      </Typography.HH>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </EmptyCard>
            </>
          )}
          <Seperator />
          {data[0].reservation.status === "accepted" && (
            <EmptyCard>
              <View style={styles.addPaymentView}>
                <View style={styles.wantToPayView}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={16}
                    fontweight={700}
                  >
                    How do you want to pay?
                  </Typography.ChileLine>
                </View>
                {paymentMethodData.map((item) => {
                  const isSelected = selectedCard === item.paymentMethodId;
                  return (
                    <>
                      <Button.CircularSelectionBtnIcon
                        iconHeight={40}
                        iconWidth={40}
                        onPress={() =>
                          handleCardSelection(item.paymentMethodId)
                        }
                        iconStatus
                        icon={images.CreditCardIcon(colors.primary)}
                        label={`**** ${item.paymentMethodDetails.card.last4}`}
                        iconStatus2
                        selected={isSelected}
                      />
                      <View style={styles.horizontalLine} />
                    </>
                  );
                })}
                <>
                  <Button.CircularSelectionBtnIcon
                    iconHeight={40}
                    iconWidth={40}
                    onPress={() => handlePaymentMethodSelection("paypal")}
                    iconStatus
                    icon={images.PaypalIcon(colors.primary)}
                    label={"Paypal"}
                    iconStatus2
                    selected={selectedPaymentMethodType === "paypal"}
                  />
                  <View style={styles.horizontalLine} />
                </>
                {platformPaySupport ? (
                  Platform.OS == "android" ? (
                    <>
                      <Button.CircularSelectionBtnIcon
                        iconHeight={40}
                        iconWidth={40}
                        onPress={() =>
                          handlePaymentMethodSelection("google-pay")
                        }
                        iconStatus
                        icon={images.GoogleIcon(colors.primary)}
                        label={"Google Pay"}
                        iconStatus2
                        selected={selectedPaymentMethodType === "google-pay"}
                      />
                      <View style={styles.horizontalLine} />
                    </>
                  ) : (
                    <>
                      <Button.CircularSelectionBtnIcon
                        iconHeight={40}
                        iconWidth={40}
                        onPress={() =>
                          handlePaymentMethodSelection("apple-pay")
                        }
                        iconStatus
                        icon={images.AppleIcon(colors.primary)}
                        label={"Apple Pay"}
                        iconStatus2
                        selected={selectedPaymentMethodType === "apple-pay"}
                      />
                      <View style={styles.horizontalLine} />
                    </>
                  )
                ) : (
                  <></>
                )}
                <Seperator seperate={10} />
                <Button.BtnContain
                  label="Add payment method"
                  color={colors.darkBlue}
                  labelcolor="white"
                  onPress={bottomCardVisibility}
                />
              </View>
            </EmptyCard>
          )}
          {data[0].reservation ? (
            data[0].reservation.status === "pending" ? (
              <BookingRequestBanner title="Booking request sent" />
            ) : data[0].reservation.status === "accepted" ? (
              <BookingRequestBanner title="Booking request approved" />
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          <Seperator seperate={10} />
          {data[0].reservation && (
            <View style={styles.confirmButtons}>
              <Button.CircularSmallButton
                disabled={loading}
                backgroundColor={colors.white}
                title={
                  data[0].reservation.status === "accepted" ? "Cancel" : "Back"
                }
                textColor={colors.black}
                onPress={() => {
                  data[0].reservation.status === "accepted"
                    ? showCancelPopUp("cancelled")
                    : navigation.goBack();
                }}
              />
              {data[0].reservation.status === "accepted" ? (
                selectedPaymentMethodType === "paypal" ? (
                  <PaypalWeb
                    bookingDetails={{
                      checkinDate: data[0].checkinDate,
                      checkoutDate: data[0].checkoutDate,
                      listingId: data[0].listingId.id,
                    }}
                    order={paypalOrder}
                    isValidated={true}
                    onCancel={(res) => {
                      console.log(res);
                    }}
                    onSuccess={(res) => payWithPaypal(res)}
                    onError={(res) => {
                      Alert.alert(res);
                    }}
                    renderButton={() => (
                      <Button.CircularSmallButton
                        backgroundColor={colors.primary}
                        title={"Confirm and pay"}
                        textColor={colors.white}
                        disabled
                      />
                    )}
                  />
                ) : selectedPaymentMethodType === "apple-pay" ||
                  selectedPaymentMethodType === "google-pay" ? (
                  <Button.CircularSmallButton
                    disabled={loading}
                    backgroundColor={colors.primary}
                    title={"Confirm and pay"}
                    textColor={colors.white}
                    onPress={() => payViaPlatform(selectedPaymentMethodType)}
                  />
                ) : (
                  <Button.CircularSmallButton
                    disabled={loading}
                    backgroundColor={colors.primary}
                    title={"Confirm and pay"}
                    textColor={colors.white}
                    onPress={() => payViaStripe(selectedPaymentMethodType)}
                  />
                )
              ) : (
                <Button.CircularSmallButton
                  disabled={loading}
                  backgroundColor={colors.primary}
                  title={"Cancel Booking\nRequest"}
                  textColor={colors.white}
                  onPress={() => showCancelPopUp("cancelled")}
                />
              )}
            </View>
          )}
        </ScrollView>
        <BottomCard
          buttonType={"options"}
          children={
            <>
              {paymentFormVisibility ? (
                <>
                  <CreditCardForm
                    fullNameHandler={setFullName}
                    fullName={fullName}
                    cardNumberHandler={setCardNumber}
                    cardNumberValue={cardNumber}
                    expiryDateHandler={setExpirationDate}
                    expiryDateValue={expirationDate}
                    cvvHandler={setCVV}
                    cvvValue={cvv}
                    zipcodeHandler={setZipcode}
                    zipcodeValue={zipcode}
                    cardDetails={getCardDetails}
                  />
                </>
              ) : (
                <View style={styles.bottomCardContainer}>
                  <Button.CircularBtnIcon
                    rightArrowIconStatus
                    iconHeight={40}
                    iconWidth={40}
                    onPress={() => dispatch(FormVisibilty(true))}
                    iconStatus
                    icon={images.CreditCardIcon(colors.primary)}
                    label={"Credit Card / Debit Card"}
                  />
                  <View style={styles.horizontalLine} />
                </View>
              )}
            </>
          }
          visibleStatus={bottomCard}
          headingText1={
            paymentFormVisibility ? "Add card details" : "Add payment method"
          }
          navigation={stripePaymentFunction}
          backNavigation={bottomCardVisibility}
          confirmTitle={"Confirm"}
          cancelTitle={"Cancel"}
        />
      </View>
    );
  } else {
    return (
      <>
        <BackButton
          onPress={() => navigation.goBack()}
          Text={"Pending Booking"}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </>
    );
  }
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
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
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
  addPaymentView: {
    marginTop: 40,
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  wantToPayView: {
    marginLeft: 5,
  },
  horizontalLine: {
    width: "95%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    marginTop: 5,
    alignSelf: "center",
  },
});

export default PendingBooking;
