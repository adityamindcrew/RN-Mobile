import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets";
import EmptyCard from "../../components/forms/emptyCard";
import HorizontalFlatlist from "../../components/horizontalFlatList";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import moment from "moment";
import mapStyle from "../../../mapStyle.json";
import {
  BtnCirclePrimary,
  BtnContain,
  BtnPrimary,
  CircularBtnIcon,
  ConfirmCancelBtn,
} from "../../components/Button";
import Seperator from "../../components/Seperator";
import currencyList from "../../../Currencies.json";
import { STOCK_PHOTO } from "../../helpers/Constants";
import FastImage from "react-native-fast-image";
import Slider from "../../components/ImageCarousel/Slider";
import {
  LISTINGS_STACK,
  OTHER_USER_PROFILE,
} from "../../navigation/RouteNames";
import formatDate from "../../utils/formatDate";
import featuresText from "../../utils/featuresText";
import CalendarView from "../../components/calendarView";
import getUpcomingDateRange from "../../utils/getUpcomingDateRange";
import findMaxDate from "../../utils/findMaxDate";
import obtainDateRanges from "../../utils/obtainDateRanges";
import checkDateContainment from "../../utils/checkDateContainment";
import priceFormat from "../../utils/priceFormat";
import { INFO_FOR_GUESTS } from "../../redux/Type";
import { TouchableWithoutFeedback } from "react-native";
import HomeDetails from "../../components/HomeDetails";
import AboutHome from "../../components/AboutHome";
import ApartmentMapLocation from "../../components/ApartmentMapLocation";
import PlaceOffersAmenities from "../../components/PlaceOffersAmenities";
import getAvailableRanges from "../../utils/getAvailableRanges";

const profileImages = [
  "https://www.w3schools.com/howto/img_avatar.png",
  "https://www.w3schools.com/howto/img_avatar2.png",
  "https://www.w3schools.com/w3images/avatar5.png",
];

const facilities = [
  {
    key: 1,
    value: "2 beds",
  },
  {
    key: 2,
    value: "1 bath",
  },
  {
    key: 3,
    value: "Wifi Excellent",
  },
  {
    key: 4,
    value: "Pets Ok",
  },
];
const FeedSummary = ({ navigation, route }) => {
  const summary = route.params.summary;
  const [dates, setDates] = useState("");
  const [openCalender, setOpenCalender] = useState(false);
  const address = summary.city + ", " + summary.country;
  const amenities = summary.amenities.concat(summary.additionalAmenities);
  const [placeImages, setPlaceImages] = useState(summary.images || []);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [currencyCode, setCurrencyCode] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [houseRules, setHouseRules] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateSelected, setDateSelected] = useState([]);
  const [dateDifference, setDateDifference] = useState(0);
  const scrollViewRef = useRef();
  const [dateRanges, setDateRanges] = useState({});
  const [maxEnd, setMaxEnd] = useState("");
  const [minStart, setMinStart] = useState("");
  const [period, setPeriod] = useState({});

  const { feedList } = useSelector((state) => state.FeedReducer);

  useEffect(() => {
    const nextDateRange = getUpcomingDateRange(summary);
    const maxEndDate = findMaxDate(summary.availabilityDateRanges);
    const disabledDates = obtainDateRanges(summary.availabilityDateRanges);
    setDateRanges(disabledDates);
    setMaxEnd(maxEndDate);
    setDates(nextDateRange);
    setMinStart(nextDateRange?.start);
  }, [summary.availabilityDateRanges]);

  useEffect(() => {
    let currencyType = currencyList.filter(
      (res) => res.currencyCode == summary.currency
    );
    setCurrencyCode(currencyType[0].symbol);
    let positionedPhotos = summary.images.sort(
      (a, b) => a.position - b.position
    );

    setPlaceImages(positionedPhotos);
  }, [feedList]);

  const ameni = summary.amenities.map((res) => res.amenityId.name);
  const addAmeni = summary.additionalAmenities.map(
    (res) => res.additionalAmenityId.name
  );

  let allAmenities = summary.amenities.concat(summary.additionalAmenities);
  let everyAmeniArr = [
    ...[
      summary.bathrooms + " " + "guests",
      summary.bedrooms + " " + "bedrooms",
      summary.beds + " " + "beds",
      summary.guests + " " + "bathrooms",
    ],
  ];

  let availabilityStartDay = moment(
    summary.availabilityDateRanges[0].start
  ).format("DD");
  let availabilityStartMonth = moment(
    summary.availabilityDateRanges[0].start
  ).format("MMM");

  let availabilityEndDay = moment(summary.availabilityDateRanges[0].end).format(
    "DD"
  );
  let availabilityEndMonth = moment(
    summary.availabilityDateRanges[0].end
  ).format("MMM");

  const sliceAmenities = () => {
    setShowAll(true);
  };

  const showAllAmenities = () => {
    const amenitiesToDisplay = showAll
      ? allAmenities
      : allAmenities.slice(0, 5);

    return amenitiesToDisplay.map((data) => {
      let uri = "";
      if (data.amenityId) {
        uri = data.amenityId.uri;
      } else if (data.additionalAmenityId) {
        uri = data.additionalAmenityId.uri;
      }
      let name = "";
      if (data.amenityId) {
        name = data.amenityId.name;
      } else if (data.additionalAmenityId) {
        name = data.additionalAmenityId.name;
      }
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginVertical: 5,
          }}
        >
          <FastImage style={{ height: 24, width: 24 }} source={{ uri: uri }} />
          <Text style={[styles.houseText, { fontSize: 14 }]}>{name}</Text>
        </View>
      );
    });
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  // const featuresText = (mergedArray) => {
  //   return (
  //     <View style={styles.cardHeadingTextContainer}>
  //       <Text
  //         style={[
  //           styles.cardHeadingTextContainerDes,
  //           { color: colors.grayText, lineHeight: 22, fontSize: 16 },
  //         ]}
  //       >
  //         {mergedArray.join(" | ")}
  //       </Text>
  //     </View>
  //   );
  // };

  const renderItem = ({ item, index }) => {
    let name = "";
    if (item.amenityId) {
      name = item.amenityId.name;
    } else if (item.additionalAmenityId) {
      name = item.additionalAmenityId.name;
    }

    return (
      <View style={styles.flatListContainer}>
        <Text style={styles.flatListItemView}>{name}</Text>
        <View style={styles.horizontalFlatListBar} />
      </View>
    );
  };

  const manipulateCalendar = (d) => {
    if (d.selectedFullDates.length === 1) {
      const blockDates = checkDateContainment({
        dates: summary.availabilityDateRanges,
        currentDate: d.selectedFullDates[0],
      });
      const startDate = moment(blockDates[0]?.start).isBefore(moment(), "day")
        ? moment().format("YYYY-MM-DD")
        : blockDates[0]?.start;
      setMinStart(startDate);
      setMaxEnd(blockDates[0]?.end);
    }
    if (d.selectedFullDates.length === 2) {
      const maxEndDate = findMaxDate(summary.availabilityDateRanges);
      const nextDateRange = getUpcomingDateRange(summary);
      setMinStart(nextDateRange?.start);
      setMaxEnd(maxEndDate);
    }
    setDateDifference(d.difference);
    setDateSelected(d.selectedDates);
    setSelectedDates(d.selectedFullDates);
  };

  const initialRegion = {
    latitude: summary.latitude,
    longitude: summary.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        >
          <SvgXml xml={images.backArrow()} />
        </TouchableOpacity>
        <Slider
          height={300}
          images={
            placeImages.length !== 0 ? placeImages : [{ uri: STOCK_PHOTO }]
          }
        />

        <Seperator />
        <EmptyCard>
          <View style={{ padding: 20 }}>
            {/* <View style={styles.title}> */}
            <Typography.H color={colors.darkBlue} fontsize={18}>
              {summary.title}
            </Typography.H>
            {/* </View> */}
            {/* <View style={styles.locationView}> */}
            <Typography.ChileLine color={colors.grayText} size={14}>
              {address}
            </Typography.ChileLine>
            {/* </View> */}
          </View>
        </EmptyCard>
        <View style={styles.saparator} />
        <HomeDetails
          selection={summary.selection}
          firstName={summary.userId.firstName}
          type={summary.type}
          personalImgs={summary.userId.personalImgs}
          amenities={everyAmeniArr}
          onPress={() =>
            navigation.navigate(OTHER_USER_PROFILE, {
              userId: summary.userId,
            })
          }
        />
        {/* <Seperator />
        <EmptyCard>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: summary.userId,
              })
            }
            style={styles.userDesCard}
          >
            <View style={styles.textStyle}>
              <Typography.H color={colors.darkBlue} fontsize={18}>
                {summary.selection == "Entire"
                  ? `Entire ${summary.type.toLowerCase()}, hosted by ${
                      summary.userId.firstName
                    }`
                  : summary.selection == "Shared"
                  ? `Shared room in ${summary.type.toLowerCase()}, hosted by ${
                      summary.userId.firstName
                    }`
                  : `Private room in ${summary.type.toLowerCase()}, hosted by ${
                      summary.userId.firstName
                    }`}
              </Typography.H>
            </View>
            <FastImage
              style={styles.userImg}
              source={{
                uri:
                  summary.userId.personalImgs.length > 0
                    ? summary.userId.personalImgs[0].uri
                    : STOCK_PHOTO,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(OTHER_USER_PROFILE, {
                userId: summary.userId,
              })
            }
            style={{ marginLeft: 5 }}
          >
            {featuresText(everyAmeniArr)}
          </TouchableOpacity>
          <View style={styles.saparator} />
          {summary.selection == "Private" && (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(OTHER_USER_PROFILE, {
                    userId: summary.userId,
                  })
                }
                style={styles.horizontalLine}
              />
              <Seperator />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(OTHER_USER_PROFILE, {
                    userId: summary.userId,
                  })
                }
                style={styles.propertyType}
              >
                <SvgXml
                  style={{ alignSelf: "center" }}
                  width={24}
                  height={24}
                  xml={images.SaparateRoomIcon()}
                />
                <View style={{ marginLeft: 20 }}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={700}
                  >
                    A private room
                  </Typography.ChileLine>
                  <Text style={styles.houseText}>
                    you will sleep in a private room but some areas may be
                    shared with you or others
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          {summary.selection == "Shared" && (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(OTHER_USER_PROFILE, {
                    userId: summary.userId,
                  })
                }
                style={styles.horizontalLine}
              />
              <Seperator />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(OTHER_USER_PROFILE, {
                    userId: summary.userId,
                  })
                }
                style={styles.propertyType}
              >
                <SvgXml
                  style={{ alignSelf: "center" }}
                  width={24}
                  height={24}
                  xml={images.SharedRoomIcon()}
                />
                <View style={{ marginLeft: 20 }}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={700}
                  >
                    A shared room
                  </Typography.ChileLine>
                  <Text style={styles.houseText}>
                    you will sleep in a room or common area that may be shared
                    with you or others
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          {summary.selection == "Entire" && (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(OTHER_USER_PROFILE, {
                    userId: summary.userId,
                  })
                }
                style={styles.horizontalLine}
              />
              <Seperator />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(OTHER_USER_PROFILE, {
                    userId: summary.userId,
                  })
                }
                style={styles.propertyType}
              >
                <SvgXml
                  style={{ alignSelf: "center" }}
                  width={24}
                  height={24}
                  xml={images.HouseIcon()}
                />
                <View style={{ marginLeft: 20 }}>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    size={14}
                    fontweight={700}
                  >
                    An entire place
                  </Typography.ChileLine>
                  <Text style={styles.houseText}>
                    you will have the whole place to yourself
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          <Seperator seperate={10} />
        </EmptyCard> */}
        <View style={styles.saparator} />
        {summary.description && (
          <>
            <AboutHome description={summary.description} />
            <View style={styles.saparator} />
          </>
        )}
        {/* 
        {summary.description && (
          <>
            <EmptyCard>
              <View style={styles.apartmentDes}>
                <Typography.H color={colors.darkBlue} fontsize={16}>
                  About apartment
                </Typography.H>
                <Seperator />
                <Text
                  style={{
                    color: colors.grayText,
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 22,
                  }}
                >
                  {summary.description}
                </Text>
              </View>
            </EmptyCard>
            <View style={styles.saparator} />
          </>
        )} */}

        <ApartmentMapLocation
          latitude={summary?.latitude}
          longitude={summary?.longitude}
          address={address}
        />

        {/* <EmptyCard>
          <View style={styles.apartmentDes}>
            <Typography.H color={colors.darkBlue} fontsize={16}>
              Apartment location
            </Typography.H>
            <Text style={styles.houseText}>Exact location after booking</Text>
          </View>
          <MapView
            style={styles.map}
            ref={mapRef}
            initialRegion={initialRegion}
            onRegionChangeComplete={(region) => {
              mapRef.current.__lastRegion = region;
            }}
            // customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={{
                latitude: summary.latitude,
                longitude: summary.longitude,
              }}
            ></Marker>
          </MapView>
          <View style={styles.apartmentDes}>
            <Typography.H color={colors.darkBlue} fontsize={16}>
              {address}
            </Typography.H>
          </View>
        </EmptyCard> */}

        {allAmenities.length !== 0 && (
          <>
            <View style={styles.saparator} />
            <PlaceOffersAmenities allAmenities={allAmenities} />
          </>
        )}

        {/* {allAmenities.length !== 0 && (
          <>
            <View style={styles.saparator} />

            <EmptyCard>
              <View style={styles.apartmentDes}>
                <Typography.H color={colors.darkBlue} fontsize={16}>
                  What this place offers?
                </Typography.H>
                <Seperator seperate={3} />
                {showAllAmenities()}
                {allAmenities.length >= 5 && !showAll && (
                  <>
                    <Seperator seperate={10} />
                    <BtnContain
                      label={`Show all ${allAmenities.length} amenities`}
                      color={colors.darkBlue}
                      labelcolor="white"
                      onPress={sliceAmenities}
                    />
                  </>
                )}
              </View>
            </EmptyCard>
          </>
        )} */}
        <View style={styles.saparator} />

        <EmptyCard>
          <TouchableOpacity
            onPress={() => setOpenCalender(!openCalender)}
            style={[
              styles.apartmentDes,
              {
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <View>
              <Typography.ChileLine
                color={colors.darkBlue}
                fontweight={500}
                fontsize={16}
              >
                Availability
              </Typography.ChileLine>
              <Text style={styles.houseText}>
                {selectedDates.length !== 0
                  ? formatDate(selectedDates[0], selectedDates[1])
                  : getAvailableRanges(summary.availabilityDateRanges)}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.darkgray,
                padding: 10,
                borderRadius: 30,
              }}
            >
              <SvgXml xml={images.RightArrow(colors.black)} />
            </TouchableOpacity>
          </TouchableOpacity>
        </EmptyCard>
        {openCalender && (
          <View
            onLayout={(item) =>
              scrollViewRef.current.scrollTo({
                y: item.nativeEvent.layout.y,
                animated: true,
              })
            }
            style={{ width: "90%", alignSelf: "center" }}
          >
            <Seperator />
            <CalendarView
              minDate={minStart}
              maxDate={maxEnd}
              initialDate={moment(dates.start).format("YYYY-MM-DD")}
              onChangePeriod={setPeriod}
              periods={dateRanges}
              onChangeDate={manipulateCalendar}
            />
          </View>
        )}
        {/* {summary.houseRules && (
          <>
            <View style={styles.saparator} />
            <EmptyCard>
              <TouchableOpacity
                onPress={() => {
                  dispatch({
                    type: INFO_FOR_GUESTS,
                    payload: {
                      wifiName:
                        summary.wifiName !== "null" ? summary.wifiName : "",
                      wifiPassword:
                        summary.wifiPassword !== "null"
                          ? summary.wifiPassword
                          : "",
                      checkinInfo:
                        summary.checkinInfo !== "null"
                          ? summary.checkinInfo
                          : "",
                      houseRules:
                        summary.houseRules !== "null" ? summary.houseRules : "",
                      houseManual:
                        summary.houseManual !== "null"
                          ? summary.houseManual
                          : "",
                    },
                  });
                  navigation.navigate("InfoForGuestsPreview");
                }}
                style={[
                  styles.apartmentDes,
                  {
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <View>
                  <Typography.ChileLine
                    color={colors.darkBlue}
                    fontweight={500}
                    fontsize={16}
                  >
                    House rules
                  </Typography.ChileLine>
                  {houseRules && (
                    <>
                      <Seperator />
                      <Text style={styles.houseText}>{summary.houseRules}</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.darkgray,
                    padding: 10,
                    borderRadius: 30,
                  }}
                >
                  <SvgXml xml={images.RightArrow(colors.black)} />
                </TouchableOpacity>
              </TouchableOpacity>
            </EmptyCard>
          </>
        )} */}
        {(summary.houseRules ||
          summary.wifiName ||
          summary.wifiPassword ||
          summary.checkinInfo ||
          summary.houseManual) && (
          <>
            <Seperator />
            <EmptyCard>
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch({
                    type: INFO_FOR_GUESTS,
                    payload: {
                      wifiName:
                        summary.wifiName !== "null" ? summary.wifiName : "",
                      wifiPassword:
                        summary.wifiPassword !== "null"
                          ? summary.wifiPassword
                          : "",
                      checkinInfo:
                        summary.checkinInfo !== "null"
                          ? summary.checkinInfo
                          : "",
                      houseRules:
                        summary.houseRules !== "null" ? summary.houseRules : "",
                      houseManual:
                        summary.houseManual !== "null"
                          ? summary.houseManual
                          : "",
                    },
                  });
                  navigation.navigate("InfoForGuestsPreview");
                }}
              >
                <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
                  <CircularBtnIcon
                    onPress={() => {
                      dispatch({
                        type: INFO_FOR_GUESTS,
                        payload: {
                          wifiName:
                            summary.wifiName !== "null" ? summary.wifiName : "",
                          wifiPassword:
                            summary.wifiPassword !== "null"
                              ? summary.wifiPassword
                              : "",
                          checkinInfo:
                            summary.checkinInfo !== "null"
                              ? summary.checkinInfo
                              : "",
                          houseRules:
                            summary.houseRules !== "null"
                              ? summary.houseRules
                              : "",
                          houseManual:
                            summary.houseManual !== "null"
                              ? summary.houseManual
                              : "",
                        },
                      });
                      navigation.navigate("InfoForGuestsPreview");
                    }}
                    iconStatus
                    icon={images.InfoIcon(colors.primary)}
                    label={"Info for guests"}
                    rightArrowIconStatus
                    fontize={18}
                    fontWeight={"bold"}
                  />
                  <View style={{ width: "90%" }}>
                    <Typography.HH>
                      This includes Check-in instructions, Wifi details, House
                      Manual, and House Rules
                    </Typography.HH>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </EmptyCard>
          </>
        )}
        <Seperator />
        <EmptyCard>
          <View
            style={{
              paddingVertical: 22,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography.H color={colors.darkBlue} fontsize={16}>
              Per Night
            </Typography.H>
            <Text style={styles.priceText}>{`${currencyCode}${priceFormat(
              summary.price + Number(summary.guestFees)
            )}`}</Text>
          </View>
        </EmptyCard>
        <Seperator seperate={10} />
        <View
          style={{
            alignSelf: "flex-end",
          }}
        >
          {summary.instantBookingAllowed && (
            <ConfirmCancelBtn
              position={"relative"}
              onPressConfirm={() =>
                navigation.navigate("ConfrimAndPay", {
                  summary,
                  type: "Book",
                  dateSelect: {
                    selectedDates,
                    dateSelected,
                    dateDifference,
                    dateRanges,
                    startDate: minStart,
                    endDate: maxEnd,
                    period,
                  },
                })
              }
              confirmTitle={"Reserve"}
              // cancelTitle={"Back"}
              cancelButtonColor={colors.white}
              cancelTextColor={colors.darkBlue}
            />
          )}
          {summary.manualBookingAllowed && (
            <ConfirmCancelBtn
              position={"relative"}
              onPressConfirm={() =>
                navigation.navigate("ConfrimAndPay", {
                  summary,
                  type: "Reserve",
                  dateSelect: {
                    selectedDates,
                    dateSelected,
                    dateDifference,
                    dateRanges,
                    period,
                  },
                })
              }
              confirmTitle={"Request to Book"}
              // cancelTitle={"Back"}
              cancelButtonColor={colors.white}
              cancelTextColor={colors.darkBlue}
            />
          )}
        </View>
        <Seperator seperate={10} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginVertical: 3,
    marginLeft: 10,
    padding: 10,
  },
  map: {
    height: 200,
    width: "90%",
    alignSelf: "center",
  },
  propertyType: {
    marginLeft: 20,
    flexDirection: "row",
  },
  saparator: {
    marginTop: 10,
  },
  locationView: { marginLeft: 20, bottom: 20, marginTop: 10 },
  houseText: {
    color: colors.grayText,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
    maxWidth: 280,
  },
  horizontalLine: {
    height: 1,
    width: "90%",
    backgroundColor: colors.grayText,
    alignSelf: "center",
  },
  userDesCard: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  horizontalFlatListBar: {
    height: 20,
    width: 1,
    backgroundColor: colors.grayText,
    alignSelf: "center",
    marginLeft: 10,
    bottom: 5,
  },
  flatListContainer: { margin: 5, alignSelf: "center", flexDirection: "row" },
  flatListItemView: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  userImg: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
  },
  textStyle: {
    maxWidth: 250,
  },
  apartmentDes: {
    // marginLeft: 20,
    // marginTop: 30,
    // bottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  backIcon: {
    position: "absolute",
    left: "3%",
    top: "1%",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 13,
    zIndex: 5,
  },
  cardHeadingTextContainer: {
    flexDirection: "row",
    gap: 10,
    paddingLeft: 10,
  },
  cardHeadingTextContainerDes: {
    fontSize: 14,
    fontWeight: 500,
  },
  priceText: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "700",
  },
});

export default FeedSummary;
