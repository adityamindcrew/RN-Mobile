import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import FlatListComponent from "../../components/FlatListCardComponent";
import TabThreeBtn from "../../components/TabThreeBtn";
import BackButton from "../../components/backButton";
import { FloatingBtn } from "../../components/floatingButton";
import ListingsFlatList from "../../components/listingsFlatList";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { GetReservationsList } from "../../redux/Actions/ReservationsAction";
import {
  addAmenties,
  getUserListing,
  guestPlaceType,
  placeDate,
  placeDesc,
  placeInfo,
  placeLocation,
  placePhoto,
  placePrice,
  placeTitle,
  placeType,
} from "../../redux/Actions/userListingAction";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import {
  BOOKINGS,
  BOOKINGS_STACK,
  BOTTOM_STACK,
  LISTINGS,
  LISTINGS_STACK,
} from "../../navigation/RouteNames";
import { storage } from "../../components/asyncStorageToken";
import FastImage from "react-native-fast-image";
import { STOCK_PHOTO } from "../../helpers/Constants";
import EmptyScreen from "../../components/EmptyScreenMessage";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { RefreshControl } from "react-native";
const Listing = ({ navigation, route }) => {
  const key = route?.params?.key || 1;
  const [btnPressed, setBtnPressed] = useState(1);
  const { userListing } = useSelector((state) => state.userListingReducer);
  const { reservationsAll, loading, reservationType } = useSelector(
    (state) => state.ReservationsReducer
  );
  const { unreadMessageCount } = useSelector((state) => state.FeedReducer);
  const { profileData } = useSelector((state) => state.AccountReducer);
  const approve = storage.getBoolean("account_status");
  const [accountStatus, setAccountStatus] = useState(false);
  useEffect(() => {
    setAccountStatus(approve);
  }, [profileData]);
  const [reservationData, setReservationData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const isFocused = useIsFocused();

  useEffect(() => {
    setBtnPressed(reservationType);
  }, [reservationType]);

  const dispatch = useDispatch();
  const cardClickHandler = (id, item) => {
    navigation.navigate("EditListings", { id: id, item });
  };

  let status;
  if (btnPressed === 1) {
    status = "pending";
  } else if (btnPressed === 2) {
    status = "accepted";
  } else if (btnPressed === 3) {
    status = "completed";
  }

  useEffect(() => {
    let sortedData;
    switch (status) {
      case "pending":
        sortedData = reservationsAll.filter(
          (item) =>
            (item.status === "pending" || item.status === "accepted") &&
            item.transactionDone == false
        );
        break;
      case "accepted":
        sortedData = reservationsAll.filter(
          (item) =>
            (item.status === "current" || item.status === "accepted") &&
            item.transactionDone == true
        );
        break;
      case "completed":
        sortedData = reservationsAll.filter(
          (item) => item.status === "completed"
        );
        break;
      default:
        break;
    }

    setReservationData(sortedData);
  }, [reservationsAll, btnPressed]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(TabBarVisibility("flex"));
    });

    return unsubscribe;
  }, [navigation]);

  const upComingReservationHandler = (item) => {
    if (item.type === "reservation") {
      if (btnPressed === 1) {
        navigation.navigate("ReservationRequest", { id: item.id });
      } else if (btnPressed === 2) {
        navigation.navigate("UpcomingReservation", { id: item.id });
      } else if (btnPressed === 3) {
        navigation.navigate("PreviousReservation", { id: item.id });
      }
    } else {
      navigation.navigate("InstantPreview", {
        id: item.id,
        isPrevious: btnPressed === 3,
      });
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [
      //       {
      //         name: "ChatStack",
      //         state: {
      //           routes: [
      //             {
      //               name: BOTTOM_STACK,
      //               state: {
      //                 routes: [
      //                   {
      //                     name: BOOKINGS_STACK,
      //                     state: {
      //                       routes: [
      //                         {
      //                           name: "CurrentBooking",
      //                           params: {
      //                             data: item,
      //                           },
      //                         },
      //                       ],
      //                     },
      //                   },
      //                 ],
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     ],
      //   })
      // );
    }
  };

  const openDraft = () => {
    const minusOne = { placeType: draftData.type };
    dispatch(placeType(minusOne));
    const zero = { selection: draftData.selection };
    dispatch(guestPlaceType(zero));
    const one = {
      country: draftData.country,
      city: draftData.city,
      streetAddress: draftData.streetAddress,
      zipCode: draftData.zipCode,
      lat: draftData.latitude,
      lng: draftData.longitude,
      apartment: draftData.apartment,
    };
    dispatch(placeLocation(one));
    const infoArr = [];
    infoArr.push({ name: draftData.guests + " " + "guests" });
    infoArr.push({ name: draftData.bedrooms + " " + "bedrooms" });
    infoArr.push({ name: draftData.bathrooms + " " + "bathrooms" });
    infoArr.push({ name: draftData.beds + " " + "beds" });

    const two = {
      infoArr,
      guestIncrement: draftData.guests,
      bedroomsIncrement: draftData.bedrooms,
      bathroomIncrement: draftData.bathrooms,
      bedsIncrement: draftData.beds,
    };
    dispatch(placeInfo(two));
    const three = {
      selectedItems: draftData.amenities,
      selectedItemsAdditional: draftData.additionalAmenities,
    };
    dispatch(addAmenties(three));
    const arr = [...draftData.images];
    const four = { image: arr };
    dispatch(placePhoto(four));
    const five = { title: draftData.title };
    dispatch(placeTitle(five));
    const six = { placdeDesc: draftData.description };
    dispatch(placeDesc(six));
    const objectToAdd = {
      price: draftData.price,
      currency: draftData.currency,
    };
    dispatch(placePrice(objectToAdd));
    const seven = {
      period: draftData.availabilityDateRanges,
      instant: draftData.instantBookingAllowed,
      manual: draftData.manualBookingAllowed,
    };
    dispatch(placeDate(seven));
    navigation.navigate(draftData.lastScreen);
  };

  const onRefresh = React.useCallback(() => {
    dispatch(GetReservationsList());
    dispatch(getUserListing());

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <>
      {!accountStatus ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <EmptyScreen
            headingText={
              "My home will be shared once\nyour profile is approved"
            }
            icon1Height={35}
            icon1Width={35}
            backgroundColor={colors.primary}
            icon1Status
            icon1={images.Listings(true)}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <BackButton
            Text={"My Home"}
            buttonText={"Add home"}
            onPressButton={() => navigation.navigate("LetsStart")}
            buttonStatus={true}
            iconBackStatus={false}
          />
          {userListing.length === 0 &&
          (draftData?.visibilityStatus === undefined ||
            !draftData?.visibilityStatus) &&
          draftData?.userId !== profileData?.id ? (
            <View style={styles.mainContainer}>
              <EmptyScreenMessage
                headingText={"Nothing published yet!"}
                buttonText={"Add my home"}
                icon1Status
                icon1={images.listingsHome()}
                icon2={images.PlusIcon(colors.white)}
                icon2Status
                onPressButton={() => navigation.navigate("LetsStart")}
              />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  tintColor={colors.primary}
                  title="Refreshing"
                  titleColor={colors.black}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              contentContainerStyle={{ paddingBottom: "5%" }}
            >
              <View style={styles.headingView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={18}
                  fontweight={700}
                >
                  Homes
                </Typography.ChileLine>
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate("LetsStart")}
                  style={styles.iconView}
                >
                  <SvgXml
                    width={24}
                    height={24}
                    xml={images.PlusIcon(colors.primary)}
                  />
                </TouchableOpacity> */}
              </View>
              {draftData?.visibilityStatus !== undefined &&
                draftData?.visibilityStatus &&
                draftData?.userId === profileData?.id && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      padding: 10,
                      width: "90%",
                      alignSelf: "center",
                      marginTop: 20,
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={openDraft}
                  >
                    <FastImage
                      source={{
                        uri: draftData?.images[0]?.uri
                          ? draftData?.images[0]?.uri
                          : STOCK_PHOTO,
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 8,
                        marginRight: 16,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: colors.darkBlue,
                          lineHeight: 22,
                          maxWidth: 280,
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {!!draftData?.title
                          ? draftData?.title
                          : draftData?.city
                          ? draftData?.city + ", " + draftData?.country
                          : "Drafted Listing"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: colors.primary,
                          lineHeight: 22,
                          maxWidth: 280,
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        In Progress
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.darkgray,
                        height: 24,
                        width: 24,
                        borderRadius: 12,
                      }}
                    >
                      <SvgXml xml={images.RightArrow()} />
                    </View>
                  </TouchableOpacity>
                )}
              <ListingsFlatList
                itemData={userListing}
                onCardClick={(id, item) => cardClickHandler(id, item)}
              />
              <View style={styles.saparatorBig} />
              <View style={styles.headingView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={18}
                  fontweight={700}
                >
                  Reservations
                </Typography.ChileLine>
              </View>
              <View style={styles.saparator} />
              <TabThreeBtn
                onpressOne={() => setBtnPressed(1)}
                onpressTwo={() => setBtnPressed(2)}
                onpressThree={() => setBtnPressed(3)}
                btnStatus={btnPressed}
                textOne={"Requests"}
                textTwo={"Upcoming or\nCurrent"}
                textThree={"Previous"}
              />
              {reservationData?.length !== 0 ? (
                <FlatListComponent
                  itemData={reservationData}
                  onCardClick={(item) => upComingReservationHandler(item)}
                  requestedBy={true}
                  requestedText={"Requested by"}
                />
              ) : (
                <View style={{ alignSelf: "center", marginTop: 30 }}>
                  <Text>No reservations found</Text>
                </View>
              )}
            </ScrollView>
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
                    lastScreen: LISTINGS_STACK,
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
  headingView: {
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatButton: {
    position: "absolute",
    bottom: "3%",
    right: "5%",
  },
  saparator: {
    marginTop: 10,
  },
  saparatorBig: {
    marginTop: 30,
  },
  iconView: {
    marginRight: 30,
    alignSelf: "center",
  },
});

export default Listing;
