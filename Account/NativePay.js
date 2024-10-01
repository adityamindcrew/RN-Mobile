import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import BackButton from "../../components/backButton";
import { BottomButton } from "../../components/Button";
import colors from "../../config/colors";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import Seperator from "../../components/Seperator";
import { SvgXml } from "react-native-svg";
import images from "../../assets/index";

const NativePay = ({ navigation }) => {
  const platform = Platform.OS;
  const backButtonText = platform === "ios" ? "Apple Pay" : "Google Pay";
  const boldTextHeader =
    platform === "ios" ? "Paying with Apple Pay" : "Paying with Google Pay";
  const textDesc =
    platform === "ios"
      ? "You can pay using the Apple Pay account connected to this device."
      : "You can pay using the Google Pay account connected to this device.";

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} Text={backButtonText} />
      <EmptyCard>
        <View style={styles.mainContainer}>
          <Text style={styles.boldText}>{boldTextHeader}</Text>
          <SvgXml
            xml={
              platform === "ios"
                ? images.AppleIcon(colors.primary)
                : images.GoogleIcon(colors.primary)
            }
          />
        </View>
        <Seperator />
        <View style={styles.desc}>
          <Typography.HH>{textDesc}</Typography.HH>
        </View>
        <Seperator seperate={10} />
      </EmptyCard>
      <View style={styles.bottomButton}>
        <BottomButton
          onPress={() => navigation.goBack()}
          buttonColor={colors.primary}
          label={"Done"}
          color={colors.white}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomButton: {
    bottom: "1%",
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  boldText: {
    fontSize: 16,
    fontWeight: "700",
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  desc: {
    paddingRight: 10,
  },
});

export default NativePay;
