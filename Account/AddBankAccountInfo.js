import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import Inputfield from "../../components/forms/inputField";
import EmptyCard from "../../components/forms/emptyCard";
import {
  CircularSelectionBtnIcon,
  ConfirmCancelBtn,
} from "../../components/Button";
import colors from "../../config/colors";
import Seperator from "../../components/Seperator";
import { SETUP_PAYOUTS } from "../../navigation/RouteNames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import SpinnerOverlay from "../../components/spinner";
import parseValidation from "../../utils/splitNumbers";

const AddBankAccountInfo = ({ navigation, route }) => {
  const country = route.params.country;
  const [selectCheck, setSelectCheck] = useState(true);
  const [selectSaving, setSelectSaving] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    accountHolderName: "",
    accountRoutingNumber: "",
    accountNumber: "",
    personalId: "",
  });
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const selectionCard = () => {
    setSelectCheck(true);
    setSelectSaving(false);
  };

  const selectionPaypal = () => {
    setSelectCheck(false);
    setSelectSaving(true);
  };
  const onPressConfirm = async () => {
    const { accountHolderName, accountRoutingNumber, accountNumber } =
      accountDetails;
    const {
      CBUValidation,
      CCIValidation,
      ClabeValidation,
      IBANValidation,
      IFSCValidation,
      SwiftValidation,
      accountNumberValidation,
      accountRoutingNumberValidation,
      clearingCodeValidation,
    } = country;

    if (accountHolderName === "") {
      Alert.alert("Please enter account holder name");
      return;
    }
    if (country.accountNumber && accountNumberValidation) {
      const data = parseValidation(accountNumberValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountNumber.length < minLength ||
          accountNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit account number`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit account number`);
          return;
        }
      }
    }
    if (country.accountRoutingNumber && accountRoutingNumberValidation) {
      const data = parseValidation(accountRoutingNumberValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountRoutingNumber.length < minLength ||
          accountRoutingNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit account routing number`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountRoutingNumber.length !== data) {
          Alert.alert(
            `Please enter a valid ${data} digit account routing number`
          );
          return;
        }
      }
    }
    if (country.CBU && CBUValidation) {
      const data = parseValidation(CBUValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountNumber.length < minLength ||
          accountNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit CBU`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit CBU`);
          return;
        }
      }
    }
    if (country.CCI && CCIValidation) {
      const data = parseValidation(CCIValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountNumber.length < minLength ||
          accountNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit CCI`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit CCI`);
          return;
        }
      }
    }
    if (country.Clabe && ClabeValidation) {
      const data = parseValidation(ClabeValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountNumber.length < minLength ||
          accountNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit Clabe`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit Clabe`);
          return;
        }
      }
    }
    if (country.IBAN && IBANValidation) {
      const data = parseValidation(IBANValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountNumber.length < minLength ||
          accountNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit IBAN`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit IBAN`);
          return;
        }
      }
    }
    if (country.IFSC && IFSCValidation) {
      const data = parseValidation(IFSCValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountRoutingNumber.length < minLength ||
          accountRoutingNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit IFSC`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountRoutingNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit IFSC`);
          return;
        }
      }
    }

    if (country["Swift/BIC"] && SwiftValidation) {
      const data = parseValidation(SwiftValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountRoutingNumber.length < minLength ||
          accountRoutingNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit Swift`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountRoutingNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit Swift`);
          return;
        }
      }
    }
    if (country.clearingCode && clearingCodeValidation) {
      const data = parseValidation(clearingCodeValidation);
      if (Array.isArray(data)) {
        const [minLength, maxLength] = data;
        if (
          accountRoutingNumber.length < minLength ||
          accountRoutingNumber.length > maxLength
        ) {
          Alert.alert(
            `Please enter a valid ${minLength}-${maxLength} digit clearing code`
          );
          return;
        }
      } else if (typeof data === "number") {
        if (accountRoutingNumber.length !== data) {
          Alert.alert(`Please enter a valid ${data} digit clearing code`);
          return;
        }
      }
    }

    // try {
    const formdata = {
      ...accountDetails,
      accountHolderType: "individual",
      accountType: selectCheck ? "checking" : "savings",
    };
    // console.log(formdata);
    navigation.navigate(SETUP_PAYOUTS, { formdata, country });
    //   try {
    //     setLoader(true);
    //     await PostAPIs.addPayoutMethod(formdata);
    //     setLoader(false);
    //     dispatch(GetPayoutMethods());
    //     navigation.navigate(SETUP_PAYOUTS);
    //   } catch (error) {
    //     setLoader(false);
    //     Alert.alert(error.response.data.message[0]);
    //     console.log(error.response.data.message[0]);
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
    // }
  };
  const onPressCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <SpinnerOverlay
          loaderState={loader}
          textContent={"Adding payout method..."}
        />
        <BackButton
          Text={"Add bank account info"}
          onPress={() => navigation.goBack()}
        />
        <View>
          {country.accountType && (
            <EmptyCard
              children={
                <View style={styles.bottomCardContainer}>
                  <View style={{ marginLeft: 15, marginBottom: 10 }}>
                    <Typography.BoldHeading>
                      How would you like to get paid?
                    </Typography.BoldHeading>
                  </View>
                  <CircularSelectionBtnIcon
                    iconHeight={40}
                    iconWidth={40}
                    onPress={selectionCard}
                    label={"Checking"}
                    iconStatus2
                    selected={selectCheck}
                  />
                  <View style={styles.horizontalLine} />
                  <CircularSelectionBtnIcon
                    iconHeight={40}
                    iconWidth={40}
                    onPress={selectionPaypal}
                    label={"Savings"}
                    iconStatus2
                    selected={selectSaving}
                  />
                </View>
              }
            />
          )}
          {country.accountHolderName && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Account holder name
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountHolderName: value,
                        })
                      }
                      placeHolder={"Account holder name"}
                    />
                    <Typography.HH>
                      Enter the account holder’s name exactly as it appears on
                      bank statements.
                    </Typography.HH>
                  </View>
                }
              />
            </>
          )}
          {country.accountNumber && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Account number
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountNumber: value,
                        })
                      }
                      placeHolder={"Enter account number"}
                    />
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setConfirmAccountNumber(value)
                      }
                      placeHolder={"Confirm account number"}
                    />
                    <Typography.HH>
                      Enter the account number. This can usually be found within
                      the account details.
                    </Typography.HH>
                  </View>
                }
              />
            </>
          )}
          {country.accountRoutingNumber && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Routing Number
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your routing number"}
                    />
                    <Typography.HH>
                      Enter the routing number. It is located on the bottom left
                      corner of a check or within details from the bank.
                    </Typography.HH>
                  </View>
                }
              />
            </>
          )}
          {country.personalId && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Personal ID
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          personalId: value,
                        })
                      }
                      placeHolder={"Enter your personal ID number"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.TransitNumber && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Transit Number
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your Transit Number"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.InstitutionNumber && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Institution Number
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber:
                            (accountDetails.accountRoutingNumber
                              ? `${accountDetails.accountRoutingNumber}`
                              : "") + value,
                        })
                      }
                      placeHolder={"Enter your Institution Number"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.SocialInsuranceNumber && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Social Insurance Number
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          personalId: value,
                        })
                      }
                      placeHolder={"Enter your Social Insurance Number"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.CBU && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>CBU</Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountNumber: value,
                        })
                      }
                      placeHolder={"Enter your CBU"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.BankCode && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Bank Code
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your Bank Code"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.BranchCode && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Branch Code
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber:
                            (accountDetails.accountRoutingNumber
                              ? `${accountDetails.accountRoutingNumber}-`
                              : "") + value,
                        })
                      }
                      placeHolder={"Enter your Branch Code"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.BSB && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>BSB</Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your BSB"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.CCI && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>CCI</Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountNumber: value,
                        })
                      }
                      placeHolder={"Enter your CCI"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.branchName && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        branch Name
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          personalId: value,
                        })
                      }
                      placeHolder={"Enter your branch Name"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.bankName && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        bank Name
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          personalId: value,
                        })
                      }
                      placeHolder={"Enter your bank Name"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.IBAN && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        IBAN
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountNumber: value,
                        })
                      }
                      placeHolder={"Enter your IBAN"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country["Swift/BIC"] && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Swift/BIC
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your Swift/BIC"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.Clabe && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        Clabe
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountNumber: value,
                        })
                      }
                      placeHolder={"Enter your Clabe"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.IFSC && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        IFSC
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your IFSC"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.clearingCode && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        clearing code
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your clearing code"}
                    />
                  </View>
                }
              />
            </>
          )}
          {country.SortCode && (
            <>
              <Seperator />
              <EmptyCard
                children={
                  <View style={styles.bottomCardContainer}>
                    <View style={styles.cardHeader}>
                      <Typography.HH color={colors.darkBlue}>
                        SortCode
                      </Typography.HH>
                    </View>
                    <Inputfield
                      changeTextHanlder={(value) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountRoutingNumber: value,
                        })
                      }
                      placeHolder={"Enter your SortCode"}
                    />
                  </View>
                }
              />
            </>
          )}
          <Seperator seperate={8} />
          <ConfirmCancelBtn
            position={"relative"}
            width={"100%"}
            onPressConfirm={() => onPressConfirm()}
            onPressCancel={() => onPressCancel()}
            confirmTitle={"Next"}
            cancelTitle={"Back"}
            cancelButtonColor={colors.white}
            cancelTextColor={colors.darkBlue}
          />
          <Seperator seperate={8} />
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
    paddingVertical: 20,
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
  cardHeader: { marginBottom: 10 },
});

export default AddBankAccountInfo;
