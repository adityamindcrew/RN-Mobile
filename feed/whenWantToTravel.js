import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgXml } from "react-native-svg";
import images from "../../assets";
import * as Button from "../../components/Button";
import { CircularBtnIcon } from "../../components/Button";
import BackButton from "../../components/backButton";
import CalendarView from "../../components/calendarView";
import EmptyCard from "../../components/forms/emptyCard";
import HorizontalFlatlist from "../../components/horizontalFlatList";
import IncreDecreCompo from "../../components/increDecreComponent";
import TabCombineBtn from "../../components/tabCombineBtn";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { useDispatch, useSelector } from "react-redux";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import Seperator from "../../components/Seperator";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";
import {
  DATA,
  DAYDATA,
  MONTHSDATA,
  TRAVEL_TIME,
  WEEKSDATA,
} from "../../helpers/Constants";
import { FILTER_OBJ, MAP_LOCATION } from "../../redux/Type";
import {
  clearAllFilters,
  getFilteredList,
} from "../../redux/Actions/FeedActions";
import { FEED } from "../../navigation/RouteNames";
import PlusMinusIcon from "../../components/PlusMinusIcon";
import isEmptyObject from "../../utils/isObjectEmpty";

const WhenWantToTravel = ({ navigation }) => {
  const [btnPressed, setBtnPressed] = useState(true);
  const [increment, setIncrement] = useState(0);
  const [period, setPeriod] = useState({});
  const [daysSelection, setDaysSelection] = useState("Weeks");
  const [monthsArr, setMonthsArr] = useState([]);
  const [daysIn, setDaysIn] = useState("Exact dates");
  const { filterObj } = useSelector((state) => state.FeedReducer);
  const dispatch = useDispatch();

  const stayForSelection = (item) => {
    dispatch({
      type: FILTER_OBJ,
      payload: {
        ...filterObj,
        noOfDays: "",
        noOfWeekends: "",
        noOfMonths: "",
        noOfWeeks: "",
        startDate: "",
        endDate: "",
        travelTime: item,
        clearAll: false,
      },
    });
    setDaysSelection(item);
    setPeriod({});
    setIncrement(0);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => stayForSelection(item.value)}
        style={
          daysSelection === item.value
            ? [styles.FlatListCardMod, { padding: 8 }]
            : [styles.FlatListCard, { padding: 8 }]
        }
      >
        <Text
          style={
            daysSelection === item.value
              ? {
                  textAlign: "center",
                  color: colors.white,
                }
              : { textAlign: "center" }
          }
        >
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const handlerApplyFilter = () => {
    navigation.navigate("NumOfRooms");
    if (!isEmptyObject(period)) {
      const keys = Object.keys(period);

      const firstKey = keys[0];
      const lastKey = keys[keys.length - 1];
      const firstDate = new Date(firstKey);
      const lastDate = new Date(lastKey);

      const finalFirstDate = JSON.stringify(firstDate)
        .split("T")[0]
        .replace(/"/g, "");
      const finalLastDate = JSON.stringify(lastDate)
        .split("T")[0]
        .replace(/"/g, "");

      dispatch({
        type: FILTER_OBJ,
        payload: {
          ...filterObj,
          clearAll: false,
          startDate: finalFirstDate || "",
          endDate: finalLastDate || "",
          noOfWeekends: "",
          noOfMonths: "",
          noOfDays: "",
          noOfWeeks: "",
          travelTime:
            daysIn === "Exact dates"
              ? TRAVEL_TIME.EXACT_DATES
              : TRAVEL_TIME.RANDOM_DATES,
        },
      });
    }
  };

  const datesType = (item) => {
    setDaysIn(item);
    const keys = Object.keys(period);

    const firstKey = keys[0];
    const lastKey = keys[keys.length - 1];
    const firstDate = new Date(firstKey);
    const lastDate = new Date(lastKey);

    const finalFirstDate = JSON.stringify(firstDate)
      .split("T")[0]
      .replace(/"/g, "");
    const finalLastDate = JSON.stringify(lastDate)
      .split("T")[0]
      .replace(/"/g, "");

    dispatch({
      type: FILTER_OBJ,
      payload: {
        ...filterObj,
        clearAll: false,
        startDate: finalFirstDate || "",
        endDate: finalLastDate || "",
        noOfWeekends: "",
        noOfMonths: "",
        noOfDays: "",
        noOfWeeks: "",
        travelTime:
          item === "Exact dates"
            ? TRAVEL_TIME.EXACT_DATES
            : TRAVEL_TIME.RANDOM_DATES,
      },
    });
  };
  const renderItemDay = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => datesType(item.value)}
      style={
        daysIn === item.value ? styles.FlatListCardMod : styles.FlatListCard
      }
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingHorizontal: 5,
        }}
      >
        {index !== 0 && <PlusMinusIcon selected={daysIn === item.value} />}
        <Text
          style={
            daysIn === item.value
              ? {
                  textAlign: "center",
                  color: colors.white,
                }
              : { textAlign: "center" }
          }
        >
          {item.value}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const monthSelection = (item) => {
    if (monthsArr.includes(item.value)) {
      const arr = monthsArr.filter((month) => month !== item.value);
      setMonthsArr(arr);
      dispatch({
        type: FILTER_OBJ,
        payload: {
          ...filterObj,
          month: arr,
          startDate: "",
          endDate: "",
          clearAll: false,
        },
      });
    } else {
      const arr = [...monthsArr, item.value];
      setMonthsArr(arr);
      dispatch({
        type: FILTER_OBJ,
        payload: {
          ...filterObj,
          clearAll: false,
          month: arr,
          startDate: "",
          endDate: "",
        },
      });
    }
  };

  const renderItemMonths = ({ item, index }) => {
    const text = item.value.split(" ");
    return (
      <TouchableOpacity
        onPress={() => monthSelection(item)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          paddingHorizontal: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: monthsArr.includes(item.value)
            ? colors.black
            : colors.white,
        }}
      >
        <SvgXml style={{}} xml={images.MonthCalendarIcon()} />
        <View style={styles.textView}>
          <Text style={styles.textItem}>
            {text[0].slice(0, 3) + " " + text[1]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const numIncrementHandler = () => {
    setPeriod({});
    let updatedFilterObj = {
      ...filterObj,
      noOfWeekends: "",
      noOfMonths: "",
      noOfDays: "",
      noOfWeeks: "",
      startDate: "",
      endDate: "",
      clearAll: false,
    };

    if (daysSelection === "Months") {
      if (increment < 12) {
        setIncrement(increment + 1);
        updatedFilterObj.noOfMonths = increment + 1;
      }
    } else if (daysSelection === "Weekends") {
      setIncrement(increment + 1);
      updatedFilterObj.noOfWeekends = increment + 1;
    } else if (daysSelection === "Days") {
      if (increment < 31) {
        setIncrement(increment + 1);
        updatedFilterObj.noOfDays = increment + 1;
      }
    } else if (daysSelection === "Weeks") {
      if (increment < 52) {
        setIncrement(increment + 1);
        updatedFilterObj.noOfWeeks = increment + 1;
      }
    }
    dispatch({
      type: FILTER_OBJ,
      payload: updatedFilterObj,
    });
  };

  const numDecrementHandler = () => {
    setPeriod({});
    let updatedFilterObj = {
      ...filterObj,
      noOfWeekends: "",
      noOfMonths: "",
      noOfDays: "",
      noOfWeeks: "",
      startDate: "",
      endDate: "",
      clearAll: false,
    };

    if (daysSelection === "Months") {
      setIncrement(increment - 1);
      updatedFilterObj.noOfMonths = increment - 1;
    } else if (daysSelection === "Weekends") {
      setIncrement(increment - 1);
      updatedFilterObj.noOfWeekends = increment - 1;
    } else if (daysSelection === "Days") {
      setIncrement(increment - 1);
      updatedFilterObj.noOfDays = increment - 1;
    } else if (daysSelection === "Weeks") {
      setIncrement(increment - 1);
      updatedFilterObj.noOfWeeks = increment - 1;
    }

    dispatch({
      type: FILTER_OBJ,
      payload: updatedFilterObj,
    });
  };

  const monthNames = monthsArr.map((month) => {
    const monthWithoutYear = month.split(" ")[0];
    return monthWithoutYear;
  });

  const monthsString = monthNames.join(", ").toString();

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  const location =
    filterObj.city || filterObj.country
      ? filterObj.fullAddress
      : filterObj.continent || "";

  const maxLength = 15;

  const truncatedLocation =
    location.length > maxLength
      ? location.slice(0, maxLength) + "..."
      : location;

  return (
    <>
      <View style={styles.container}>
        <BackButton
          onPress={() => navigation.goBack()}
          Text={"When do you want to travel?"}
        />

        <TabCombineBtn
          onpressOne={() => setBtnPressed(true)}
          onpressTwo={() => setBtnPressed(false)}
          btnStatus={btnPressed}
          textOne={"Choose dates"}
          textTwo={"I’m flexible"}
        />
        <KeyboardAwareScrollView>
          <View style={styles.btnContainer}>
            <CircularBtnIcon
              rightText={truncatedLocation}
              onPress={() => navigateToScreen("WhereWantToTravel")}
              iconStatus
              icon={images.LocationIcon(colors.primary)}
              label={"Where do you want to travel?"}
              fontize={12}
            />
          </View>
          {btnPressed ? (
            <View style={{ width: "100%", alignSelf: "center", marginTop: 20 }}>
              <EmptyCard>
                <CalendarView
                  minDate={new Date()}
                  onChangePeriod={(r) => {
                    setPeriod(r), setIncrement(0), setMonthsArr([]);
                  }}
                  bottomLineStatus
                  // periods={}
                />
                <Seperator />
                <HorizontalFlatlist
                  renderItem={renderItemDay}
                  itemData={DAYDATA}
                  numOfColumns={4}
                />
                <Seperator />
              </EmptyCard>
            </View>
          ) : (
            <View style={{ width: "100%", alignSelf: "center" }}>
              <Seperator seperate={10} />
              <EmptyCard>
                <Seperator />
                <View style={{ marginLeft: 20 }}>
                  <Typography.H color={colors.grayText} fontSize={16}>
                    Stay for
                    <Typography.P color={colors.darkBlue} fontSize={16}>
                      {" "}
                      {daysSelection}
                    </Typography.P>
                  </Typography.H>
                </View>
                <Seperator />
                <HorizontalFlatlist
                  renderItem={renderItem}
                  itemData={WEEKSDATA}
                  numOfColumns={3}
                />
                <View style={{ marginLeft: 20, marginTop: 20 }}>
                  <Typography.H color={colors.grayText} fontSize={12}>
                    How many
                  </Typography.H>
                </View>
                <View style={styles.weeksView}>
                  <View style={{ marginLeft: 20, justifyContent: "center" }}>
                    <Text style={styles.weeksText}>{daysSelection}</Text>
                  </View>
                  <View style={{ marginRight: 10 }}>
                    <IncreDecreCompo
                      increment={() => numIncrementHandler()}
                      decrement={() => numDecrementHandler()}
                      value={increment}
                    />
                  </View>
                </View>
                <View style={{ marginLeft: 20, marginTop: 20 }}>
                  <Typography.H color={colors.grayText} fontSize={20}>
                    Go{" "}
                    <Typography.P color={colors.darkBlue} fontSize={16}>
                      {monthsString.length !== 0
                        ? monthsString.length <= 30
                          ? monthsString
                          : monthsString.substring(0, 30) + "..."
                        : "anytime"}
                    </Typography.P>
                  </Typography.H>
                </View>
                <View style={styles.saparator}></View>
                <HorizontalFlatlist
                  renderItem={renderItemMonths}
                  itemData={MONTHSDATA}
                  numOfColumns={12}
                />
                <Seperator seperate={10} />
              </EmptyCard>
            </View>
          )}
          <View style={styles.btnContainer}>
            <CircularBtnIcon
              onPress={() => navigateToScreen("NumOfRooms")}
              iconStatus
              rightText={
                filterObj.bedrooms > 1
                  ? filterObj.bedrooms + " bedrooms"
                  : filterObj.bedrooms + " bedroom"
              }
              icon={images.BedIcon(colors.primary)}
              label={"How many bedrooms?"}
              fontize={12}
            />
          </View>
        </KeyboardAwareScrollView>
        {/* <Button.BtnConfirmCancel
        onPressConfirm={() => Alert.alert("Under developement.")}
        onPressCancel={() => Alert.alert("Under developement.")}
        confirmTitle={"Search"}
        cancelTitle={"Clear all"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      /> */}
      </View>
      <Seperator />
      <Button.ConfirmCancelBtn
        position={"relative"}
        width={"100%"}
        onPressConfirm={() => handlerApplyFilter()}
        onPressCancel={() => {
          dispatch(clearAllFilters()),
            dispatch({
              type: MAP_LOCATION,
              payload: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
              },
            });
        }}
        confirmTitle={"Next"}
        cancelTitle={"Clear All"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      />
      <Seperator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistContainer: { width: "100%", alignSelf: "center", marginTop: 20 },
  textView: {
    alignSelf: "center",
    marginTop: 10,
  },
  FlatListCard: {
    justifyContent: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 4,
    borderRadius: 30,
    backgroundColor: colors.white,
    borderColor: colors.grayText,
    borderWidth: 1,
  },
  FlatListCardMod: {
    justifyContent: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 4,
    borderRadius: 30,
    backgroundColor: colors.darkBlue,
    borderColor: colors.grayText,
    borderWidth: 1,
  },
  weeksView: {
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 10,
    marginTop: 20,
  },
  weeksText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 19,
    color: colors.darkBlue,
  },
  textStyle: {
    fontWeight: "600",
    color: colors.darkBlue,
    fontSize: 14,
    lineHeight: 17,
  },
  itemCards: {
    height: 120,
    width: 120,
    borderColor: colors.grayText,
    borderWidth: 1,
    borderRadius: 18,
  },
  btnContainer: {
    alignSelf: "center",
    width: "90%",
    marginTop: 20,
  },
  textItem: {
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 15,
  },
  saparator: {
    marginTop: 10,
  },
});

export default WhenWantToTravel;
