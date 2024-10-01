import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import { CircularBtnIcon } from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import IncreDecreCompo from "../../components/increDecreComponent";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import { FILTER_OBJ } from "../../redux/Type";
import {
  clearAllFilters,
  getFilteredList,
} from "../../redux/Actions/FeedActions";
import { FEED } from "../../navigation/RouteNames";
import Seperator from "../../components/Seperator";
import formatDate from "../../utils/formatDate";
import { SvgXml } from "react-native-svg";
import dateSummary from "../../utils/dateSummary";
const NumOfRooms = ({ navigation }) => {
  const [increment, setIncrement] = useState(1);
  const { filterObj } = useSelector((state) => state.FeedReducer);

  const dispatch = useDispatch();

  const numIncrementHandler = () => {
    setIncrement(increment + 1);
    dispatch({
      type: FILTER_OBJ,
      payload: {
        ...filterObj,
        bedrooms: increment + 1,
        clearAll: false,
      },
    });
  };

  const numDecrementHandler = () => {
    setIncrement(increment - 1);
    dispatch({
      type: FILTER_OBJ,
      payload: {
        ...filterObj,
        bedrooms: increment - 1,
        clearAll: false,
      },
    });
  };

  const onPressSearch = () => {
    let continent = filterObj.continent;
    if (filterObj.continent === "USA") {
      continent = "North America";
    }
    if (filterObj.continent === "All") {
      continent = "all";
    }
    if (filterObj.continent === "Latin America") {
      continent = "South America";
    }
    let formdata = {
      bedrooms: filterObj.clearAll ? "any" : filterObj.bedrooms,
      city: filterObj.city,
      travelTime: filterObj.travelTime,
      startDate: filterObj.startDate,
      endDate: filterObj.endDate,
      noOfWeeks: filterObj.noOfWeeks,
      noOfWeekends: filterObj.noOfWeekends,
      noOfMonths: filterObj.noOfMonths,
      noOfDays: filterObj.noOfDays,
      month: filterObj.month,
      continent: continent,
      country: filterObj.country,
    };
    console.log(formdata);
    dispatch(getFilteredList(formdata));
    navigation.navigate(FEED);
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
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"How many bedrooms do you need?"}
      />
      <View style={styles.btnContainer}>
        <CircularBtnIcon
          onPress={() => navigation.navigate("WhereWantToTravel")}
          iconStatus
          icon={images.LocationIcon(colors.primary)}
          label={"Where do you want to travel?"}
          fontize={12}
          rightText={truncatedLocation}
        />
      </View>
      <View style={styles.btnContainer}>
        <CircularBtnIcon
          rightText={dateSummary(filterObj)}
          iconStatus
          icon={images.calendar(colors.primary)}
          label={"When do you want to travel?"}
          fontize={12}
          onPress={() => navigation.navigate("WhenWantToTravel")}
        />
      </View>
      <Seperator seperate={10} />
      <EmptyCard>
        <View style={styles.weeksView}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 15,
              gap: 10,
            }}
          >
            <SvgXml
              height={24}
              width={24}
              xml={images.BedIcon(colors.primary)}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.weeksText}>How many bedrooms?</Text>
            </View>
          </View>
          <View style={{ marginRight: 10 }}>
            <IncreDecreCompo
              increment={() => numIncrementHandler()}
              decrement={() => numDecrementHandler()}
              value={filterObj.bedrooms}
            />
          </View>
        </View>
      </EmptyCard>
      <Button.BtnConfirmCancel
        onPressConfirm={onPressSearch}
        onPressCancel={() => dispatch(clearAllFilters())}
        confirmTitle={"Search"}
        cancelTitle={"Clear all"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weeksView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderRadius: 20,
  },
  weeksText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 19,
    color: colors.darkBlue,
  },
  btnContainer: {
    alignSelf: "center",
    width: "90%",
    marginTop: 20,
  },
  horizontalLine: {
    height: 1,
    width: "90%",
    backgroundColor: colors.grayText,
    alignSelf: "center",
    marginTop: 10,
  },
  saparator: {
    marginTop: 20,
  },
});

export default NumOfRooms;
