import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import { BottomButton } from "../../components/Button";
import Pdf from "react-native-pdf";
import Cancellation from "../../assets/PDFs/CancellationPolicy.pdf";

const CancellationPolicy = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Cancellation policy"}
      />
      <Pdf
        source={
          Platform.OS === "ios"
            ? Cancellation
            : { uri: "bundle-assets://PrivacyPolicyCercles.pdf" }
        }
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={console.log}
        style={{ flex: 1, paddingBottom: "18%" }}
      />

      <View style={styles.BackButton}>
        <BottomButton onPress={() => navigation.goBack()} label={"Back"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
  },
  text: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
});

export default CancellationPolicy;
