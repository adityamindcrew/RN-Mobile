import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  Button,
} from "react-native";
import BackButton from "../../components/backButton";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import images from "../../assets/index";
import colors from "../../config/colors";
import * as Typography from "../../config/Typography";
import {
  BottomButton,
  BtnWhiteOption,
  CircularBtnIcon,
} from "../../components/Button";
import BottomCard from "../../components/bottomCard";
import { useDispatch, useSelector } from "react-redux";
import {
  FormVisibilty,
  GetPaymentMethods,
  MakePaymentMethodDefault,
  RemovePaymentMethod,
} from "../../redux/Actions/AccountActions";
import { AddPaymentMethods } from "../../redux/Actions/AccountActions";
import CreditCardForm from "../../components/forms/CreditCardForm";
import PostAPIs from "../../api/post_api";
import SpinnerOverlay from "../../components/spinner";
import { COUNTRY_NAME } from "../../redux/Type";
import { NATIVE_PAY } from "../../navigation/RouteNames";
import EmptyScreen from "../../components/EmptyScreenMessage";
import SeperatorLine from "../../components/SeperatorLine";
import PaypalLogin from "../../components/Auth/PaypalLogin";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PaymentMethods = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [bottomCard, setBottomCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [cvv, setCVV] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [loader, setLoader] = useState(false);
  const [validDetails, setValidDetails] = useState(false);
  const dispatch = useDispatch();
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("");
  const { createToken } = useStripe();
  const { paymentMethodData, paymentFormVisibility, country } = useSelector(
    (state) => state.AccountReducer
  );

  const bottomCardVisibility = () => {
    setBottomCard(!bottomCard);
    dispatch(FormVisibilty(false));
    clearState();
  };

  const addPayment = async () => {
    const isCardNumberValid = cardNumber.length === 19;
    const isExpirationDateValid = expirationDate.length === 5;
    const isCvvValid = cvv.length === 3;

    if (!isCardNumberValid) {
      Alert.alert("Please enter a valid 16 digit card number");
    } else if (!isExpirationDateValid) {
      Alert.alert("Please enter a valid expiration date");
    } else if (!isCvvValid) {
      Alert.alert("Please enter a valid security code");
    } else if (zipcode === "") {
      Alert.alert("Please enter your zipcode");
    } else if (country.length == 0) {
      Alert.alert("Please enter your country");
    } else {
      const number = cardNumber.replace(/\s/g, "");
      const [cardExpMonth, cardExpYear] = expirationDate.split("/");
      const [firstName, lastName] = fullName.split(" ");
      let formData = {
        cardNumber: number,
        cardExpMonth: Number(cardExpMonth),
        cardExpYear: Number(cardExpYear),
        cardCvc: cvv,
        zipCode: zipcode,
        country: country.country,
        paymentMethodType: "stripe",
        firstName,
        lastName,
      };
      try {
        setLoader(true);
        await PostAPIs.addPaymentMethod(formData);
        Alert.alert("Payment method added!");
        setLoader(false);
        setBottomCard(false);
        dispatch(GetPaymentMethods());
        dispatch(FormVisibilty(false));
        clearState();
      } catch (error) {
        console.log(error.response.data.message[0]);
        setLoader(false);
        Alert.alert(error.response.data.message[0]);
      }
    }
  };

  // const addPaypal = async ({ email, payer_id, name }) => {
  //   let formData = {
  //     paymentMethodId: email,
  //     paymentMethodType: "paypal",
  //   };

  //   try {
  //     setLoader(true);
  //     await PostAPIs.addPaymentMethod(formData);
  //     Alert.alert("Payment method added!");
  //     setLoader(false);
  //     setBottomCard(false);
  //     dispatch(GetPaymentMethods());
  //     dispatch(FormVisibilty(false));
  //     clearState();
  //   } catch (error) {
  //     setLoader(false);
  //     Alert.alert(error.response.data.message[0]);
  //   }
  // };

  const clearState = () => {
    setCardNumber("");
    setExpirationDate("");
    setCVV("");
    setZipcode("");
    dispatch({
      type: COUNTRY_NAME,
      payload: "",
    });
    setFullName("");
  };

  const MakeMethodDefault = async () => {
    let formdata = { paymentMethodId, paymentMethodType };
    dispatch(MakePaymentMethodDefault(formdata));
    setVisible(false);
  };

  const RemoveMethod = async () => {
    Alert.alert(
      "Cercles",
      " Are you sure you want to remove this payment method??",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            let formdata = { paymentMethodId, paymentMethodType };
            dispatch(RemovePaymentMethod(formdata));
            setVisible(false);
          },
        },
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
      ]
    );
  };

  const stripePaymentFunction = async () => {
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
      setLoader(true);
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
          setLoader(false);
          setBottomCard(false);
          dispatch(GetPaymentMethods());
          dispatch(FormVisibilty(false));
          clearState();
        } catch (error) {
          console.log(error.response.data.message[0]);
          setLoader(false);
          Alert.alert(error.response.data.message[0]);
        }
      } else {
        setLoader(false);
        Alert.alert(cardToken.error.message);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
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

  const renderCardList = ({ item }) => {
    const cardDetails = item?.paymentMethodDetails?.card;
    const heading =
      item.paymentMethodType === "stripe"
        ? `${cardDetails.brand.toUpperCase()} ${cardDetails.last4}`
        : "Paypal";

    const description =
      item.paymentMethodType === "stripe"
        ? `Expires ${
            cardDetails.exp_month < 10
              ? "0" + cardDetails.exp_month
              : cardDetails.exp_month
          }/${cardDetails.exp_year}`
        : item.paymentMethodId;

    return (
      <>
        {item.paymentMethodType === "stripe" ? (
          <BtnWhiteOption
            defaultStatus={item.isDefault}
            icon1={images.CreditCardIcon(colors.primary)}
            icon1Height={40}
            icon1Width={40}
            heading={heading}
            description={description}
            iconStatus2
            icon2={images.Edit(colors.black)}
            onPress={() => {
              setPaymentMethodId(item.paymentMethodId);
              setPaymentMethodType("stripe");
              setVisible(true);
            }}
          />
        ) : (
          <BtnWhiteOption
            defaultStatus={item.isDefault}
            icon1={images.PaypalIcon(colors.primary)}
            icon1Height={40}
            icon1Width={40}
            heading={heading}
            description={description}
            iconStatus2
            icon2={images.Edit(colors.black)}
            onPress={() => {
              setPaymentMethodId(item.paymentMethodId);
              setVisible(true);
              setPaymentMethodType("paypal");
            }}
          />
        )}
      </>
    );
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <BackButton
          Text={"Payment methods"}
          onPress={() => navigation.goBack()}
        />
        {paymentMethodData.length == 0 ? (
          <View style={styles.mainContainer}>
            <EmptyScreenMessage
              headingText={"No payment methods yet!"}
              buttonText={"Add payment method"}
              onPressButton={bottomCardVisibility}
              icon1Status
              icon1={images.PaymentBlack()}
            />
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 20,
              gap: 10,
            }}
          >
            <View style={{ alignSelf: "flex-start", marginLeft: -16 }}>
              <Typography.HH>Add and manage your payment methods</Typography.HH>
            </View>
            <View style={{ width: "100%" }}>
              <FlatList
                contentContainerStyle={styles.contentContainerStyle}
                data={paymentMethodData}
                renderItem={renderCardList}
                keyExtractor={(item) => {
                  return item.id;
                }}
              />
            </View>
          </View>
        )}
        <View style={styles.BackButton}>
          <BottomButton
            buttonColor={
              paymentMethodData.length !== 0 ? colors.primary : colors.white
            }
            color={paymentMethodData.length !== 0 ? colors.white : colors.black}
            onPress={() => {
              paymentMethodData.length !== 0
                ? bottomCardVisibility()
                : navigation.goBack();
            }}
            label={
              paymentMethodData.length !== 0 ? "Add payment method" : "Back"
            }
          />
        </View>
        <BottomCard
          buttonType={paymentFormVisibility ? "options" : "single"}
          children={
            <>
              <SpinnerOverlay
                textContent={"Adding payment method..."}
                loaderState={loader}
              />
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
                  {/* <CircularBtnIcon
                  rightArrowIconStatus
                  iconHeight={40}
                  iconWidth={40}
                  // onPress={() => dispatch(FormVisibilty(true))}
                  iconStatus
                  icon={images.PaypalIcon(colors.primary)}
                  label={"Paypal"}
                /> */}
                  {/* <PaypalLogin
                    onSuccess={addPaypal}
                    onError={console.log}
                    renderButton={() => (
                      <CircularBtnIcon
                        rightArrowIconStatus
                        iconHeight={40}
                        iconWidth={40}
                        iconStatus
                        disabled
                        icon={images.PaypalIcon(colors.primary)}
                        label={"Paypal"}
                      />
                    )}
                  /> */}
                  {Platform.OS === "android" ? (
                    <>
                      <CircularBtnIcon
                        rightArrowIconStatus
                        iconHeight={40}
                        iconWidth={40}
                        onPress={() => {
                          setBottomCard(false), navigation.navigate(NATIVE_PAY);
                        }}
                        iconStatus
                        icon={images.GoogleIcon(colors.primary)}
                        label={"Google Pay"}
                      />
                      <View style={styles.horizontalLine} />
                    </>
                  ) : (
                    <>
                      <CircularBtnIcon
                        rightArrowIconStatus
                        iconHeight={40}
                        iconWidth={40}
                        onPress={() => {
                          setBottomCard(false), navigation.navigate(NATIVE_PAY);
                        }}
                        iconStatus
                        icon={images.AppleIcon(colors.primary)}
                        label={"Apple Pay"}
                      />
                      <View style={styles.horizontalLine} />
                    </>
                  )}
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
          singleButtonColor={colors.darkBlue}
          singleButtonTextColor={colors.white}
          singleButtonOnPress={bottomCardVisibility}
          singleButtonLabel={"Back"}
          cancelTitle={"Back"}
        />
        <BottomCard
          singleButtonColor={colors.darkBlue}
          singleButtonTextColor={colors.white}
          singleButtonOnPress={() => setVisible(!visible)}
          singleButtonLabel={"Back"}
          buttonType={"single"}
          visibleStatus={visible}
        >
          <EmptyScreen headingText={"Edit"} />
          <CircularBtnIcon
            rightArrowIconStatus
            iconHeight={40}
            iconWidth={40}
            onPress={() => MakeMethodDefault()}
            iconStatus
            icon={images.CreditCardIcon(colors.primary)}
            label={"Make Default"}
          />
          <SeperatorLine />
          <CircularBtnIcon
            rightArrowIconStatus
            iconHeight={40}
            iconWidth={40}
            onPress={() => RemoveMethod()}
            iconStatus
            icon={images.DeleteIcon(colors.primary)}
            label={"Remove"}
          />
        </BottomCard>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  horizontalLine: {
    width: "95%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    marginTop: 5,
  },
  bottomCardContainer: {
    flex: 1,
    alignItems: "center",
  },
  contentContainerStyle: {
    gap: 10,
    width: "100%",
  },
});

export default PaymentMethods;
