import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import SpinnerOverlay from "../../components/spinner";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
const PaymentStatus = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);
  return (
    <View style={styles.container}>
      <SpinnerOverlay loaderState={loader} />
      <View style={styles.bottomCard}>
        <View style={styles.paymentDeclinedView}>
          <SvgXml xml={images.PaymentDeclinedIcon()} />
        </View>
        <View style={styles.PaymentText}>
          <Typography.H color={colors.darkBlue} fontsize={24} fontweight={700}>
            Payment declined
          </Typography.H>
        </View>
        <View style={styles.PaymentTextChild}>
          <Typography.ChileLine
            color={colors.grayText}
            fontsize={14}
            fontweight={500} x
          >
            Payment wasn't successful, please select another payment method or
            contact your payment provider
          </Typography.ChileLine>
        </View>
        <View style={styles.confirmBtnView}>
          <Button.BtnContain
            label="Back"
            color={colors.darkBlue}
            labelcolor="white"
            onPress={() => setBottomPopUpStatus(false)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: "40%",
  },
  paymentDeclinedView: {
    alignSelf: "center",
    marginTop: 20,
  },
  PaymentText: {
    alignSelf: "center",
    marginTop: 20,
  },
  PaymentTextChild: {
    marginTop: 30,
    bottom: 20,
    alignSelf: "center",
    width: "80%",
  },
  confirmBtnView: {
    width: "90%",
    alignSelf: "center",
    bottom: 0,
  },
});

export default PaymentStatus;
