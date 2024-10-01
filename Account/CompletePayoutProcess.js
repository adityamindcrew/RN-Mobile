import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import EmptyCard from "../../components/forms/emptyCard";
import { BottomButton } from "../../components/Button";
import colors from "../../config/colors";
import Seperator from "../../components/Seperator";
import { PAYOUT_METHODS } from "../../navigation/RouteNames";
import ToggleSwitch from "toggle-switch-react-native";
import SpinnerOverlay from "../../components/spinner";
import { useDispatch } from "react-redux";
import { GetPayoutMethods } from "../../redux/Actions/AccountActions";
import PostAPIs from "../../api/post_api";

const CompletePayoutProcess = ({ navigation, route }) => {
  const data = route.params.data;
  const [switchOn, setSwitchOn] = useState(true);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const onToggle = (e) => {
    setSwitchOn(e);
  };
  const navigateTo = async () => {
    let formdata = {
      ...data,
      isDefault: switchOn,
    };
    try {
      setLoader(true);
      const res = await PostAPIs.addPayoutMethod(formdata);
      console.log(res);
      setLoader(false);
      dispatch(GetPayoutMethods());
      navigation.navigate(PAYOUT_METHODS);
    } catch (error) {
      console.log(error);
      setLoader(false);
      Alert.alert(error.response.data.message[0]);
      console.log(error.response.data.message[0]);
    }
  };
  return (
    <View style={styles.container}>
      <BackButton Text={"Set up payouts"} onPress={() => navigation.goBack()} />
      <SpinnerOverlay
        loaderState={loader}
        textContent={"Adding payout method..."}
      />
      <View>
        <EmptyCard
          children={
            <View style={styles.bottomCardContainer}>
              <View style={{ marginLeft: 20 }}>
                <Typography.BoldHeading>
                  We’re setting things up!
                </Typography.BoldHeading>
              </View>
              <Typography.HH>Here’s what will happen next:</Typography.HH>
              <Typography.HH lineHeight={22}>
                You’ll get an email from us once everything is verified and
                you’re able to receive payouts. If there’s anything else you
                need to do, we’ll contact you.
              </Typography.HH>
            </View>
          }
        />
        <Seperator />
        <EmptyCard
          children={
            <View style={styles.bottomCardContainer}>
              <View style={{ marginLeft: 20 }}>
                <Typography.BoldHeading>
                  When to expect your payout
                </Typography.BoldHeading>
              </View>
              <Typography.HH lineHeight={22}>
                Your money will be sent 24 hours after a guest checks in and
                usually arrives in your account in 7 business days. Processing
                time will vary.
              </Typography.HH>
            </View>
          }
        />
        <Seperator />
        <EmptyCard
          children={
            <View style={styles.bottomCardContainer}>
              <View
                style={{
                  marginLeft: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography.BoldHeading>
                  Set as default payout method
                </Typography.BoldHeading>
                <ToggleSwitch
                  onColor={colors.primary}
                  isOn={switchOn}
                  onToggle={onToggle}
                />
              </View>
              <Typography.HH lineHeight={22}>
                We’ll send payouts for new reservations here once it’s set up.
              </Typography.HH>
            </View>
          }
        />
        <Seperator seperate={10} />
      </View>
      <View style={styles.BackButton}>
        <BottomButton
          buttonColor={colors.primary}
          color={colors.white}
          onPress={navigateTo}
          label={"Done"}
        />
      </View>
      <Seperator seperate={10} />
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
    paddingRight: 15,
    paddingLeft: 5,
    paddingBottom: 20,
    gap: 10,
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
});

export default CompletePayoutProcess;
