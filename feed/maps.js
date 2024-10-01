import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets/index";
import HorizontalFlatlist from "../../components/horizontalFlatList";
import { SearchBar } from "../../components/searchBar";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import mapStyle from "../../../mapStyle.json";
import Seperator from "../../components/Seperator";
import ListingCard from "../../components/ListingCard";
import getCurrentLocation from "../../helpers/getCurrentLocation";
import moment from "moment";
import getCurrencyCode from "../../helpers/getCurrencyCode";
import { FEED } from "../../navigation/RouteNames";
import formatDate from "../../utils/formatDate";
import { getLocationAccess } from "../../helpers/Permissions";
import { CURRENT_LOCATION } from "../../redux/Type";
import priceFormat from "../../utils/priceFormat";

const DATA = [
  {
    key: 1,
    value: "All",
  },
  {
    key: 2,
    value: "New York",
  },
  {
    key: 3,
    value: "Phoenix",
  },
  {
    key: 4,
    value: "Dallas",
  },
  {
    key: 5,
    value: "United States",
  },
];
const Maps = ({ navigation, mapStatus, display = "flex" }) => {
  const [search, setSearchterm] = useState(false);
  const [cardShow, setCardShow] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [currencyCode, setCurrencyCode] = useState("");
  const [placeImages, setPlaceImages] = useState([]);
  const { feedList, filterObj, mapLocation, currentLocation } = useSelector(
    (state) => state.FeedReducer
  );
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  // useEffect(async () => {
  //   try {
  //     await moveToCurrentLocation();
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert("Please allow location permission to continue");
  //   }
  // }, [feedList]);

  useMemo(async () => {
    try {
      const currency = await getCurrencyCode(feedList[0].currency);
      setCurrencyCode(currency);
    } catch (error) {
      console.log(error);
    }
  }, [feedList]);

  const [itemSelected, setItemSelected] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={{}} onPress={() => setItemSelected(index)}>
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

  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleCardShow = (item, event) => {
    event.stopPropagation();
    setCardData([item]);
    let positionedPhotos = item.images.sort((a, b) => a.position - b.position);

    setPlaceImages(positionedPhotos);
    setCardShow(true);
  };

  useEffect(() => {
    if (mapLocation?.latitude !== 0) {
      if (mapRef.current && mapLocation) {
        mapRef.current.animateToRegion(mapLocation, 1000);
        setTimeout(() => {
          mapRef.current.animateToRegion(mapLocation, 1000);
        }, 100);
      }
    } else {
      moveToCurrentLocation();
      setTimeout(() => {
        moveToCurrentLocation();
      }, 2000);
    }
  }, [mapLocation]);

  const moveToCurrentLocation = async () => {
    try {
      await getLocationAccess();
      if (currentLocation.latitude !== 0) {
        const region = currentLocation;
        if (mapRef.current && region) {
          mapRef.current.animateToRegion(region, 1000);
        }
        return;
      }
      const position = await getCurrentLocation();

      const region = {
        ...position,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      dispatch({
        type: CURRENT_LOCATION,
        payload: region,
      });
      if (mapRef.current && region) {
        mapRef.current.animateToRegion(region, 1000);
      }
    } catch (error) {
      console.log(error);
      // Alert.alert("Please give location access to continue");
    }
  };

  const CustomMarker = ({ price }) => (
    <TouchableOpacity
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <SvgXml xml={images.MarkerTag()} />
      <View style={{ position: "absolute", right: "18%" }}>
        <Text style={styles.markerText}>${priceFormat(price)}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleMapPress = (event) => {
    setCardShow(false);
  };

  // const calculateDeltas = (bounds) => {
  //   console.log("dfghgfd", bounds);

  //   const latitudeDelta = bounds.northEast.latitude - bounds.southWest.latitude;
  //   const longitudeDelta =
  //     bounds.northEast.longitude - bounds.southWest.longitude;

  //   // Set the region with the calculated delta values

  //   const region = {
  //     latitude: (bounds.northEast.latitude + bounds.southWest.latitude) / 2,
  //     longitude: (bounds.northEast.longitude + bounds.southWest.longitude) / 2,
  //     latitudeDelta,
  //     longitudeDelta,
  //   };

  //   console.log(region);

  //   if (mapRef.current) {
  //     mapRef.current.animateToRegion(region, 1000);
  //   }
  // };

  // useMemo(async () => {
  //   if (mapRef.current) {
  //     const bounds = await mapRef.current.getMapBoundaries();
  //     calculateDeltas(bounds);
  //   }
  // }, [mapLocation]);

  return (
    <View style={[styles.container, { display: display }]}>
      <View>
        <Seperator seperate={10} />
        <TouchableOpacity
          onPress={() => navigation.navigate("WhereWantToTravel")}
        >
          <SearchBar
            placeHolder={"Where do you want to travel?"}
            changeTextHanlder={setSearchterm}
            valueChange={
              filterObj.city ? filterObj.fullAddress : filterObj.continent || ""
            }
            iconStatus
            searchHandler={() => Alert.alert("Under development.")}
            filterHandler={() => navigation.navigate("Filters")}
            pointerEvents="none"
            editable={false}
          />
        </TouchableOpacity>
      </View>
      {/* <Seperator seperate={10} />
      <HorizontalFlatlist
        renderItem={renderItem}
        itemData={DATA}
        numOfColumns={10}
      /> */}
      <Seperator />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onPress={handleMapPress}
        ref={mapRef}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={initialRegion}
        // customMapStyle={mapStyle}
        onRegionChangeComplete={async (region) => {
          mapRef.current.__lastRegion = region;
        }}
      >
        {feedList.map((item, index) => (
          <Marker
            key={index}
            onPress={(event) => handleCardShow(item, event)}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          >
            <CustomMarker price={item.price + item.guestFees} />
          </Marker>
        ))}
      </MapView>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.zoomOutButton}
          onPress={() => moveToCurrentLocation()}
        >
          <SvgXml xml={images.MapZoomOut()} />
        </TouchableOpacity>
        {cardData && cardShow && (
          <ListingCard
            onPress={() =>
              navigation.navigate("FeedSummary", { summary: cardData[0] })
            }
            heading={cardData[0].title}
            availabilityDate={formatDate(
              cardData[0].availabilityDateRanges[0].start,
              cardData[0].availabilityDateRanges[0].end
            )}
            pricePerNight={
              currencyCode +
              priceFormat(cardData[0]?.price + cardData[0]?.guestFees)
            }
            showCard={cardShow}
            image={cardData[0].images.length > 0 && placeImages[0].uri}
            onSwipeDown={(data) => {
              setCardData(null), setCardShow(data);
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => mapStatus(false)}
        style={styles.bottomTile}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>View as list</Text>
        <View style={styles.upArrowIcon}>
          <SvgXml xml={images.UpArrow(colors.white)} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upArrowIcon: {
    backgroundColor: colors.darkBlue,
    borderRadius: 30,
    position: "absolute",
    top: "-15%",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 32,
  },
  bottomTile: {
    width: "100%",
    backgroundColor: colors.white,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  zoomOutButton: {
    // position: "absolute",
    borderRadius: 30,
    backgroundColor: colors.primary,
    padding: 7,
    // right: "5%",
    // bottom: "30%",
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 10,
  },
  contentContainer: { width: "70%", gap: 5, marginTop: 5 },
  zoomOutButtonSelected: {
    position: "absolute",
    bottom: "25%",
    right: 16,
    height: 40,
    width: 40,
    borderRadius: 20,
    padding: 10,
    backgroundColor: colors.primary,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    position: "absolute",
    bottom: "12%",
    width: "100%",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: colors.grayText,
  },
  image: {
    width: 84,
    height: 104,
    borderRadius: 10,
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
  customMarker: {
    width: 76,
    height: 33,
    backgroundColor: colors.darkBlue,
    borderRadius: 5,
    borderTopLeftRadius: 45,
    borderBottomLeftRadius: 45,
    justifyContent: "center",
  },
  markerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 17,
    textAlign: "center",
  },
  markerDot: {
    height: 9,
    width: 9,
    borderRadius: 4,
    backgroundColor: colors.white,
    alignSelf: "center",
    marginRight: 5,
  },
});

export default Maps;
