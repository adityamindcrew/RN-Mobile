import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PostAPIs from "../../../api/post_api";
import * as Button from "../../../components/Button";
import BackButton from "../../../components/backButton";
import EmptyCard from "../../../components/forms/emptyCard";
import HorizontalFlatlist from "../../../components/horizontalFlatList";
import SpinnerOverlay from "../../../components/spinner";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import Seperator from "../../../components/Seperator";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import Slider from "../../../components/ImageCarousel/Slider";
import featuresText from "../../../utils/featuresText";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";
import FastImage from "react-native-fast-image";
import mapStyle from "../../../../mapStyle.json";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import getCurrencyCode from "../../../helpers/getCurrencyCode";
import { FILTER_OBJ, MAP_LOCATION } from "../../../redux/Type";
import { clearAllFilters } from "../../../redux/Actions/FeedActions";

const Summary = ({ navigation }) => {
  const [image, setImage] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const mapRef = useRef();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);
  const {
    PlaceType,
    PlaceLocation,
    PlaceInfo,
    PlacePhoto,
    PlaceTitle,
    PlaceDesc,
    PlacePrice,
    PlaceDate,
    guestPlaceType,
    placeAmenities,
    // placeHighLights,
  } = useSelector((state) => state.userListingReducer);
  const { profileData } = useSelector((state) => state.AccountReducer);

  const address =
    PlaceTitle.title + "\n" + PlaceLocation.city + ", " + PlaceLocation.country;

  const fullName = profileData.firstName;
  const mergedArray = [...PlaceInfo.infoArr];
  const customOrder = ["guests", "bedrooms", "beds", "bathrooms"];

  let arr = mergedArray.sort((a, b) => {
    const indexA = customOrder.indexOf(a.name.split(" ")[1]);
    const indexB = customOrder.indexOf(b.name.split(" ")[1]);

    if (indexA < indexB) {
      return -1;
    }
    if (indexA > indexB) {
      return 1;
    }
    return 0;
  });

  const filteredItems = arr.map((item) => item.name);

  const amenities = placeAmenities.selectedItems.filter(
    (item) => typeof item === "object"
  );
  const amenitiesAdditional = placeAmenities.selectedItemsAdditional.filter(
    (item) => typeof item === "object"
  );
  // const placeAdditionalHighlights = placeHighLights.selectedItems.filter(
  //   (item) => typeof item === "object"
  // );

  const tempAmenities = [];
  amenities.forEach((element) => {
    tempAmenities.push(element.id);
  });
  const tempAmenitiesAdditional = [];
  amenitiesAdditional.forEach((element) => {
    tempAmenitiesAdditional.push(element.id);
  });

  // const tempHighlightsAdditional = [];
  // placeAdditionalHighlights.forEach((element) => {
  //   tempHighlightsAdditional.push(element.id);
  // });

  useEffect(() => {
    // setLoader(false);
    let imagess = PlacePhoto.image.map((image) => {
      return {
        fileName: image.id,
        fileSize: null,
        height: null,
        type: "image/png",
        uri: image.uri,
        width: null,
      };
    });
    setImage(imagess);
  }, []);

  const onPressConfirm = async () => {
    try {
      setLoader(true);
      const availabilityDateRanges = PlaceDate.period.map((date) => {
        return {
          start: date.start,
          end: date.end,
        };
      });

      const userData = new FormData();

      userData.append("type", PlaceType.placeType);
      userData.append("selection", guestPlaceType.selection);
      userData.append("country", PlaceLocation.country);
      userData.append("city", PlaceLocation.city);
      userData.append("streetAddress", PlaceLocation.streetAddress);
      userData.append("apartment", PlaceLocation.apartment);
      userData.append("zipCode", PlaceLocation.zipCode);
      userData.append("guests", PlaceInfo.guestIncrement);
      userData.append("bedrooms", PlaceInfo.bedroomsIncrement);
      userData.append("beds", PlaceInfo.bedsIncrement);
      userData.append("bathrooms", PlaceInfo.bathroomIncrement);
      userData.append("title", PlaceTitle.title);
      userData.append("description", PlaceDesc.placdeDesc);
      userData.append("price", PlacePrice.price);
      userData.append("currency", PlacePrice.currency);
      userData.append(
        "availabilityDateRanges",
        JSON.stringify(availabilityDateRanges)
      );
      userData.append("instantBookingAllowed", PlaceDate.instant);
      userData.append("manualBookingAllowed", PlaceDate.manual);
      userData.append("amenities", JSON.stringify(tempAmenities));
      userData.append(
        "additionalAmenities",
        JSON.stringify(tempAmenitiesAdditional)
      );
      userData.append("placeHighlights", JSON.stringify([]));
      userData.append("latitude", PlaceLocation.lat);
      userData.append("longitude", PlaceLocation.lng);
      userData.append(
        "frontendUri",
        "mycercles://BottomStack/ListingStack/Listing"
      );
      PlacePhoto.image.forEach((item, i) => {
        userData.append("image", {
          uri: item.uri,
          type: "image/jpeg",
          name: item.filename || `filename${i}.jpg`,
        });
      });

      const res = await PostAPIs.userListingCreate(userData);
      console.log(res);
      dispatch(clearAllFilters());
      dispatch({
        type: MAP_LOCATION,
        payload: {
          latitude: 0,
          longitude: 0,
        },
      });
      setLoader(false);
      navigation.navigate("PublishListings");
      storage.delete("drafted_Listing");
    } catch (error) {
      dispatch({
        type: MAP_LOCATION,
        payload: {
          latitude: 0,
          longitude: 0,
        },
      });
      dispatch(clearAllFilters());
      setLoader(false);
      if (error?.response?.data) {
        Alert.alert(error?.response?.data?.message[0]);
      } else {
        Alert.alert("Something went wrong!");
      }
    }
  };

  useMemo(async () => {
    try {
      const myCurrency = await getCurrencyCode(PlacePrice.currency);
      setCurrencyCode(myCurrency);
    } catch (error) {
      console.log(error);
    }
  }, [PlacePrice.currency]);

  const onPressCancel = () => {
    navigation.goBack();
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.flatListContainer}>
        <Text style={styles.flatListItemView}>{item.name}</Text>
        <View style={styles.horizontalFlatListBar} />
      </View>
    );
  };

  const renderItemAmenities = (item) => {
    return (
      <View style={styles.amenitiesContainer}>
        <FastImage
          style={{ width: 20, height: 20 }}
          source={{ uri: item?.item?.uri ? item?.item?.uri : item?.item?.url }}
        />
        <Text style={styles.amenitiesText}>{item.item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Summary"}
        onPressButton={() => saveAndExitListing("Summary", navigation)}
        buttonStatus
        buttonText={"Save & Exit"}
      />
      <SpinnerOverlay
        loaderState={loader}
        textContent={"Please wait while we publish your home"}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageSliderView}>
          {/* <ImageSlider
            parentWidth={370}
            disableOnPress
            ImageComponentStyle={{ borderRadius: 30 }}
            sliderBoxHeight={350}
            images={image}
          /> */}
          <Slider
            width={"93%"}
            borderRadius={38}
            showPagination={false}
            height={350}
            images={image}
          />
        </View>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.TypographyViewFirst}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={18}
              fontweight={700}
            >
              {address}
            </Typography.ChileLine>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.userDesCard}>
            <View style={{ maxWidth: 270 }}>
              <Typography.H color={colors.darkBlue} fontsize={18}>
                {guestPlaceType.selection === "Entire"
                  ? guestPlaceType.selection +
                    " " +
                    PlaceType.placeType.toLowerCase()
                  : guestPlaceType.selection +
                    " " +
                    "room in " +
                    PlaceType.placeType.toLowerCase()}
                , hosted by {fullName}
              </Typography.H>
            </View>
            <FastImage
              style={styles.userImg}
              source={{
                uri: !profileData.personalImgs[0].uri
                  ? "https://www.w3schools.com/howto/img_avatar.png"
                  : profileData.personalImgs[0].uri,
              }}
            />
          </View>
          <View style={{ paddingVertical: 10 }}>
            {featuresText(filteredItems)}
          </View>
          <View style={styles.horizontalLine} />
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.userDesCard}>
            <View style={styles.textStyle}>
              <Typography.H
                color={colors.darkBlue}
                fontsize={16}
                fontweight={700}
              >
                Amenities
              </Typography.H>
            </View>
          </View>
          <View>
            <HorizontalFlatlist
              renderItem={renderItemAmenities}
              itemData={[
                ...placeAmenities.selectedItems,
                ...placeAmenities.selectedItemsAdditional,
              ]}
            />
          </View>
          <Seperator />
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.userDesCard}>
            <View style={styles.textStyle}>
              <Typography.H color={colors.darkBlue} fontsize={16}>
                Location
              </Typography.H>
              <Seperator />
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={500}
              >
                {PlaceLocation.streetAddress +
                  " " +
                  (PlaceLocation.apartment ? PlaceLocation.apartment : "") +
                  ", " +
                  PlaceLocation.city +
                  ", " +
                  PlaceLocation.country +
                  ", " +
                  PlaceLocation.zipCode}
              </Typography.ChileLine>
              <View style={{ marginTop: 10 }}>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={14}
                  fontweight={500}
                >
                  We’ll only share your address with guests who are accepted
                </Typography.ChileLine>
                <Seperator />
              </View>
            </View>
          </View>
        </EmptyCard>
        <Seperator />
        <EmptyCard>
          <View style={styles.apartmentDes}>
            <Typography.H color={colors.darkBlue} fontsize={16}>
              Apartment location
            </Typography.H>
          </View>
          <MapView
            // customMapStyle={mapStyle}
            style={styles.map}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: PlaceLocation.lat,
              longitude: PlaceLocation.lng,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onRegionChangeComplete={(region) => {
              mapRef.current.__lastRegion = region;
            }}
          >
            <Marker
              coordinate={{
                latitude: PlaceLocation.lat,
                longitude: PlaceLocation.lng,
              }}
            ></Marker>
          </MapView>
          {/* <View style={styles.apartmentDes}>
                  <Typography.H color={colors.darkBlue} fontsize={16}>
                    {location}
                  </Typography.H>
                  <Text style={styles.houseText}>
                    Located at {listingId.city}
                  </Text>
                </View> */}
          <Seperator seperate={10} />
        </EmptyCard>
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
            <Text
              style={styles.priceText}
            >{`${currencyCode}${PlacePrice.price}`}</Text>
          </View>
        </EmptyCard>
        <View style={{ marginTop: "50%" }} />
        <Button.BtnConfirmCancel
          onPressConfirm={() => onPressConfirm()}
          onPressCancel={() => onPressCancel()}
          confirmTitle={"Publish"}
          cancelTitle={"Back"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saparator: {
    marginTop: 10,
  },
  horizontalLine: {
    height: 1,
    width: "50%",
    backgroundColor: colors.horizontalLineColor,
    alignSelf: "center",
  },
  amenitiesText: {
    color: colors.grayText,
    alignSelf: "center",
    marginLeft: 10,
  },
  imageSliderView: {
    // width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  TypographyViewFirst: {
    marginLeft: 20,
    marginTop: 20,
    bottom: 10,
  },
  userDesCard: {
    flexDirection: "row",
    paddingVertical: 15,
    // marginLeft: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  amenitiesContainer: {
    flexDirection: "row",
    margin: 0,
    marginLeft: 10,
  },
  userImg: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
  },
  textStyle: {
    // maxWidth: 20,
  },
  flatListContainer: {
    margin: 5,
    alignSelf: "center",
    flexDirection: "row",
    bottom: 10,
  },

  flatListItemView: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  horizontalFlatListBar: {
    height: 20,
    width: 1,
    backgroundColor: colors.grayText,
    alignSelf: "center",
    marginLeft: 10,
    bottom: 5,
  },
  map: {
    height: 200,
    width: "90%",
    alignSelf: "center",
  },
  apartmentDes: {
    marginLeft: 20,
    marginTop: 30,
    bottom: 20,
  },
  houseText: {
    color: colors.grayText,
    fontSize: 12,
    fontWeight: "500",
    maxWidth: 260,
  },
  priceText: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "700",
  },
});

export default Summary;
