import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import images from "../../assets";
import * as Button from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import Inputfield from "../../components/forms/inputField";
import ProgressBar from "../../components/progressBar";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { placeLocation } from "../../redux/Actions/userListingAction";
import getCurrentLocation from "../../helpers/getCurrentLocation";
import reverseGeocode from "../../utils/reverseGeocode";
import { SearchBar } from "../../components/searchBar";
import CustomAutoCompletePlaces from "../../components/CustomAutoCompletePlaces";
import { storage } from "../../components/asyncStorageToken";
import saveAndExitListing from "../../utils/saveAndExitListing";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import Seperator from "../../components/Seperator";
import mapStyle from "../../../mapStyle.json";

const PlaceLocation = ({ navigation }) => {
  const [getAddress, setGetAddress] = useState();
  const [addressStatus, setAddressStatus] = useState(false);
  const [apartment, setApartment] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [search, setSearchterm] = useState("");
  const { profileData } = useSelector((state) => state.AccountReducer);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [markerLocation, setMarkerLocation] = useState({
    latitude: currentPosition.latitude,
    longitude: currentPosition.longitude,
  });
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const dispatch = useDispatch();
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const onPressConfirm = () => {
    if (country === "") {
      Alert.alert("Please choose country");
      return false;
    }
    if (city === "") {
      Alert.alert("Please enter city");
      return false;
    }
    if (streetAddress === "") {
      Alert.alert("Please enter street address");
      return false;
    }
    if (zipCode === "") {
      Alert.alert("Please enter zipcode");
      return false;
    }
    const objectToAdd = {
      country: country,
      city: city,
      streetAddress: streetAddress,
      zipCode: zipCode,
      lat: lat,
      lng: lng,
      apartment: apartment,
    };
    dispatch(placeLocation(objectToAdd));
    navigation.navigate("PrimaryInformation");
    draftData.country = country;
    draftData.city = city;
    draftData.streetAddress = streetAddress;
    draftData.zipCode = zipCode;
    draftData.latitude = lat;
    draftData.longitude = lng;
    draftData.apartment = apartment;
    draftData.userId = profileData.id;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  useEffect(async () => {
    try {
      const position = await getCurrentLocation();
      moveToCurrentLocation({
        ...position,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setCurrentPosition({
        ...position,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Please allow location permission to continue");
    }
  }, []);

  const moveToCurrentLocation = (position) => {
    if (mapRef.current && currentPosition) {
      mapRef.current.animateToRegion(position, 1000);
    }
  };

  const handlePlaceSelected = async (data) => {
    try {
      const {
        city,
        country,
        fullAddress,
        streetAddress,
        zipCode,
        latitude,
        longitude,
      } = data;

      updateLocationState(
        city,
        country,
        true,
        zipCode,
        latitude,
        longitude,
        streetAddress
      );
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      const position = await getCurrentLocation();
      setCurrentPosition(position);
      const data = await reverseGeocode(position.latitude, position.longitude);
      updateLocationState(
        data.city,
        data.country,
        true,
        data.zipCode,
        position.latitude,
        position.longitude,
        data.streetAddress
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Please allow location permission to continue");
    }
  };

  const updateLocationState = (
    city,
    country,
    addressStatus,
    zipCode,
    latitude,
    longitude,
    streetAddress
  ) => {
    setCity(city);
    setCountry(country);
    setAddressStatus(addressStatus);
    setZipCode(zipCode);
    setLat(latitude);
    setLng(longitude);
    setStreetAddress(streetAddress);
    if (mapRef.current && currentPosition) {
      mapRef.current.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 },
        1000
      );
    }
    setCurrentPosition({
      latitude,
      longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  };

  return (
    <KeyboardAwareScrollView
      extraHeight={250}
      // contentContainerStyle={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <BackButton
            onPress={() => navigation.goBack()}
            Text={"Where is your home located?"}
            onPressButton={() =>
              saveAndExitListing("PlaceLocation", navigation)
            }
            buttonStatus
            buttonText={"Save & Exit"}
          />
          {/* {!addressStatus ? (
        <>
          <View style={styles.TypographyView}>
            <Typography.ChileLine
              color={colors.grayText}
              size={16}
              fontweight={500}
            >
              You address is only shared with guests after they've made a
              reservation
            </Typography.ChileLine>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            onPress={handleMapPress}
            ref={mapRef}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={initialRegion}
            customMapStyle={mapStyle}
            onRegionChangeComplete={(region) => {
              mapRef.current.__lastRegion = region;
            }}
          >
            <Marker onPress={handleMarker} coordinate={markerLocation}></Marker>
          </MapView>

          <View style={styles.placesView}>
            <GooglePlacesAutocomplete
              placeholder="Enter your address"
              onPress={(data, details) => {
                handlePlaceSelected(data, details);
              }}
              query={{
                key: "AIzaSyB-O0DQioKE5A7CkO3uOa43V-pCMg4eZqM",
                language: "en", // language of the results
              }}
              fetchDetails={true}
              onFail={(error) => console.error(error)}
              getAddressText={(e) => console.log("eeee", e)}
              styles={{
                textInput: {
                  backgroundColor: "#FFFFFF",
                  height: 58,
                  borderRadius: 41,
                  flex: 1,
                  paddingLeft: 50,
                },
              }}
              renderLeftButton={() => (
                <SvgXml
                  style={{
                    left: 30,
                    zIndex: 1,
                    alignSelf: "center",
                    bottom: 3,
                  }}
                  xml={images.LocationIcon(colors.primary)}
                />
              )}
            />
          </View>
        </>
      ) : ( */}
          <View style={styles.placesViewAfterAddress}>
            <SearchBar
              summaryStatus={false}
              // editable={false}
              placeHolder={"Enter your address"}
              // changeTextHanlder={setSearchterm}
              // valueChange={search}
              iconStatus={true}
              // value={filterObj.city}
              filterHandler={() => navigation.navigate("Filters")}
              iconStatus2={false}
              firstIcon={images.LocationIcon(colors.primary)}
              onAddressChange={handlePlaceSelected}
            />
            <View style={styles.useCurrentLocation}>
              <Button.BtnTxtUnderline
                color={colors.darkBlue}
                label="Use current location"
                onPress={handleGetCurrentLocation}
              />
            </View>
            <View style={styles.inputFieldView}>
              <KeyboardAwareScrollView extraHeight={250} enableOnAndroid={true}>
                <EmptyCard>
                  <Saparator />
                  <Typography.HH>Country</Typography.HH>
                  <Inputfield
                    changeTextHanlder={setCountry}
                    valueChange={country}
                    placeHolder={"Country name"}
                  />
                  <Typography.HH>City</Typography.HH>
                  <Inputfield
                    changeTextHanlder={setCity}
                    valueChange={city}
                    placeHolder={"City name"}
                  />
                  {/* <Typography.HH>Street address</Typography.HH> */}
                  {/* <Inputfield
                  changeTextHanlder={setStreetAddress}
                  valueChange={streetAddress}
                  placeHolder={"Address"}
                /> */}
                  <CustomAutoCompletePlaces
                    // onPressResult={(location) => {
                    //   // setStreetAddress(location.location);
                    //   // console.log("xbvnbbv", location);
                    //   // handlePlaceSelected(location);
                    // }}
                    formattedData={handlePlaceSelected}
                    title={`Street address`}
                    placeHolder={"Address"}
                    value={streetAddress}
                    fullAddress={false}
                  />
                  <Typography.HH>Apartment (optional)</Typography.HH>
                  <Inputfield
                    changeTextHanlder={setApartment}
                    valueChange={apartment}
                    placeHolder={"Apartment"}
                  />
                  <Typography.HH>Zip code</Typography.HH>
                  <Inputfield
                    changeTextHanlder={setZipCode}
                    valueChange={zipCode}
                    placeHolder={"Zip code"}
                    keyboardType={"numeric"}
                  />
                  <Saparator />
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
                    initialRegion={currentPosition}
                    onRegionChangeComplete={(region) => {
                      mapRef.current.__lastRegion = region;
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: currentPosition.latitude,
                        longitude: currentPosition.longitude,
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
                <View style={{ marginTop: "55%" }} />
                <ProgressBar progress={0.2} percentage={20} />

                <Button.BtnConfirmCancel
                  onPressConfirm={() => onPressConfirm()}
                  onPressCancel={() => onPressCancel()}
                  confirmTitle={"Next"}
                  cancelTitle={"Back"}
                  cancelButtonColor={colors.white}
                  cancelTextColor={colors.darkBlue}
                />
              </KeyboardAwareScrollView>
            </View>
          </View>
          {/* )} */}
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saparator: {
    marginTop: 10,
  },
  placesView: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    marginTop: "40%",
  },
  placesViewAfterAddress: {},
  cardView: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  zoomOutButton: {
    position: "absolute",
    borderRadius: 30,
    backgroundColor: colors.primary,
    padding: 7,
    right: "5%",
    bottom: "30%",
  },
  TypographyView: {
    width: "90%",
    alignSelf: "center",
    marginLeft: 10,
    bottom: 10,
  },
  useCurrentLocation: {
    marginLeft: 20,
  },
  inputFieldView: {
    marginTop: "5%",
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
});

const Saparator = styled.View`
  margin-top: 20px;
`;

export default PlaceLocation;
