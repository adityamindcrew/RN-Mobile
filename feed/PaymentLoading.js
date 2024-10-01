import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import PostAPIs from "../../api/post_api";
import images from "../../assets";
import { BtnContain } from "../../components/Button";
import Seperator from "../../components/Seperator";
import BottomCard from "../../components/bottomCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { GetFeedList } from "../../redux/Actions/FeedActions";
import { useDispatch } from "react-redux";
import { GetBookingsList } from "../../redux/Actions/BookingsAction";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import { CommonActions } from "@react-navigation/native";
import {
  BOOKINGS_STACK,
  BOTTOM_STACK,
  FEED_STACK,
} from "../../navigation/RouteNames";

const PaymentLoading = ({ navigation, route }) => {
  const [text, setText] = useState("We’re getting your trip ready");
  const [bottomCard, setBottomCard] = useState(false);
  const image = route.params.image;
  const formdata = route.params.formdata;
  const manual = route?.params?.manual;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    setText("Reviewing payment details");

    if (manual) {
      PostAPIs.confirmBooking(formdata)
        .then((response) => {
          setTimeout(() => {
            dispatch(GetFeedList());
            dispatch(GetBookingsList());
            setText("Payment accepted");
          }, 1000);

          setTimeout(() => {
            navigation.navigate("StayBooked", { image, data: response.data });
          }, 2000);
        })
        .catch((error) => {
          setBottomCard(true);
          console.log(error);
          Alert.alert(error.message[0]);
        });
    } else {
      PostAPIs.bookHotel(formdata)
        .then((response) => {
          console.log(response);
          setTimeout(() => {
            dispatch(GetFeedList());
            dispatch(GetBookingsList());
            setText("Payment accepted");
          }, 1000);

          setTimeout(() => {
            navigation.navigate("StayBooked", { image, data: response.data });
          }, 2000);
        })
        .catch((error) => {
          setBottomCard(true);
          console.log(error);
          Alert.alert(error?.response?.data?.message[0]);
        });
    }

    return clearTimeout;
  }, []);

  const bottomCardPress = () => {
    setBottomCard(false);
    // navigation.goBack();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: BOTTOM_STACK,
            state: {
              routes: [
                {
                  name: FEED_STACK,
                  state: {
                    routes: [
                      {
                        name: "Feed",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
    );
  };

  return (
    <View style={styles.container}>
      <SvgXml xml={images.LoadingIcon()} />
      <Seperator />
      <Typography.BoldHeading
        fontSize={18}
        textAlign={"center"}
        fontWeight={"bold"}
      >
        {text}
      </Typography.BoldHeading>
      <BottomCard
        children={
          <>
            <View style={styles.bottomCard}>
              <View style={styles.paymentDeclinedView}>
                <SvgXml xml={images.PaymentDeclinedIcon()} />
              </View>
              <View style={styles.PaymentText}>
                <Typography.H
                  color={colors.darkBlue}
                  fontsize={24}
                  fontweight={700}
                >
                  Payment declined
                </Typography.H>
              </View>
              <View style={styles.PaymentTextChild}>
                <Typography.ChileLine
                  color={colors.grayText}
                  fontsize={14}
                  fontweight={500}
                >
                  Payment wasn't successful, please select another payment
                  method or contact your payment provider
                </Typography.ChileLine>
              </View>
              <View style={styles.confirmBtnView}>
                <BtnContain
                  label="Back"
                  color={colors.darkBlue}
                  labelcolor="white"
                  onPress={bottomCardPress}
                />
              </View>
            </View>
          </>
        }
        visibleStatus={bottomCard}
        paddingBottom={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  //   bottomCard: {
  //     backgroundColor: colors.white,
  //     position: "absolute",
  //     bottom: 0,
  //     width: "100%",
  //     borderTopLeftRadius: 20,
  //     borderTopRightRadius: 20,
  //     borderWidth: 0.2,
  //     borderColor: colors.grayText,
  //     height: "40%",
  //   },
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

export default PaymentLoading;
