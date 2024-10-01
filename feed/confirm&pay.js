import {
  PlatformPay,
  confirmPlatformPayPayment,
  isPlatformPaySupported,
  useStripe,
} from "@stripe/stripe-react-native";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import PostAPIs from "../../api/post_api";
import images from "../../assets";
import * as Button from "../../components/Button";
import { CircularBtnIcon } from "../../components/Button";
import { paypalCurrencyList } from "../../components/Currencies/PaypalCurrencies";
import currencyList from "../../../Currencies.json";
import PaypalWeb from "../../components/Payments/PaypalWeb";
import ProfilePhotoName from "../../components/ProfilePhotoName";
import Seperator from "../../components/Seperator";
import BackButton from "../../components/backButton";
import BottomCard from "../../components/bottomCard";
import CalendarView from "../../components/calendarView";
import CreditCardForm from "../../components/forms/CreditCardForm";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import NetInfo from "@react-native-community/netinfo";
import {
  AddPaymentMethods,
  FormVisibilty,
  GetPaymentMethods,
} from "../../redux/Actions/AccountActions";
import { GetBookingsList } from "../../redux/Actions/BookingsAction";
import SpinnerOverlay from "../../components/spinner";
import { STOCK_PHOTO } from "../../helpers/Constants";
import PopOverModal from "../../components/PopOverModal";
import FastImage from "react-native-fast-image";
import getAvailableDates from "../../utils/getAvailableDates";
import { GetFeedList } from "../../redux/Actions/FeedActions";
import getUpcomingDateRange from "../../utils/getUpcomingDateRange";
import { storage } from "../../components/asyncStorageToken";
import findMaxDate from "../../utils/findMaxDate";
import obtainDateRanges from "../../utils/obtainDateRanges";
import checkDateContainment from "../../utils/checkDateContainment";
import priceFormat from "../../utils/priceFormat";
import calculatePromotionWithCap from "../../utils/calculatePromotionWithCap";

const ConfrimAndPay = ({ navigation, route }) => {
  const summary = route.params.summary;
  const type = route.params.type;
  const { dateSelect } = route.params;
  const touchable = useRef();
  const [showPop, setShowPop] = useState(false);
  const [dates, setDates] = useState("");
  const [validDetails, setValidDetails] = useState(false);

  const startDate = new Date(summary.availabilityDateRanges[0].start);
  const endDate = new Date(summary.availabilityDateRanges[0].end);
  const [placeImages, setPlaceImages] = useState(summary.images || []);
  const [currencyCode, setCurrencyCode] = useState("");
  const { feedList } = useSelector((state) => state.FeedReducer);
  const [bottomPopUpStatus, setBottomPopUpStatus] = useState(false);
  const dispatch = useDispatch();
  const { paymentMethodData, paymentFormVisibility } = useSelector(
    (state) => state.AccountReducer
  );
  const { country } = useSelector((state) => state.AccountReducer);
  const [bottomCard, setBottomCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [openCalender, setOpenCalender] = useState(false);
  const [day, setDay] = useState("");
  const [end, setEnd] = useState({});
  const [start, setStart] = useState({});
  const [period, setPeriod] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateSelected, setDateSelected] = useState([]);
  const [dateDifference, setDateDifference] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [isPaypalSupported, setIsPaypalSupported] = useState(false);
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [bookDisabled, setBookDisabled] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [pricing, setPricing] = useState(0);
  const [platformPaySupport, setPlatformPaySupport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [insuranceFees, setInsuranceFees] = useState(0);
  const [promotion, setPromotion] = useState(0);
  const { createToken } = useStripe();

  const [dateRanges, setDateRanges] = useState({});
  const [maxEnd, setMaxEnd] = useState("");
  const [minStart, setMinStart] = useState("");

  let dateArrLength = selectedDates.length > 1;

  useEffect(() => {
    setSelectedDates(dateSelect.selectedDates);
    setDateSelected(dateSelect.dateSelected);
    setDateDifference(dateSelect.dateDifference);
    setPeriod(dateSelect.period);
    setDateRanges(dateSelect.dateRanges);
    setMaxEnd(dateSelect.endDate);
    setMinStart(dateSelect.startDate);
  }, [dateSelect]);

  useEffect(() => {
    let positionedPhotos = summary.images.sort(
      (a, b) => a.position - b.position
    );

    setPlaceImages(positionedPhotos);
  }, [feedList]);

  useEffect(() => {
    const nextDateRange = getUpcomingDateRange(summary);
    setDates(nextDateRange);
    setMinStart(nextDateRange?.start);
  }, [summary.availabilityDateRanges]);

  useEffect(() => {
    const newPricing =
      (summary.price + summary.guestFees) *
        (dateArrLength ? dateDifference : 0) +
      (insuranceFees || 0);
    setPricing(newPricing - (summary.promotion * dateDifference || 0));
  }, [
    summary.price,
    summary.guestFees,
    dateArrLength,
    dateDifference,
    insuranceFees,
  ]);

  const handlePaymentMethodSelection = (method) => {
    setSelectedPaymentMethod(method);
    setSelectedCard(null);
  };

  useMemo(async () => {
    let currencyType = currencyList.find(
      (res) => res.currencyCode === summary.currency
    );
    if (currencyType) {
      setCurrencyCode(currencyType.symbol);
      setCurrencyDetails(currencyType);
    }

    let paypalSupport = paypalCurrencyList.find(
      (res) => res.currencyCode === summary.currency
    );
    setIsPaypalSupported(!!paypalSupport);

    let defaultPaymentMethod = paymentMethodData.filter((res) => res.isDefault);

    if (defaultPaymentMethod.length > 0) {
      setSelectedCard(defaultPaymentMethod[0]?.paymentMethodId);
    }
    const support = await isPlatformPaySupported();

    setPlatformPaySupport(support);
  }, [feedList]);

  useMemo(async () => {
    if (pricing !== 0) {
      setBookDisabled(true);
      setCalculating(true);
      let formdata = {
        checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
        checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
        amount: summary.price * dateDifference,
      };
      console.log(formdata);
      try {
        const res = await PostAPIs.calculateInsurance(formdata);
        console.log(res);
        setInsuranceFees(res.data);
        setBookDisabled(false);
        setCalculating(false);
      } catch (error) {
        setBookDisabled(false);
        setCalculating(false);
        console.log(error);
      }
    }
  }, [pricing]);

  useMemo(async () => {
    if (pricing !== 0) {
      let formdata = {
        fromCurrency: summary.currency,
        toCurrency: "USD",
        amount: Number(priceFormat(pricing)),
      };
      console.log(formdata);
      try {
        const res = await PostAPIs.convertCurrency(formdata);
        // console.log(res);
        setConvertedAmount(res.data.connvertedAmount);
      } catch (error) {
        console.log(error?.response?.data);
      }
    }
  }, [pricing]);

  useMemo(async () => {
    if (pricing) {
      const getPromoAmount = calculatePromotionWithCap({
        diff: dateDifference,
        cap: summary.guestPromotionMaxCap,
        promotion: summary.promotion,
      });
      setPromotion(getPromoAmount);
    }
  }, [pricing]);

  let paypalOrder = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: new Date(),
        items: [
          {
            name: summary.title,
            description: "Booking amount",
            quantity: "1",
            unit_amount: {
              currency_code: isPaypalSupported ? summary.currency : "USD",
              value: isPaypalSupported
                ? pricing.toFixed(2)
                : convertedAmount.toFixed(2),
            },
          },
        ],
        amount: {
          currency_code: isPaypalSupported ? summary.currency : "USD",
          value: isPaypalSupported
            ? pricing.toFixed(2)
            : convertedAmount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: isPaypalSupported ? summary.currency : "USD",
              value: isPaypalSupported
                ? pricing.toFixed(2)
                : convertedAmount.toFixed(2),
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

  const platformPay = async (client_secret) => {
    return new Promise(async (resolve, reject) => {
      const payment = await confirmPlatformPayPayment(client_secret, {
        applePay: {
          cartItems: [
            {
              label: summary.title,
              amount: String(priceFormat(pricing)),
              paymentType: PlatformPay.PaymentType.Immediate,
            },
            {
              label: "Total",
              amount: String(priceFormat(pricing)),
              paymentType: PlatformPay.PaymentType.Immediate,
            },
          ],
          merchantCountryCode: currencyDetails.countryCode,
          currencyCode: summary.currency,
        },
        googlePay: {
          amount: priceFormat(pricing),
          currencyCode: summary.currency,
          testEnv: false,
          merchantName: "Test",
          merchantCountryCode: currencyDetails.countryCode,
        },
      });
      const error = payment.error;
      if (error) {
        reject(error);
      }
      resolve(payment);
    });
  };

  const handleCardSelection = (id) => {
    setSelectedCard(id);
    setSelectedPaymentMethod(null);
    setCardId(id);
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
          setBottomCard(false);
          dispatch(GetPaymentMethods());
          dispatch(FormVisibilty(false));
          setLoading(false);
        } catch (error) {
          console.log(error.response.data.message[0]);
          setLoading(false);
          Alert.alert(error.response.data.message[0]);
        }
      } else {
        Alert.alert(cardToken.error.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getCardDetails = (data) => {
    const {
      brand,
      complete,
      expiryMonth,
      expiryYear,
      last4,
      postalCode,
      validCVC,
      validExpiryDate,
      validNumber,
    } = data;
    setZipcode(postalCode);
    setValidDetails(complete);
  };

  const Book = async () => {
    if (!dateDifference) {
      Alert.alert("Please select a date/dates");
    } else if (selectedCard === null && selectedPaymentMethod === null) {
      Alert.alert("Please select a payment method or card");
    } else {
      setBookDisabled(true);
      if (selectedCard) {
        let formdata = {
          amount: summary.price * dateDifference,
          guestFees: summary.guestFees,
          insuranceFees: insuranceFees || 0,
          checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
          checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
          paymentMethodType: "stripe",
          paymentMethodId: selectedCard,
          listingId: summary.id,
          transactionId: "",
          promotionApplied: promotion,
        };
        console.log(formdata);
        const state = await NetInfo.fetch();
        if (state.isConnected) {
          navigation.navigate("PaymentLoading", {
            formdata,
            image: placeImages[0].uri,
          });
          setBookDisabled(false);
        } else {
          setBookDisabled(false);
          Alert.alert("Please check your internet connection");
        }
      } else {
        try {
          let checkData = {
            checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
            checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
            listingId: summary.id,
          };
          await PostAPIs.checkAvailability(checkData);

          const state = await NetInfo.fetch();
          let intent = {
            amount: Number(pricing.toFixed(1)),
          };
          if (state.isConnected) {
            const { client_secret } = await PostAPIs.createPaymentIntent(
              intent
            );
            const { paymentIntent } = await platformPay(client_secret);
            let formdata = {
              amount: summary.price * dateDifference,
              guestFees: summary.guestFees || 0,
              insuranceFees: insuranceFees || 0,
              checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
              checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
              transactionId: paymentIntent.id,
              paymentMethodType: selectedPaymentMethod,
              listingId: summary.id,
              promotionApplied: promotion,
            };
            await PostAPIs.bookHotel(formdata)
              .then((response) => {
                console.log(response);
                dispatch(GetBookingsList());
                dispatch(GetFeedList());
                navigation.navigate("StayBooked", {
                  image: placeImages[0].uri,
                  data: response.data,
                });
                setBookDisabled(false);
                setLoading(false);
              })
              .catch((e) => {
                console.log(e);
                // Alert.alert(e);
                setLoading(false);
                setBookDisabled(false);
              });
          } else {
            Alert.alert("Please check your internet connection");
          }
        } catch (e) {
          setBookDisabled(false);
          setLoading(false);
          console.log(e);
          if (e?.response?.data) {
            console.log(e?.response?.data);
            Alert.alert(e?.response?.data?.message[0]);
          }
        }
      }
    }
  };
  const Reserve = async () => {
    if (!dateDifference) {
      Alert.alert("Please select a date/dates");
    } else if (selectedCard === null && selectedPaymentMethod === null) {
      Alert.alert("Please select a payment method");
    } else {
      setBookDisabled(true);
      if (selectedCard) {
        let formdata = {
          amount: summary.price * dateDifference,
          guestFees: summary.guestFees,
          insuranceFees: insuranceFees || 0,
          checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
          checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
          paymentMethodType: "stripe",
          paymentMethodId: cardId,
          listingId: summary.id,
          transactionId: "",
          promotionApplied: promotion,
        };
        const state = await NetInfo.fetch();
        if (state.isConnected) {
          await PostAPIs.bookHotel(formdata)
            .then((response) => {
              console.log(response);
              dispatch(GetBookingsList());
              dispatch(GetFeedList());
              navigation.navigate("RequestSent", {
                image:
                  placeImages.length !== 0 ? placeImages[0].uri : STOCK_PHOTO,
                data: response.data,
              });
              setBookDisabled(false);
              setLoading(false);
            })
            .catch((e) => {
              setBookDisabled(false);
              setLoading(false);
              console.log(e);
              Alert.alert(e);
            });
        } else {
          Alert.alert("Please check your internet connection");
        }
      } else {
        try {
          let formdata = {
            amount: summary.price * dateDifference,
            guestFees: summary.guestFees,
            insuranceFees: insuranceFees || 0,
            checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
            checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
            transactionId: "",
            paymentMethodType: selectedPaymentMethod,
            listingId: summary.id,
            promotionApplied: promotion,
          };
          const state = await NetInfo.fetch();
          if (state.isConnected) {
            await PostAPIs.bookHotel(formdata)
              .then((response) => {
                console.log(response);
                dispatch(GetBookingsList());
                dispatch(GetFeedList());
                navigation.navigate("RequestSent", {
                  image:
                    placeImages.length !== 0 ? placeImages[0].uri : STOCK_PHOTO,
                  data: response.data,
                });
                setBookDisabled(false);
                setLoading(false);
              })
              .catch((e) => {
                Alert.alert(e);
                console.log(e);
                setBookDisabled(false);
                setLoading(false);
              });
          } else {
            Alert.alert("Please check your internet connection");
          }
        } catch (e) {
          setBookDisabled(false);
          setLoading(false);
          console.log(e);
          if (e?.response?.data) {
            console.log(e?.response?.data?.message[0]);
            Alert.alert(e?.response?.data?.message[0]);
          }
        }
      }
    }
  };

  // const createIntent = async () => {
  //   return new Promise((resolve, reject) => {
  //     let intent = {
  //       amount: pricing,
  //     };

  //     PostAPIs.createPaymentIntent(intent, (res) => {
  //       if (!res.status) {
  //         reject(res);
  //       } else if (res.status) {
  //         resolve(res.data);
  //       } else {
  //         reject(res);
  //       }
  //     });
  //   });
  // };

  const HotelBooking = async (formdata) => {
    return new Promise(async (resolve, reject) => {
      await PostAPIs.bookHotel(formdata, (res) => {
        if (!res.status) {
          reject(res);
        } else if (res.status) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  };

  const manipulateCalendar = (d) => {
    if (d.selectedFullDates.length === 1) {
      setInsuranceFees(0);
      setPromotion(0);
      const blockDates = checkDateContainment({
        dates: summary.availabilityDateRanges,
        currentDate: d.selectedFullDates[0],
      });
      const startDate = moment(blockDates[0]?.start).isBefore(moment(), "day")
        ? moment().format("YYYY-MM-DD")
        : blockDates[0]?.start;
      setMinStart(startDate);
      setMaxEnd(blockDates[0]?.end);
    }
    if (d.selectedFullDates.length === 2) {
      const maxEndDate = findMaxDate(summary.availabilityDateRanges);
      const nextDateRange = getUpcomingDateRange(summary);
      setMinStart(nextDateRange?.start);
      setMaxEnd(maxEndDate);
    }
    setDateDifference(d.difference);
    setDateSelected(d.selectedDates);
    setSelectedDates(d.selectedFullDates);
  };

  return (
    <>
      <ScrollView>
        <SpinnerOverlay loaderState={loading} textContent={"Loading..."} />
        <View style={styles.container}>
          <BackButton
            onPress={() => navigation.goBack()}
            Text={type === "Book" ? "Confirm & Pay" : "Request to Book"}
          />
          <View style={styles.cardContainer}>
            <FastImage
              style={styles.image}
              source={{
                uri:
                  placeImages.length !== 0 ? placeImages[0].uri : STOCK_PHOTO,
              }}
              resizeMode="cover"
            />
            <View style={styles.contentContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={700}
              >
                {summary.selection == "Entire"
                  ? `Entire House,\nhosted by ${summary.userId.firstName}`
                  : summary.selection == "Shared"
                  ? `Shared room in house,\nhosted by ${summary.userId.firstName}`
                  : `Private room in house,\nhosted by ${summary.userId.firstName}`}
              </Typography.ChileLine>
            </View>
          </View>
          <View style={styles.saparator} />
          <EmptyCard>
            <TouchableOpacity
              onPress={() => setOpenCalender(!openCalender)}
              style={[
                styles.contentSet,
                {
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 20,
                },
              ]}
            >
              <View>
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
                  {selectedDates.length > 0
                    ? moment(selectedDates[0]).format("DD MMM") +
                      " - " +
                      (dateArrLength
                        ? moment(selectedDates[1]).format("DD MMM")
                        : "Select Date")
                    : "Select Dates"}
                </Typography.ChileLine>
              </View>
              <SvgXml height={25} width={25} xml={images.Edit(colors.black)} />
            </TouchableOpacity>
          </EmptyCard>
          {openCalender && (
            <View style={{ width: "90%", alignSelf: "center" }}>
              <Seperator />
              {/* <CalendarView
                minDate={dates.start}
                maxDate={dates.end}
                onChangePeriod={setPeriod}
                initialDate={moment(
                  summary.availabilityDateRanges[0].start
                ).format("YYYY-MM-DD")}
                periods={period}
                onChangeDate={(d) => {
                  setDateDifference(d.difference);
                  setDateSelected(d.selectedDates);
                  setSelectedDates(d.selectedFullDates);
                }}
              /> */}
              <CalendarView
                minDate={minStart}
                maxDate={maxEnd}
                initialDate={moment(dates.start).format("YYYY-MM-DD")}
                onChangePeriod={setPeriod}
                periods={{ ...dateRanges, ...period }}
                onChangeDate={manipulateCalendar}
              />
            </View>
          )}
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
                  {`${currencyCode}${priceFormat(
                    summary.price + Number(summary.guestFees)
                  )}`}{" "}
                  x {dateArrLength ? dateDifference : 0}{" "}
                  {dateDifference > 1 ? "nights" : "night"}
                </Typography.ChileLine>
                <View style={styles.priceView}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={500}
                  >
                    {currencyCode +
                      priceFormat(
                        (summary.price + Number(summary.guestFees)) *
                          (dateArrLength ? dateDifference : 0)
                      )}
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
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 5,
                  }}
                  onPress={() => setShowPop(!showPop)}
                  ref={touchable}
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
                    {currencyCode + priceFormat(insuranceFees || 0)}
                  </Typography.ChileLine>
                </View>
              </View>
              {summary?.promotion ? (
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
                      -{currencyCode + promotion}
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
                  Total ({summary.currency})
                </Typography.ChileLine>
                <View style={styles.priceView}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={700}
                  >
                    {!calculating && currencyCode}
                    {calculating ? "Calculating..." : priceFormat(pricing)}
                  </Typography.ChileLine>
                </View>
              </View>
            </View>
          </EmptyCard>
          <View style={styles.saparator} />
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
              {/* <Seperator seperate={10} /> */}
              {paymentMethodData.map((item) => {
                const isSelected = selectedCard === item.paymentMethodId;
                return (
                  <>
                    <Button.CircularSelectionBtnIcon
                      iconHeight={40}
                      iconWidth={40}
                      onPress={() => handleCardSelection(item.paymentMethodId)}
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
                  selected={selectedPaymentMethod === "paypal"}
                />
                <View style={styles.horizontalLine} />
              </>
              {platformPaySupport ? (
                Platform.OS == "android" ? (
                  <>
                    <Button.CircularSelectionBtnIcon
                      iconHeight={40}
                      iconWidth={40}
                      onPress={() => handlePaymentMethodSelection("google-pay")}
                      iconStatus
                      icon={images.GoogleIcon(colors.primary)}
                      label={"Google Pay"}
                      iconStatus2
                      selected={selectedPaymentMethod === "google-pay"}
                    />
                    <View style={styles.horizontalLine} />
                  </>
                ) : (
                  <>
                    <Button.CircularSelectionBtnIcon
                      iconHeight={40}
                      iconWidth={40}
                      onPress={() => handlePaymentMethodSelection("apple-pay")}
                      iconStatus
                      icon={images.AppleIcon(colors.primary)}
                      label={"Apple Pay"}
                      iconStatus2
                      selected={selectedPaymentMethod === "apple-pay"}
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
          {/* {type === "Reserve" && (
          <>
            <Seperator />
            <EmptyCard>
              <View style={{ padding: 20, gap: 20 }}>
                <ProfilePhotoName
                  imgUri={
                    summary.userId.personalImgs.length > 0
                      ? summary.userId.personalImgs[0].uri
                      : STOCK_PHOTO
                  }
                  label={`Hosted by ${summary.userId.firstName}`}
                  onPressIcon={null}
                />
                <Typography.ChileLine
                  color={colors.grayText}
                  size={16}
                  fontweight={500}
                >
                  Let the Host know why you’re traveling and when you’ll check
                  in
                </Typography.ChileLine>
                <Button.BtnContain
                  label="Contact host"
                  color={colors.darkBlue}
                  labelcolor="white"
                  onPress={() =>
                    ContactHost(
                      summary.userId.firstName + " " + summary.userId.lastName,
                      summary.userId.id
                    )
                  }
                />
              </View>
            </EmptyCard>
            <Seperator />
            <EmptyCard>
              <View style={{ padding: 20, gap: 20 }}>
                <Typography.BoldHeading>Ground Rules</Typography.BoldHeading>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={16}
                  fontweight={500}
                >
                  We ask every guest to remember a few simple things about what
                  makes a great guest
                </Typography.ChileLine>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={16}
                  fontweight={500}
                >
                  {"\u2022"} Follow the house rules
                </Typography.ChileLine>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={16}
                  fontweight={500}
                >
                  {"\u2022"} Treat your Host’s home like your own
                </Typography.ChileLine>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={16}
                  fontweight={500}
                >
                  {"\u2022"} Follow the house rules
                </Typography.ChileLine>

                <View
                  style={{ flexDirection: "row", paddingRight: 10, gap: 8 }}
                >
                  <SvgXml xml={images.InfoIcon(colors.primary)} />
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "700" }}>
                      Your reservation won’t be confirmed until the host accepts
                      your request.
                    </Text>
                    <Text
                      style={{ fontSize: 12, fontWeight: "500", marginTop: 5 }}
                    >
                      You won’t be charged until then.
                    </Text>
                  </View>
                </View>
              </View>
            </EmptyCard>
          </>
        )} */}
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
                    <CircularBtnIcon
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
            disbleConfirmButton={loading}
            headingText1={
              paymentFormVisibility ? "Add card details" : "Add payment method"
            }
            navigation={stripePaymentFunction}
            backNavigation={bottomCardVisibility}
            confirmTitle={"Confirm"}
            cancelTitle={"Cancel"}
          />
        </View>
      </ScrollView>
      <View style={styles.addPaymentBtn}>
        <Seperator seperate={25} />
        {type === "Book" ? (
          <>
            {selectedPaymentMethod === "paypal" ? (
              <PaypalWeb
                bookingDetails={{
                  checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
                  checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
                  listingId: summary.id,
                }}
                isValidated={dateDifference}
                order={paypalOrder}
                loading={(status) =>
                  Platform.OS === "android" && setLoading(status)
                }
                onCancel={(res) => {
                  console.log(res);
                }}
                onSuccess={async (res) => {
                  let formdata = {
                    amount: summary.price * dateDifference,
                    guestFees: summary.guestFees,
                    insuranceFees: insuranceFees || 0,
                    checkinDate: moment(selectedDates[0]).format("YYYY-MM-DD"),
                    checkoutDate: moment(selectedDates[1]).format("YYYY-MM-DD"),
                    transactionId: res.id,
                    paymentMethodType: selectedPaymentMethod,
                    listingId: summary.id,
                  };
                  try {
                    const data = await PostAPIs.bookHotel(formdata);
                    dispatch(GetBookingsList());
                    dispatch(GetFeedList());
                    navigation.navigate("StayBooked", {
                      image: placeImages[0].uri,
                      data: data.data,
                    });
                  } catch (error) {
                    console.log(error);
                    Alert.alert(error);
                  }
                }}
                onError={(res) => {
                  console.log(res);
                }}
                renderButton={() => (
                  <Button.BtnContain
                    label="Confirm and Pay"
                    color={colors.primary}
                    labelcolor="white"
                    disabled
                    // onPress={Book}
                  />
                )}
              />
            ) : (
              <Button.BtnContain
                disabled={bookDisabled}
                label="Confirm and Pay"
                color={colors.primary}
                labelcolor="white"
                onPress={Book}
              />
            )}
          </>
        ) : (
          <View style={styles.bottomButton}>
            <Button.BtnContain
              disabled={bookDisabled}
              label="Request to Book"
              color={colors.primary}
              labelcolor="white"
              onPress={Reserve}
            />
          </View>
        )}
        <Seperator seperate={10} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addPaymentBtn: {
    width: "90%",
    alignSelf: "center",
  },
  wantToPayView: {
    marginLeft: 5,
  },
  addPaymentView: {
    marginTop: 40,
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  bottomCardContainer: {
    flex: 1,
    alignItems: "center",
  },
  confirmBtnView: {
    width: "90%",
    alignSelf: "center",
    marginTop: 50,
    bottom: 30,
  },
  addPaymentText: {
    alignSelf: "center",
    marginTop: 30,
    bottom: 10,
  },
  bottomCard: {
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.2,
    borderColor: colors.grayText,
  },
  cardContainer: {
    flexDirection: "row",
    borderColor: "gray",
    borderRadius: 12,
    backgroundColor: colors.white,
    width: "90%",
    paddingVertical: 18,
    alignSelf: "center",
  },
  horizontalLine: {
    width: "95%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    marginTop: 5,
    alignSelf: "center",
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
  image: {
    width: 120,
    height: 80,
    alignSelf: "center",
    marginLeft: 20,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  saparator: {
    marginTop: 10,
  },
  bottomButton: {
    position: "absolute",
    width: "100%",
    bottom: "30%",
  },
});

export default ConfrimAndPay;
