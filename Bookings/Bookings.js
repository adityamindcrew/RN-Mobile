import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BookingFlatListComponent from "../../components/BookingsFlatList";
import TabThreeBtn from "../../components/TabThreeBtn";
import BackButton from "../../components/backButton";
import { FloatingBtn } from "../../components/floatingButton";
import { GetBookingsList } from "../../redux/Actions/BookingsAction";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import images from "../../assets";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import {
  BOOKINGS,
  BOOKINGS_STACK,
  FEED,
  FEED_STACK,
} from "../../navigation/RouteNames";
import EmptyScreen from "../../components/EmptyScreenMessage";
import colors from "../../config/colors";
import { storage } from "../../components/asyncStorageToken";

const Bookings = ({ navigation, route }) => {
  const type = route?.params?.num;
  const [btnPressed, setBtnPressed] = useState(1);
  const { bookingsAll, bookingType } = useSelector(
    (state) => state.BookingsReducer
  );

  const { unreadMessageCount } = useSelector((state) => state.FeedReducer);
  const { profileData } = useSelector((state) => state.AccountReducer);
  const approve = storage.getBoolean("account_status");
  const [accountStatus, setAccountStatus] = useState(false);
  useEffect(() => {
    setAccountStatus(approve);
  }, [profileData]);

  const [bookingData, setBookingData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setBtnPressed(bookingType || 1);
  }, [bookingType]);

  useEffect(() => {
    let status;
    if (btnPressed === 1) {
      status = "pending";
    } else if (btnPressed === 2) {
      status = "current";
    } else if (btnPressed === 3) {
      status = "completed";
    }

    if (status) {
      const filteredData = bookingsAll.filter(
        (booking) => booking.status === status
      );
      const sortedData = filteredData.sort(
        (a, b) => new Date(a.checkinDate) - new Date(b.checkinDate)
      );
      setBookingData(sortedData);
    }
  }, [btnPressed, bookingsAll]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(TabBarVisibility("flex"));
    });

    return unsubscribe;
  }, [navigation]);

  const bookingsHandler = (item) => {
    if (btnPressed === 1) {
      navigation.navigate("PendingBooking", { id: item.id });
    } else if (btnPressed === 2) {
      navigation.navigate("CurrentBooking", { id: item.id });
    } else if (btnPressed === 3) {
      navigation.navigate("PreviousBooking", { item: item });
    }
  };

  return (
    <>
      {!accountStatus ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <EmptyScreen
            headingText={
              "My trips will be shared once\nyour profile is approved"
            }
            backgroundColor={colors.primary}
            icon1Height={35}
            icon1Width={35}
            icon1Status
            icon1={images.BookingsIcon(true)}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <BackButton Text={"My Trips"} iconBackStatus={false} />
          <TabThreeBtn
            onpressOne={() => setBtnPressed(1)}
            onpressTwo={() => setBtnPressed(2)}
            onpressThree={() => setBtnPressed(3)}
            btnStatus={btnPressed}
            textOne={"Pending"}
            textTwo={"Upcoming or\nCurrent"}
            textThree={"Previous"}
          />
          {bookingData.length !== 0 ? (
            <>
              <BookingFlatListComponent
                itemData={bookingData}
                onCardClick={(item) => bookingsHandler(item)}
                requestedBy={true}
                requestedText={"Requested by"}
              />
            </>
          ) : (
            <View style={styles.mainContainer}>
              <EmptyScreenMessage
                headingText={"No bookings yet!"}
                buttonText={"Search"}
                icon1Status
                icon1={images.listingsHome()}
                onPressButton={() => navigation.navigate(FEED_STACK)}
              />
            </View>
          )}
          <View style={styles.chatButton}>
            <FloatingBtn
              unread={unreadMessageCount}
              unreadCount={unreadMessageCount}
              text={"Chat"}
              FloatingBtnHandler={() =>
                navigation.navigate("ChatStack", {
                  screen: "Inbox",
                  params: {
                    lastScreen: BOOKINGS_STACK,
                  },
                })
              }
            />
          </View>
        </View>
      )}
    </>
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
  chatButton: {
    position: "absolute",
    bottom: "3%",
    right: "5%",
  },
});

export default Bookings;
