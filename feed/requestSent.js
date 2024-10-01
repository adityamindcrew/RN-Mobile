import React, { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import {
  BOOKINGS,
  BOOKINGS_STACK,
  BOTTOM_STACK,
  FEED,
  FEED_STACK,
} from "../../navigation/RouteNames";
import { CommonActions } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
const RequestSent = ({ navigation, route }) => {
  const [bottomPopUpStatus, setBottomPopUpStatus] = useState(false);
  const image = route.params.image;
  const data = route.params.data;

  const dispatch = useDispatch();

  const navigateToAndReset = () => {
    Linking.openURL(
      `mycercles://ChatStack/BottomStack/BookingsStack/PendingBooking/${encodeURIComponent(
        data.id
      )}`
    );
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: FEED_STACK,
          },
        ],
      })
    );
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <View style={styles.iconView}> */}
        {/* <SvgXml xml={images.RequestSentIcon()} /> */}
        <FastImage
          style={{
            width: "90%",
            height: 300,
            alignSelf: "center",
            borderRadius: 18,
            marginTop: "15%",
          }}
          source={{ uri: image }}
        />
        {/* </View> */}
        <View style={styles.requestSentView}>
          <Text style={styles.reservationText}>
            Your Reservation request has been sent!
          </Text>
        </View>
        <View style={styles.hostView}>
          <Typography.ChileLine
            color={colors.grayText}
            size={14}
            fontweight={500}
          >
            The host bas been notified, and we will send you an update once the
            host approves your request
          </Typography.ChileLine>
        </View>
      </ScrollView>
      <View style={styles.reservationBtn}>
        <Button.BtnContain
          onPress={navigateToAndReset}
          label="View Booking"
          color={colors.primary}
          labelcolor="white"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconView: {
    marginTop: "20%",
    // alignSelf: "center",
  },
  requestSentView: {
    marginTop: "30%",
    alignSelf: "center",
  },
  reservationText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
    maxWidth: 300,
  },
  hostView: {
    alignSelf: "center",
    maxWidth: 300,
    marginTop: 20,
  },
  reservationBtn: {
    width: "90%",
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
});

export default RequestSent;
