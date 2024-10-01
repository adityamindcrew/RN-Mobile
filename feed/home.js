import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import SliderView from "../../components/feedCard";
import { FloatingBtn } from "../../components/floatingButton";
import { SearchBar } from "../../components/searchBar";
import colors from "../../config/colors";
import { STOCK_PHOTO } from "../../helpers/Constants";
import Seperator from "../../components/Seperator";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import { FILTER_OBJ } from "../../redux/Type";
import { GetFeedList, getFilteredList } from "../../redux/Actions/FeedActions";
import images from "../../assets/index";
import EmptyScreen from "../../components/EmptyScreenMessage";
import { storage } from "../../components/asyncStorageToken";
import moment from "moment";
import getUpcomingDateRange from "../../utils/getUpcomingDateRange";
import Maps from "./maps";

const HomeFeed = ({ navigation }) => {
  const [search, setSearchterm] = useState(false);
  const [itemSelected, setItemSelected] = useState(0);
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.AccountReducer);
  const [accountStatus, setAccountStatus] = useState(false);
  const [mapsShow, setMapShow] = useState(false);
  useEffect(() => {
    const approve = storage.getBoolean("account_status");
    setAccountStatus(approve);
  }, [profileData]);
  const { feedList, filterObj, relevantSearch, loading } = useSelector(
    (state) => state.FeedReducer
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const flatListRef = useRef();

  // console.log(
  //   require("file:///Users/muhammadtahir/Library/Developer/CoreSimulator/Devices/DE080DA0-B34A-49DF-B35D-9251293D0D3A/data/Containers/Data/Application/8DBEE101-B3CF-4EBF-A865-A64BC7D0A32B/tmp/CF7C1629-6FB7-4F37-B3F3-17AC9C5136A4.jpg")
  // );

  const onRefresh = React.useCallback(() => {
    dispatch(GetFeedList(navigation));
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // useEffect(() => {
  //   // console.log(storage.getString("user_token"));
  //   // storage.clearAll();
  // }, []);

  useEffect(() => {
    // console.log(
    //   Platform.OS === "ios" ? storage.getString("user_token") : "sdfg"
    // );
    // storage.clearAll();
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [feedList]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(TabBarVisibility("flex"));
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!mapsShow) {
      dispatch(TabBarVisibility("flex"));
    } else {
      dispatch(TabBarVisibility("none"));
    }
  }, [mapsShow]);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => selectCity(item.value, index)}>
        <View
          style={index === itemSelected ? styles.bgItem : styles.selectedBgItem}
        >
          <Text
            style={
              index === itemSelected ? styles.ItemText : styles.ItemTextSelected
            }
          >
            {item.value}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const selectCity = async (city, index) => {
    setItemSelected(index);
    dispatch({
      type: FILTER_OBJ,
      payload: {
        ...filterObj,
        city: city === "All" ? "" : city,
        clearAll: false,
      },
    });
    let formdata = {
      ...filterObj,
      city: city === "All" ? "" : city,
    };
    dispatch(getFilteredList(formdata));
  };

  return (
    <>
      {!mapsShow ? (
        !accountStatus ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <EmptyScreen
              backgroundColor={colors.primary}
              headingText={
                "Explore will be shared once\nyour profile is approved"
              }
              icon1Status
              icon1Height={35}
              icon1Width={35}
              icon1={images.FeedIcon(true)}
            />
          </View>
        ) : (
          <View
            style={[styles.container, { display: !mapsShow ? "flex" : "none" }]}
          >
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("WhereWantToTravel")}
              >
                <SearchBar
                  placeHolder={"Where do you want to travel?"}
                  changeTextHanlder={setSearchterm}
                  valueChange={
                    filterObj.city
                      ? filterObj.fullAddress
                      : filterObj.continent || ""
                  }
                  iconStatus={true}
                  searchHandler={() => Alert.alert("Under development.")}
                  filterHandler={() => navigation.navigate("Filters")}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
            <Seperator />
            {relevantSearch && (
              <>
                <Seperator />
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 12,
                    lineHeight: 22,
                    paddingHorizontal: 20,
                    textAlign: "center",
                  }}
                >
                  Currently, no homes match your exact search. Here are some
                  homes that may be relevant
                </Text>
              </>
            )}
            {feedList.length !== 0 ? (
              <FlatList
                ref={flatListRef}
                refreshControl={
                  <RefreshControl
                    tintColor={colors.primary}
                    title="Refreshing"
                    titleColor={colors.black}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                contentContainerStyle={{ paddingBottom: "20%" }}
                data={feedList}
                keyExtractor={(room) => room.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const nextDateRange = item.availabilityDateRanges;
                  return (
                    <ListView>
                      <SliderView
                        images={item.images}
                        title={item.title}
                        subtitle={item.price}
                        rating={item.rating}
                        reviews={item.reviews}
                        facilities={[
                          item.guests + " " + "guests",
                          item.bedrooms + " " + "bedrooms",
                          item.beds + " " + "beds",
                          item.bathrooms + " " + "bathrooms",
                        ]}
                        onPress={() =>
                          navigation.navigate("FeedSummary", { summary: item })
                        }
                        city={item.city}
                        availability={nextDateRange}
                        currency={item.currency}
                        price={item.price + item?.guestFees}
                        country={item.country}
                        userImg={
                          item.userId.personalImgs?.length !== 0
                            ? item.userId.personalImgs[0].uri
                            : STOCK_PHOTO
                        }
                        fullName={item.userId.firstName}
                      />
                    </ListView>
                  );
                }}
              ></FlatList>
            ) : loading ? (
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
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text>Loading beautiful homes for you...</Text>
              </ScrollView>
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
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text>No homes found...</Text>
              </ScrollView>
            )}

            <View style={styles.chatButton}>
              <FloatingBtn
                backgroundColor={colors.primary}
                text={"Map"}
                FloatingBtnHandler={() => setMapShow(true)}
                icon={images.LocationIcon(colors.white)}
                iconHeight={15}
                iconWidth={15}
                fontSize={12}
              />
            </View>
          </View>
        )
      ) : (
        <Maps
          // display={mapsShow ? "flex" : "none"}
          navigation={navigation}
          mapStatus={setMapShow}
        />
      )}
    </>
  );
};

const ListView = styled.View`
  background-color: #fff;
  margin: 10px;
  margin-bottom: 5px;
  margin-left: 15px;
  margin-right: 20px;
  border-radius: 20px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ItemText: {
    fontWeight: "500",
    lineHeight: 19,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },
  ItemTextSelected: {
    fontWeight: "500",
    lineHeight: 19,
    fontSize: 16,
    color: colors.darkBlue,
    textAlign: "center",
  },
  bgItem: {
    backgroundColor: colors.darkBlue,
    height: 42,
    width: 87,
    borderRadius: 24,
    justifyContent: "center",
  },
  selectedBgItem: {
    height: 42,
    width: 87,
    borderRadius: 24,
    justifyContent: "center",
  },
  chatButton: {
    position: "absolute",
    bottom: "3%",
    alignSelf: "center",
  },
});

export default HomeFeed;
