import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import images from "../../assets";
import * as Button from "../../components/Button";
import { CircularBtnIcon } from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import HorizontalFlatlist from "../../components/horizontalFlatList";
import { SearchBar } from "../../components/searchBar";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllFilters,
  getFilteredList,
} from "../../redux/Actions/FeedActions";
import Seperator from "../../components/Seperator";
import Europe from "../../assets/Europe.png";
import USA from "../../assets/USA.png";
import LatinAmerica from "../../assets/LatinAmerica.png";
import World from "../../assets/World.png";
import { FILTER_OBJ, MAP_LOCATION } from "../../redux/Type";
import { FEED } from "../../navigation/RouteNames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import dateSummary from "../../utils/dateSummary";
const DATA = [
  {
    key: 1,
    value: "All",
    img: World,
  },
  {
    key: 2,
    value: "Europe",
    img: Europe,
  },
  {
    key: 3,
    value: "USA",
    img: USA,
  },
  {
    key: 4,
    value: "Latin America",
    img: LatinAmerica,
  },
];

const WhereWantToTravel = ({ navigation }) => {
  const [search, setSearchterm] = useState("");
  const dispatch = useDispatch();
  const { filterObj } = useSelector((state) => state.FeedReducer);

  let {
    bedrooms,
    city,
    endDate,
    month,
    noOfDays,
    noOfMonths,
    noOfWeekends,
    noOfWeeks,
    startDate,
    travelTime,
    continent,
  } = filterObj;

  const handlerApplyFilter = () => {
    navigation.navigate("WhenWantToTravel");
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const selectPlace = (name) => {
    if (name === "Europe") {
      dispatch({
        type: MAP_LOCATION,
        payload: {
          latitude: 49.29655796881099,
          longitude: 12.706360705196857,
          latitudeDelta: 30,
          longitudeDelta: 30,
        },
      });
    }
    if (name === "All") {
      dispatch({
        type: MAP_LOCATION,
        payload: {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        },
      });
    }
    if (name === "USA") {
      dispatch({
        type: MAP_LOCATION,
        payload: {
          latitude: 40.476554,
          longitude: -99.76995,
          latitudeDelta: 40,
          longitudeDelta: 40,
        },
      });
    }
    if (name === "Latin America") {
      dispatch({
        type: MAP_LOCATION,
        payload: {
          latitude: -11.980134,
          longitude: -58.238431,
          latitudeDelta: 50,
          longitudeDelta: 50,
        },
      });
    }
    dispatch({
      type: FILTER_OBJ,
      payload: {
        ...filterObj,
        city: "",
        country: "",
        continent: name,
        clearAll: false,
      },
    });
    navigation.navigate("WhenWantToTravel");
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => selectPlace(item.value)}
          style={{ margin: 10 }}
        >
          <Image
            style={[
              styles.itemCards,
              filterObj.continent === item.value && {
                borderWidth: 2,
                borderColor: colors.primary,
              },
            ]}
            source={item.img}
          />
          <View style={{ marginTop: 10 }}>
            <Text style={styles.textStyle}>{item.value}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <BackButton
          onPress={() => navigation.goBack()}
          Text={"Where do you want to travel?"}
        />
        {/* <TouchableOpacity onPress={() => navigation.navigate("SearchLocation")}> */}
        <SearchBar
          regions
          // editable={false}
          placeHolder={"Where do you want to travel?"}
          changeTextHanlder={setSearchterm}
          iconStatus={true}
          summaryStatus={false}
          // value={
          //   filterObj.city !== ""
          //     ? filterObj.city
          //     : filterObj.continent !== ""
          //     ? filterObj.continent
          //     : ""
          // }
          filterHandler={() => navigation.navigate("Filters")}
          onAddressChange={() => navigation.navigate("WhenWantToTravel")}
        />
        {/* </TouchableOpacity> */}
        <Seperator seperate={10} />
        <EmptyCard>
          <HorizontalFlatlist
            renderItem={renderItem}
            itemData={DATA}
            numOfColumns={10}
          />
        </EmptyCard>
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
        <View style={styles.btnContainer}>
          <CircularBtnIcon
            rightText={
              bedrooms > 1 ? bedrooms + " bedrooms" : bedrooms + " bedroom"
            }
            iconStatus
            icon={images.BedIcon(colors.primary)}
            label={"How many bedrooms?"}
            fontize={12}
            onPress={() => navigation.navigate("NumOfRooms")}
          />
        </View>
        <Button.BtnConfirmCancel
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
          cancelTitle={"Clear all"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default WhereWantToTravel;
