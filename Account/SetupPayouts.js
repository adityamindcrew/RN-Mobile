import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import Inputfield from "../../components/forms/inputField";
import EmptyCard from "../../components/forms/emptyCard";
import {
  BtnConfirmCancel,
  BtnTxtUnderline,
  CircularSelectionBtnIcon,
  ConfirmCancelBtn,
  UnderlineRedirectButton,
} from "../../components/Button";
import colors from "../../config/colors";
import Seperator from "../../components/Seperator";
import {
  COUNTRY_LIST,
  REVIEW_INFO,
  SETUP_PAYOUTS,
} from "../../navigation/RouteNames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import CountrySelectModal from "../../components/CountrySelectModal";
import { PAYOUT_ADDRESS } from "../../redux/Type";
const HEIGHT = Dimensions.get("window").height;

const SetupPayouts = ({ navigation, route }) => {
  const propData = route.params.formdata;
  const countryData = route.params.country;
  const [data, setData] = useState(propData || {});
  const [addAddressCard, setAddAddressCard] = useState(false);
  const { payoutAddress } = useSelector((state) => state.AccountReducer);
  const [modalStatus, setModalStatus] = useState(false);
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const dispatch = useDispatch();

  const onPressConfirm = () => {
    if (!addAddressCard) {
      setAddAddressCard(true);
      return;
    }
    if (payoutAddress.lineOne === "") {
      Alert.alert("Please enter street address");
      return;
    }
    // if (apartment === "") {
    //   Alert.alert("Please enter Aparment/building");
    //   return;
    // }
    if (payoutAddress.city === "") {
      Alert.alert("Please enter city");
      return;
    }
    // if (payoutAddress.state === "") {
    //   Alert.alert("Please enter state");
    //   return;
    // }
    // if (zipCode === "") {
    //   Alert.alert("Please enter Zip Code");
    //   return;
    // }
    if (payoutAddress.country === "") {
      Alert.alert("Please enter your country");
      return;
    }
    let formdata = {
      ...data,
      ...payoutAddress,
    };
    navigation.navigate(REVIEW_INFO, { data: formdata });
  };
  const onPressCancel = () => {
    navigation.goBack();
  };
  const cardVisible = () => {
    setAddAddressCard(!addAddressCard);
  };

  const toggleModal = () => {
    setModalStatus(!modalStatus);
  };
  const selectCountry = (country) => {
    dispatch({
      type: PAYOUT_ADDRESS,
      payload: {
        ...payoutAddress,
        country: country.country,
      },
    });
    setCountry(country);
    toggleModal();
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButton
          Text={"Set up payouts"}
          onPress={() => navigation.goBack()}
        />
        <View>
          <EmptyCard
            children={
              addAddressCard ? (
                <>
                  <View style={styles.bottomCardContainer}>
                    <View style={{ marginLeft: 20, marginBottom: 10 }}>
                      <Typography.BoldHeading>
                        Add a new address
                      </Typography.BoldHeading>
                    </View>
                    <Typography.HH>Street address</Typography.HH>
                    <Inputfield
                      valueChange={payoutAddress.lineOne}
                      changeTextHanlder={(e) => {
                        dispatch({
                          type: PAYOUT_ADDRESS,
                          payload: {
                            ...payoutAddress,
                            lineOne: e,
                          },
                        });
                      }}
                      placeHolder={"Enter your street address"}
                    />
                    <Typography.HH>Apartment, building</Typography.HH>
                    <Inputfield
                      valueChange={payoutAddress.lineTwo}
                      changeTextHanlder={(e) => {
                        dispatch({
                          type: PAYOUT_ADDRESS,
                          payload: {
                            ...payoutAddress,
                            lineTwo: e,
                          },
                        });
                      }}
                      placeHolder={"Enter your apartment number"}
                    />
                    <Typography.HH>City</Typography.HH>
                    <Inputfield
                      valueChange={payoutAddress.city}
                      changeTextHanlder={(e) => {
                        dispatch({
                          type: PAYOUT_ADDRESS,
                          payload: {
                            ...payoutAddress,
                            city: e,
                          },
                        });
                      }}
                      placeHolder={"Enter your city"}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <View style={{ width: "50%" }}>
                        <Typography.HH>State</Typography.HH>
                        <Inputfield
                          valueChange={payoutAddress.state}
                          changeTextHanlder={(e) => {
                            dispatch({
                              type: PAYOUT_ADDRESS,
                              payload: {
                                ...payoutAddress,
                                state: e,
                              },
                            });
                          }}
                          placeHolder={"Enter your state"}
                        />
                      </View>
                      <View style={{ width: "50%" }}>
                        <Typography.HH>Zip code</Typography.HH>
                        <Inputfield
                          valueChange={payoutAddress.zipCode}
                          changeTextHanlder={(e) => {
                            dispatch({
                              type: PAYOUT_ADDRESS,
                              payload: {
                                ...payoutAddress,
                                zipCode: e,
                              },
                            });
                          }}
                          placeHolder={"Enter your Zip code"}
                        />
                      </View>
                    </View>
                    <Typography.HH>Country</Typography.HH>
                    <CountrySelectModal
                      visible={modalStatus}
                      onRequestClose={toggleModal}
                      crossPress={toggleModal}
                      onCountrySelect={selectCountry}
                    />
                    <View style={{ paddingHorizontal: 10 }}>
                      <UnderlineRedirectButton
                        onPress={toggleModal}
                        label={payoutAddress.country || "Select Country"}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.bottomCardContainer}>
                  <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Typography.BoldHeading>
                      Add the address associated with this account
                    </Typography.BoldHeading>
                  </View>
                  <Typography.HH>
                    This is the address the bank or financial institution has on
                    file for this account. It should match recent bank
                    statements.
                  </Typography.HH>
                  <View style={{ marginLeft: 20, marginTop: 10 }}>
                    <BtnTxtUnderline
                      color={colors.darkBlue}
                      label="Add a new address"
                      onPress={cardVisible}
                    />
                  </View>
                </View>
              )
            }
          />
          <Seperator seperate={10} />
        </View>
        <View style={styles.btnBottom}>
          <ConfirmCancelBtn
            onPressConfirm={() => onPressConfirm()}
            onPressCancel={() => onPressCancel()}
            confirmTitle={"Next"}
            cancelTitle={"Back"}
            cancelButtonColor={colors.white}
            cancelTextColor={colors.darkBlue}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
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
    paddingRight: 10,
    paddingLeft: 5,
    paddingBottom: 20,
  },
  horizontalLine: {
    width: "91%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    alignSelf: "center",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  btnBottom: {
    position: "absolute",
    width: "100%",
    bottom: "2%",
  },
});

export default SetupPayouts;
