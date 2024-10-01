import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
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
const StayBooked = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const image = route.params.image;
  const data = route?.params?.data;
  const status = route?.params?.status;

  const navigateToAndReset = () => {
    Linking.openURL(
      `mycercles://ChatStack/BottomStack/BookingsStack/CurrentBooking/${encodeURIComponent(
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
    <ScrollView contentContainerStyle={styles.scrollStyle}>
      <View style={styles.container}>
        <FastImage
          style={styles.userImg}
          source={{
            uri: image || "https://www.w3schools.com/howto/img_avatar.png",
          }}
        />
        <View style={styles.rightIconView}>
          <SvgXml
            style={{ alignSelf: "center" }}
            xml={images.RightColoredIcon()}
          />
        </View>
        <View style={styles.requestSentView}>
          <Text style={styles.reservationText}>
            Congratulations, your stay has been booked!
          </Text>
        </View>
        <View style={styles.confirmBtnView}>
          <Button.BtnContain
            label="View booking"
            color={colors.primary}
            labelcolor="white"
            onPress={navigateToAndReset}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollStyle: { flex: 1, marginBottom: 20 },
  userImg: {
    width: "90%",
    height: "50%",
    alignSelf: "center",
    borderRadius: 18,
    marginTop: "15%",
  },
  rightIconView: {
    backgroundColor: colors.white,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: "center",
    marginTop: "10%",
    justifyContent: "center",
  },
  requestSentView: {
    marginTop: "5%",
    alignSelf: "center",
  },
  reservationText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
    maxWidth: 300,
  },
  confirmBtnView: {
    width: "90%",
    alignSelf: "center",
    bottom: 0,
    marginTop: 30,
  },
});

export default StayBooked;
