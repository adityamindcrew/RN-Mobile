import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import colors from "../../config/colors";
import BackButton from "../../components/backButton";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import images from "../../assets/index";
import * as Typography from "../../config/Typography";
import {
  BottomButton,
  BtnWhiteOption,
  CircularBtnIcon,
} from "../../components/Button";
import { ADD_PAYOUT_METHOD } from "../../navigation/RouteNames";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPayoutMethods,
  GetProfile,
  MakePayoutMethodDefault,
  RemovePayoutMethod,
} from "../../redux/Actions/AccountActions";
import BottomCard from "../../components/bottomCard";
import EmptyScreen from "../../components/EmptyScreenMessage";
import SeperatorLine from "../../components/SeperatorLine";
import GetAPIs from "../../api/get_api";

const PayoutMethods = ({ navigation }) => {
  const [payoutMethods, setPayoutMethods] = useState(["df"]);
  const { payoutMethodData, profileData } = useSelector(
    (state) => state.AccountReducer
  );
  const [payoutMethodId, setPayoutMethodId] = useState("");
  const [payoutMethodType, setPayoutMethodType] = useState("");
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        dispatch(GetPayoutMethods(navigation));
        if (!profileData.stripeOnboardingUrl) {
          const response = await GetAPIs.createOnboardingUrl();
          dispatch(GetProfile(navigation));
          console.log(response);
        }
      } catch (error) {
        if (error?.response?.data) {
          console.log(error?.response?.data.message[0]);
          return;
        }
        console.log(error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  // console.log(profileData);

  const bottomCardVisibility = () => {
    if (payoutMethodData.length === 0) {
      navigation.navigate(ADD_PAYOUT_METHOD);
    } else {
      Alert.alert(
        "You already have a payout method, please remove it to add a new one"
      );
    }
  };

  const MakeMethodDefault = async () => {
    let formdata = { payoutMethodId, payoutMethodType };
    dispatch(MakePayoutMethodDefault(formdata));
    setVisible(false);
  };
  const RemoveMethod = async () => {
    // let formdata = { stripeconnectid: payoutMethodId };
    dispatch(RemovePayoutMethod(payoutMethodId));
    setVisible(false);
  };

  const renderCardList = ({ item }) => {
    const { account_holder_name, account_holder_type, currency, last4 } = item;
    return (
      <>
        {/* {item.payoutMethodType === "stripe" ? (
          <BtnWhiteOption
            defaultStatus={item.isDefault}
            icon1={images.BankIcon(colors.primary)}
            icon1Height={40}
            icon1Width={40}
            heading={`Bank Account`}
            description={`${account_holder_name} | ${account_holder_type} **** ${last4} (${currency.toUpperCase()})`}
            iconStatus2
            icon2={images.Edit(colors.black)}
            onPress={() => {
              setPayoutMethodId(item.payoutMethodId), setVisible(true);
              setPayoutMethodType("stripe");
            }}
          />
        ) : (
          <BtnWhiteOption
            defaultStatus={item.isDefault}
            icon1={images.PaypalIcon(colors.primary)}
            icon1Height={40}
            icon1Width={40}
            heading={`PayPal`}
            description={item.payoutMethodId}
            iconStatus2
            icon2={images.Edit(colors.black)}
            onPress={() => {
              setPayoutMethodId(item.payoutMethodId), setVisible(true);
              setPayoutMethodType("paypal");
            }}
          />
        )} */}
        <BtnWhiteOption
          defaultStatus={false}
          icon1={images.BankIcon(colors.primary)}
          icon1Height={40}
          icon1Width={40}
          heading={`Bank Account`}
          description={`**** ${last4} (${currency.toUpperCase()})`}
          iconStatus2
          icon2={images.Edit(colors.black)}
          onPress={() => {
            setPayoutMethodId(item.account), setVisible(true);
            setPayoutMethodType("stripe");
          }}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton Text={"Payout methods"} onPress={() => navigation.goBack()} />
      {payoutMethodData.length == 0 ? (
        <View style={styles.mainContainer}>
          <EmptyScreenMessage
            headingText={"No payout methods yet!"}
            buttonText={"Add payout method"}
            onPressButton={bottomCardVisibility}
            icon1Status
            icon1={images.PaymentBlack()}
          />
        </View>
      ) : (
        <View style={{ alignItems: "center", paddingHorizontal: 20, gap: 10 }}>
          <View
            style={{
              marginLeft: -16,
              alignSelf: "flex-start",
            }}
          >
            <Typography.HH>
              You can send your money to one or more payout methods.
            </Typography.HH>
          </View>
          {/* <BtnWhiteOption
            icon1={images.CreditCardIcon(colors.primary)}
            icon1Height={40}
            icon1Width={40}
            heading={"Mastercard 1234"}
            description={"Expires 09/23"}
            iconStatus2
            icon2={images.Edit(colors.black)}
          />
          <BtnWhiteOption
            icon1={images.PaypalIcon(colors.primary)}
            icon1Height={40}
            icon1Width={40}
            heading={"Pay Pal"}
            description={"Paypal: example@gmail.com"}
            iconStatus2
            icon2={images.Edit(colors.black)}
          /> */}
          <View style={{ width: "100%" }}>
            <FlatList
              contentContainerStyle={styles.contentContainerStyle}
              data={payoutMethodData}
              renderItem={renderCardList}
              keyExtractor={(item) => {
                return item.id;
              }}
              // onEndReached={handleEndReached}
              // onEndReachedThreshold={0.5}
            />
          </View>
        </View>
      )}
      <View style={styles.BackButton}>
        <BottomButton
          buttonColor={
            payoutMethodData.length !== 0 ? colors.primary : colors.white
          }
          color={payoutMethodData.length !== 0 ? colors.white : colors.black}
          onPress={() => {
            payoutMethodData.length > 0
              ? bottomCardVisibility()
              : navigation.goBack();
          }}
          label={payoutMethodData.length > 0 ? "Add payout method" : "Back"}
        />
      </View>
      <BottomCard
        singleButtonColor={colors.darkBlue}
        singleButtonTextColor={colors.white}
        singleButtonOnPress={() => setVisible(!visible)}
        singleButtonLabel={"Back"}
        buttonType={"single"}
        visibleStatus={visible}
      >
        <EmptyScreen headingText={"Edit"} />
        {/* <CircularBtnIcon
          rightArrowIconStatus
          iconHeight={40}
          iconWidth={40}
          onPress={() => MakeMethodDefault()}
          iconStatus
          icon={images.CreditCardIcon(colors.primary)}
          label={"Make Default"}
        />
        <SeperatorLine /> */}
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
});

export default PayoutMethods;
