import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import EmptyCard from "../../components/forms/emptyCard";
import {
  BottomButton,
  CircularSelectionBtnIcon,
  UnderlineRedirectButton,
} from "../../components/Button";
import colors from "../../config/colors";
import images from "../../assets/index";
import Seperator from "../../components/Seperator";
import {
  ADD_BANK_ACCOUNT_INFO,
  ADD_PAYOUT_METHOD,
  PAYOUT_METHODS,
} from "../../navigation/RouteNames";
import CountrySelectModal from "../../components/CountrySelectModal";
import PaypalLogin from "../../components/Auth/PaypalLogin";
import PostAPIs from "../../api/post_api";
import SpinnerOverlay from "../../components/spinner";
import { GetPayoutMethods } from "../../redux/Actions/AccountActions";
import { useDispatch, useSelector } from "react-redux";
import StripeWeb from "../../components/Payments/StripeWeb";

const AddPaymentMethod = ({ navigation }) => {
  const [selectCard, setSelectCard] = useState(true);
  const [selectPaypal, setSelectPaypal] = useState(false);
  const { profileData } = useSelector((state) => state.AccountReducer);
  const [modalStatus, setModalStatus] = useState(false);
  const [country, setCountry] = useState("");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const selectionCard = () => {
    setSelectCard(true);
    setSelectPaypal(false);
  };
  const selectionPaypal = () => {
    setSelectCard(false);
    setSelectPaypal(true);
  };

  // {
  //   "BSB": false,
  //   "BankCode": true,
  //   "BranchCode": true,
  //   "CBU": false,
  //   "CBUValidation": null,
  //   "CCI": false,
  //   "CCIValidation": null,
  //   "Clabe": false,
  //   "ClabeValidation": null,
  //   "IBAN": false,
  //   "IBANValidation": null,
  //   "IFSC": false,
  //   "IFSCValidation": null,
  //   "InstitutionNumber": false,
  //   "SocialInsuranceNumber": false,
  //   "SortCode": false,
  //   "Swift/BIC": false,
  //   "SwiftValidation": null,
  //   "TransitNumber": false,
  //   "accountHolderName": true,
  //   "accountHolderType": true,
  //   "accountNumber": true,
  //   "accountNumberValidation": "4-8 digits",
  //   "accountRoutingNumber": false,
  //   "accountRoutingNumberValidation": null,
  //   "accountType": true,
  //   "bankName": true,
  //   "branchName": true,
  //   "city": true,
  //   "clearingCode": false,
  //   "clearingCodeValidation": null,
  //   "country": "Japan",
  //   "countryCode": "JP",
  //   "isDefault": true,
  //   "lineOne": true,
  //   "lineTwo": true,
  //   "nationality": false,
  //   "personalId": false,
  //   "state": true,
  //   "zipCode": true
  // },

  useEffect(() => {
    setCountry({
      country: "USA",
      accountHolderName: true,
      accountHolderType: true,
      accountRoutingNumber: true,
      accountRoutingNumberValidation: "9 characters",
      accountNumber: true,
      accountNumberValidation: "Format varies by bank",
      TransitNumber: false,
      InstitutionNumber: false,
      SocialInsuranceNumber: false,
      CBU: false,
      CBUValidation: null,
      BankCode: false,
      BranchCode: false,
      BSB: false,
      CCI: false,
      CCIValidation: null,
      branchName: false,
      bankName: false,
      IBAN: false,
      "Swift/BIC": false,
      SwiftValidation: null,
      IBANValidation: null,
      Clabe: false,
      ClabeValidation: null,
      IFSC: false,
      IFSCValidation: null,
      countryCode: "US",
      isDefault: true,
      nationality: false,
      personalId: false,
      accountType: true,
      SortCode: false,
      lineOne: true,
      lineTwo: true,
      zipCode: true,
      state: true,
      city: true,
    });
  }, []);

  const navigateTo = (screen) => {
    if (selectCard) {
      if (country.length == 0) {
        Alert.alert("Please select a country");
      } else {
        navigation.navigate(screen, {
          screen: ADD_PAYOUT_METHOD,
          country: country,
        });
      }
    }
  };

  // const addPaypal = async ({ payer_id, email }) => {
  //   let formdata = {
  //     payoutMethodType: "paypal",
  //     payerId: payer_id,
  //     paypalId: email,
  //     isDefault: false,
  //   };
  //   try {
  //     setLoader(true);
  //     await PostAPIs.addPayoutMethod(formdata);
  //     setLoader(false);
  //     dispatch(GetPayoutMethods());
  //     navigation.navigate(PAYOUT_METHODS);
  //   } catch (error) {
  //     setLoader(false);
  //     Alert.alert(error.response.data.message[0]);
  //     console.log(error.response.data.message[0]);
  //   }
  // };

  const addAccount = async () => {
    dispatch(GetPayoutMethods());
    navigation.navigate(PAYOUT_METHODS);
  };
  const toggleModal = () => {
    setModalStatus(!modalStatus);
  };

  const selectCountry = (country) => {
    setCountry(country);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <BackButton
        Text={"Add payout method"}
        onPress={() => navigation.goBack()}
      />
      <SpinnerOverlay
        loaderState={loader}
        textContent={"Adding Payout Method..."}
      />
      <View>
        <EmptyCard
          children={
            <View style={styles.cardContainer}>
              <View style={styles.formContainer}>
                <Text style={styles.fieldHeadingText}>Billing</Text>
                <View style={styles.inputHeader}>
                  <Typography.HH>Select a Country</Typography.HH>
                  <CountrySelectModal
                    otherObj={false}
                    visible={modalStatus}
                    onRequestClose={toggleModal}
                    crossPress={toggleModal}
                    onCountrySelect={selectCountry}
                  />
                </View>
                <UnderlineRedirectButton
                  onPress={() =>
                    // navigation.navigate(COUNTRY_LIST, {
                    //   screen: ADD_PAYOUT_METHOD,
                    // })
                    setModalStatus(true)
                  }
                  label={country.country || "Select a Country"}
                />
              </View>
            </View>
          }
        />
        <Seperator seperate={10} />
        <EmptyCard
          children={
            <View style={styles.bottomCardContainer}>
              <View style={{ marginLeft: 15, marginBottom: 10 }}>
                <Typography.BoldHeading>
                  How would you like to get paid?
                </Typography.BoldHeading>
              </View>
              {profileData.stripeIdState !== "Completed" && (
                <CircularSelectionBtnIcon
                  iconHeight={40}
                  iconWidth={40}
                  onPress={selectionCard}
                  iconStatus
                  icon={images.BankIcon(colors.primary)}
                  label={"Bank Account"}
                  iconStatus2
                  selected={selectCard}
                />
              )}
              {/* <CircularSelectionBtnIcon
                iconHeight={40}
                iconWidth={40}
                onPress={selectionPaypal}
                iconStatus
                icon={images.PaypalIcon(colors.primary)}
                label={"Paypal"}
                iconStatus2
                selected={selectPaypal}
              /> */}

              <View style={styles.horizontalLine} />
            </View>
          }
        />
      </View>
      <View style={styles.BackButton}>
        {/* {selectPaypal ? (
          <PaypalLogin
            onSuccess={addPaypal}
            onError={console.log}
            renderButton={() => (
              <BottomButton
                buttonColor={colors.primary}
                color={colors.white}
                // onPress={() => navigateTo(ADD_BANK_ACCOUNT_INFO)}
                disabled
                label={"Continue"}
              />
            )}
          />
        ) : ( */}
        <>
          {profileData.stripeIdState !== "Completed" && (
            <StripeWeb
              onSuccess={addAccount}
              onError={console.log}
              renderButton={() => (
                <BottomButton
                  buttonColor={colors.primary}
                  color={colors.white}
                  // onPress={() => navigateTo(ADD_BANK_ACCOUNT_INFO)}
                  disabled
                  label={"Continue"}
                />
              )}
            />
          )}
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  formContainer: {
    width: "100%",
    paddingTop: 20,
    gap: 14,
  },
  fieldHeadingText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  inputHeader: {
    marginLeft: -10,
  },
  bottomCardContainer: {
    width: "100%",
    paddingTop: 20,
  },
  horizontalLine: {
    width: "95%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    marginTop: 5,
    alignSelf: "center",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  options: {
    width: "100%",
    height: 40,
    // backgroundColor: colors.lightgray,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.horizontalLineColor,
  },
  text: {
    fontWeight: "500",
    marginLeft: -5,
  },
  arrowStyles: {
    backgroundColor: colors.darkgray,
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 13,
    position: "absolute",
    right: 0,
  },
});

export default AddPaymentMethod;
