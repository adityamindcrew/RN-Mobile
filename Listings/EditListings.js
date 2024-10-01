import _isEmpty from "lodash/isEmpty";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Share from "react-native-share";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import PostAPIs from "../../api/post_api";
import images from "../../assets/index";
import {
  BtnContain,
  CircularBtnIcon,
  ConfirmCancelBtn,
} from "../../components/Button";
import Seperator from "../../components/Seperator";
import SwitchWithText from "../../components/SwitchWithText";
import TabThreeBtn from "../../components/TabThreeBtn";
import BackButton from "../../components/backButton";
import CalendarView from "../../components/calendarView";
import EmptyCard from "../../components/forms/emptyCard";
import Inputfield from "../../components/forms/inputField";
import IncreDecreCompo from "../../components/increDecreComponent";
import SpinnerOverlay from "../../components/spinner";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { getUserListing } from "../../redux/Actions/userListingAction";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import { LISTINGS } from "../../navigation/RouteNames";
import currencyList from "../../../Currencies.json";
import DraggableFlatListPlace from "../../components/DraggableFlatlistPlace";
import CustomAutoCompletePlaces from "../../components/CustomAutoCompletePlaces";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { INFO_FOR_GUESTS } from "../../redux/Type";
import CustomDropDown from "../../components/CustomDropDown";
import CountrySelectorButton from "../../components/CountrySelectorButton";
import moment from "moment";
import FastImage from "react-native-fast-image";
import getAvailableRanges from "../../utils/getAvailableRanges";

const url = "https://awesome.contents.com/";
const title = "Awesome Contents";
const message = "Please check this out.";

const options = {
  title,
  url,
  message,
};

const EditListings = ({ navigation, route }) => {
  const data = route?.params?.item;
  const [btnPressed, setBtnPressed] = useState(1);
  const [guestIncrement, setGuestIncrement] = useState(data.guests || 0);
  const [bedroomsIncrement, setBedroomsIncrement] = useState(
    data.bedrooms || 0
  );
  const [bedsIncrement, setBedsIncrement] = useState(data.beds || 0);
  const [bathroomIncrement, setBathroomIncrement] = useState(
    data.bathrooms || 0
  );
  const [placePrice, setPlacePrice] = useState(parseInt(data.price) || 0);
  const [describePlace, setDescribePlace] = useState(data.type || "");
  const [roomType, setRoomType] = useState(data.selection || "");
  const [country, setCountry] = useState(data.country || "");
  const [city, setCity] = useState(data.city || "");
  const [zipCode, setZipCode] = useState(data.zipCode || "");
  const [streetAddress, setStreetAddress] = useState(data.streetAddress || "");
  const [apartment, setApartment] = useState(
    data.apartment !== "null" && data.apartment ? data.apartment : ""
  );
  const [instantBooking, setInstantBooking] = useState(
    data.instantBookingAllowed || false
  );
  const [manualBooking, setManualBooking] = useState(
    data.manualBookingAllowed || false
  );
  const [filePath, setFilePath] = useState({});
  const [image, setImage] = useState([]);
  const [firstImage, setFirstImage] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [editStatusPlace, setEditStatusPlace] = useState(false);
  const [editPrice, setEditPrice] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [mergedAmenities, setMergedAmenities] = useState(
    data.amenities.map((ameni) => ameni.amenityId.id) || []
  );
  const [mergedAdditionalAmenities, setMergedAdditionalAmenities] = useState(
    data.additionalAmenities.map((ameni) => ameni.additionalAmenityId.id) || []
  );
  const [selectedAdditinalAmenities, setSelectedAdditinalAmenities] = useState(
    []
  );

  const [highLights, setHighLights] = useState([]);
  const [mergeHighLights, setMergeHighLights] = useState([]);
  const [period, setPeriod] = useState({});
  const [end, setEnd] = useState({});
  const [start, setStart] = useState({});
  const [availableDates, setAvailableDates] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { masterData, infoForGuest } = useSelector(
    (state) => state.userListingReducer
  );
  const [loader, setLoader] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState(data.title || "");
  const [propertyDesc, setPropertyDesc] = useState(data.description || "");
  const dispatch = useDispatch();
  const [latitude, setLatitude] = useState(data.latitude || 0);
  const [longitude, setLongitude] = useState(data.longitude || 0);
  const [imageChange, setImageChange] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [currency, setCurrency] = useState(
    {
      countryCode: "US",
      currencyCode: "USD",
      name: "United States Dollar",
      sign: "$",
      symbol: "$",
    } || {}
  );

  useMemo(() => {
    let imagess = data.images.map((image) => {
      return {
        fileName: image.id,
        fileSize: null,
        height: null,
        type: "image/png",
        uri: image.uri,
        width: null,
        position: image.position,
        id: image.id,
      };
    });
    imagess.sort((a, b) => a.position - b.position);
    setFirstImage(imagess.slice(0, 1));
    setImage(imagess.slice(1));
  }, [data]);

  const placeType = [{ label: "House" }, { label: "Apartment" }];
  const disposalType = [
    { label: "An Entire place" },
    { label: "A Private room" },
    { label: "A Shared room" },
  ];

  useEffect(() => {
    dispatch({
      type: INFO_FOR_GUESTS,
      payload: {
        wifiName: data.wifiName !== "null" ? data.wifiName : "",
        wifiPassword: data.wifiPassword !== "null" ? data.wifiPassword : "",
        checkinInfo: data.checkinInfo !== "null" ? data.checkinInfo : "",
        houseRules: data.houseRules !== "null" ? data.houseRules : "",
        houseManual: data.houseManual !== "null" ? data.houseManual : "",
      },
    });
    let currencies = currencyList.filter(
      (res) => res.currencyCode === data.currency
    );
    setCurrency(currencies[0]);
  }, [data]);

  const editListingData = async () => {
    let imageArr = [...firstImage, ...image];
    if (imageArr.length < 5) {
      Alert.alert(
        "Please add at least 5 photos to showcase your beautiful place"
      );
      return;
    }
    const availabilityDateRanges = ranges?.map((date) => {
      return {
        start: date.start,
        end: date.end,
      };
    });

    const userData = new FormData();
    userData.append("type", describePlace);
    userData.append("selection", roomType);
    userData.append("country", country);
    userData.append("city", city);
    userData.append("streetAddress", streetAddress);
    userData.append("apartment", apartment);
    userData.append("zipCode", zipCode);
    userData.append("guests", guestIncrement);
    userData.append("bedrooms", bedroomsIncrement);
    userData.append("beds", bedsIncrement);
    userData.append("bathrooms", bathroomIncrement);
    userData.append("title", propertyTitle);
    userData.append("description", propertyDesc);
    userData.append("price", placePrice);
    userData.append("currency", currency.currencyCode);
    if (ranges.length !== 0) {
      userData.append(
        "availabilityDateRanges",
        JSON.stringify(availabilityDateRanges)
      );
    } else {
      userData.append(
        "availabilityDateRanges",
        JSON.stringify(data.availabilityDateRanges)
      );
    }
    userData.append("instantBookingAllowed", instantBooking);
    userData.append("manualBookingAllowed", manualBooking);
    userData.append("amenities", JSON.stringify(mergedAmenities));
    userData.append(
      "additionalAmenities",
      JSON.stringify(mergedAdditionalAmenities)
    );
    userData.append("placeHighlights", JSON.stringify(highLights));

    imageChange &&
      imageArr.forEach((item, i) => {
        userData.append("image", {
          uri: item.uri,
          type: "image/jpeg",
          name: item.filename || `filename${i}.jpg`,
        });
      });
    userData.append("latitude", latitude);
    userData.append("longitude", longitude);
    userData.append("listingId", data.id);
    userData.append("houseRules", infoForGuest.houseRules);
    userData.append("checkinInfo", infoForGuest.checkinInfo);
    userData.append("houseManual", infoForGuest.houseManual);
    userData.append("wifiName", infoForGuest.wifiName);
    userData.append("wifiPassword", infoForGuest.wifiPassword);

    setLoader(true);

    try {
      const res = await PostAPIs.editUserListing(userData);
      dispatch({
        type: INFO_FOR_GUESTS,
        payload: {
          wifiName: "",
          wifiPassword: "",
          checkinInfo: "",
          houseRules: "",
          houseManual: "",
        },
      });
      setLoader(false);
      dispatch(getUserListing(navigation));
      navigation.navigate(LISTINGS);
    } catch (error) {
      setLoader(false);
      console.log(error);
      if (error?.response?.data) {
        Alert.alert(error?.response?.data?.message[0]);
      } else {
        Alert.alert("Something went wrong!");
      }
    }

    // PostAPIs.editUserListing(userData, (res) => {
    //   console.log(res);
    //   if (res.status) {

    //   } else {

    //   }
    // });
  };

  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  useMemo(async () => {
    setStartDate(data.availabilityStart);
    setEndDate(data.availabilityEnd);
  }, []);

  useEffect(() => {
    const resultString = getAvailableRanges(data.availabilityDateRanges);
    setAvailableDates(resultString);
  }, []);

  useEffect(() => {
    if (ranges.length !== 0) {
      const resultString = getAvailableRanges(ranges);
      setAvailableDates(resultString);
    }
  }, [ranges]);

  const initialRegion = {
    latitude: data.latitude,
    longitude: data.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const shareListings = () => {
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      quality: 1,
      selectionLimit: 20 - image.length,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          // alert("User cancelled camera picker");
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }

        setFilePath(response.assets[0].uri);
        setImage([...image, ...response.assets]);
        setImageChange(true);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      quality: 1,
      selectionLimit: 20 - image.length,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }

      setFilePath(response.assets[0].uri);
      setImage([...image, ...response.assets]);
      setImageChange(true);
    });
  };

  const onCrossClick = (item) => {
    let filteredArray = image.filter((i) => i.uri !== item.uri);
    setImage(filteredArray);
  };

  const GuestIncrementHandler = () => {
    setGuestIncrement(guestIncrement + 1);
  };
  const GuestDecrementHandler = () => {
    setGuestIncrement(guestIncrement - 1);
  };

  const BedRoomsIncrementHandler = () => {
    setBedroomsIncrement(bedroomsIncrement + 1);
  };

  const BedRoomsDecrementHandler = () => {
    setBedroomsIncrement(bedroomsIncrement - 1);
  };
  const BedIncrementHandler = () => {
    setBedsIncrement(bedsIncrement + 1);
  };

  const BedDecrementHandler = () => {
    setBedsIncrement(bedsIncrement - 1);
  };
  const BathRoomIncrementHandler = () => {
    setBathroomIncrement(bathroomIncrement + 1);
  };

  const BathroomDecrementHandler = () => {
    setBathroomIncrement(bathroomIncrement - 1);
  };

  const deleteList = () => {
    Alert.alert("Cercles", "Are you sure you want to delete this listing?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteUserListing(),
      },
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  };

  const deleteUserListing = async () => {
    const data = {
      id: route.params.id,
    };
    setLoader(true);
    await PostAPIs.deleteUserListing(data, (res) => {
      console.log(res);
      if (res.status) {
        setLoader(false);
        navigation.goBack();
        setTimeout(() => {
          dispatch(getUserListing(navigation));
        }, 2000);
      } else if (!res.status) {
        setLoader(false);
        Alert.alert("Cercles", res.message[0]);
      } else {
        Alert.alert("Cercles", "Something went wrong!");
        setLoader(false);
      }
    });
  };

  const renderItem = (item) => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <SvgXml xml={item.item.icon()} />
          <Typography.HH>{item.item.title}</Typography.HH>
        </View>
        {/* <CardIconText icon={item.item.icon()} title={item.item.title} /> */}
      </View>
    );
  };

  const handleCheckboxToggle = (item) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const handleCheckboxHighlights = (item) => {
    if (highLights.includes(item.id)) {
      setHighLights(highLights.filter((id) => id !== item.id));
    } else {
      setHighLights([...highLights, item.id]);
    }
  };

  const handleCheckboxToggleAdditionalAmenities = (item) => {
    if (selectedAdditinalAmenities.includes(item.id)) {
      setSelectedAdditinalAmenities(
        selectedAdditinalAmenities.filter((id) => id !== item.id)
      );
    } else {
      setSelectedAdditinalAmenities([...selectedAdditinalAmenities, item.id]);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handlePlaceSelected = async (data) => {
    try {
      const { country, city, zipCode, latitude, longitude, streetAddress } =
        data;
      setLatitude(latitude);
      setLongitude(longitude);
      setStreetAddress(streetAddress);
      setCity(city);
      setZipCode(zipCode);
      setCountry(country);
      let position = {
        latitude: latitude,
        longitude: longitude,
      };
      moveToLocation(position);
    } catch (error) {
      console.log(error);
    }
  };

  const moveToLocation = async (position) => {
    try {
      const region = {
        ...position,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const currencySelect = (item) => {
    setCurrency(item);
    setModalVisible(false);
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <BackButton
          icon3Status
          icon1Status
          icon1={images.DeleteIcon(colors.primary)}
          icon3={images.EyeIcon(colors.primary)}
          onPressIcon2={() => deleteList()}
          onPressIcon3={() =>
            navigation.navigate("PreviewListing", { summary: data })
          }
          onPress={() => navigation.goBack()}
          Text={"Edit home"}
        />
        <Seperator />
        <TabThreeBtn
          onpressOne={() => setBtnPressed(1)}
          onpressTwo={() => setBtnPressed(2)}
          onpressThree={() => setBtnPressed(3)}
          btnStatus={btnPressed}
          textOne={"About\napartment"}
          textTwo={"Description &\n photos"}
          textThree={"Price &\navailability"}
        />
        <Seperator seperate={10} />
        <SpinnerOverlay loaderState={loader} textContent={"Updating..."} />

        {btnPressed == 1 && (
          <>
            <EmptyCard
              children={
                <View style={styles.emptyCardContainer}>
                  <Typography.HH>What best describes your place?</Typography.HH>
                  <CustomDropDown
                    data={placeType}
                    value={describePlace}
                    onSelect={(item) => setDescribePlace(item.label)}
                  />
                  <Seperator />
                  <View style={{ maxWidth: 350 }}>
                    <Typography.HH>
                      What type of place will guests have at their disposal?
                    </Typography.HH>
                  </View>
                  <Seperator />
                  <CustomDropDown
                    data={disposalType}
                    value={roomType.toLowerCase()}
                    onSelect={(item) => {
                      const room = item.label.split(" ");
                      setRoomType(room[1]);
                    }}
                  />
                  <Seperator seperate={10} />
                </View>
              }
            />
            <Seperator />
            <EmptyCard
              children={
                <View style={styles.emptyCardContainer}>
                  <Typography.HH>Primary info</Typography.HH>
                  <Seperator seperate={10} />
                  <View style={styles.weeksView}>
                    <Typography.ChileLine
                      color={colors.darkBlue}
                      size={16}
                      fontweight={500}
                    >
                      Guests
                    </Typography.ChileLine>
                    <View style={{ marginRight: 10, bottom: 5 }}>
                      <IncreDecreCompo
                        increment={() => GuestIncrementHandler()}
                        decrement={() => GuestDecrementHandler()}
                        value={guestIncrement}
                      />
                    </View>
                  </View>
                  <View style={styles.horizontalLine} />
                  <Seperator seperate={10} />
                  <View style={styles.weeksView}>
                    <Typography.ChileLine
                      color={colors.darkBlue}
                      size={16}
                      fontweight={500}
                    >
                      Bedrooms
                    </Typography.ChileLine>
                    <View style={{ marginRight: 10, bottom: 5 }}>
                      <IncreDecreCompo
                        increment={() => BedRoomsIncrementHandler()}
                        decrement={() => BedRoomsDecrementHandler()}
                        value={bedroomsIncrement}
                      />
                    </View>
                  </View>
                  <View style={styles.horizontalLine} />
                  <Seperator seperate={10} />
                  <View style={styles.weeksView}>
                    <Typography.ChileLine
                      color={colors.darkBlue}
                      size={16}
                      fontweight={500}
                    >
                      Beds
                    </Typography.ChileLine>
                    <View style={{ marginRight: 10, bottom: 5 }}>
                      <IncreDecreCompo
                        increment={() => BedIncrementHandler()}
                        decrement={() => BedDecrementHandler()}
                        value={bedsIncrement}
                      />
                    </View>
                  </View>
                  <View style={styles.horizontalLine} />
                  <Seperator seperate={10} />
                  <View style={styles.weeksView}>
                    <Typography.ChileLine
                      color={colors.darkBlue}
                      size={16}
                      fontweight={500}
                    >
                      Bathrooms
                    </Typography.ChileLine>
                    <View style={{ marginRight: 10, bottom: 5 }}>
                      <IncreDecreCompo
                        increment={() => BathRoomIncrementHandler()}
                        decrement={() => BathroomDecrementHandler()}
                        value={bathroomIncrement}
                      />
                    </View>
                  </View>
                  <Seperator seperate={10} />
                </View>
              }
            />
            <Seperator />
            <EmptyCard>
              <View style={{ paddingTop: 20 }}>
                <View style={{ marginLeft: 20 }}>
                  <Typography.T3 textAlign={"left"}>
                    Apartment location
                  </Typography.T3>
                </View>
                <Typography.HH>Exact location after booking</Typography.HH>
                <Seperator />
                <MapView
                  // customMapStyle={mapStyle}
                  style={styles.map}
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={initialRegion}
                  onRegionChangeComplete={(region) => {
                    mapRef.current.__lastRegion = region;
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: latitude,
                      longitude: longitude,
                    }}
                  ></Marker>
                </MapView>
                <Seperator />
                <CustomAutoCompletePlaces
                  formattedData={handlePlaceSelected}
                  title={`Street address`}
                  fullAddress={false}
                  placeHolder={streetAddress}
                  placeholderTextColor={colors.black}
                  onFocus={() => setPlaceHolder("", 0)}
                />
                <Typography.HH>Apartment</Typography.HH>
                <Inputfield
                  changeTextHanlder={setApartment}
                  valueChange={apartment}
                  placeHolder={""}
                />
                <Typography.HH>City</Typography.HH>
                <Inputfield
                  changeTextHanlder={setCity}
                  valueChange={city}
                  placeHolder={""}
                />
                <Typography.HH>Zip code</Typography.HH>
                <Inputfield
                  changeTextHanlder={setZipCode}
                  valueChange={zipCode}
                  placeHolder={""}
                />
                <Typography.HH>Country</Typography.HH>
                <Inputfield
                  changeTextHanlder={setCountry}
                  valueChange={country}
                  placeHolder={""}
                />
              </View>
            </EmptyCard>
            <Seperator />
            <EmptyCard>
              <View style={{ marginTop: 20, marginBottom: 20 }}>
                <View style={{ marginLeft: 20 }}>
                  <Typography.T3 textAlign={"left"}>Amenities</Typography.T3>
                </View>
                {masterData?.masterAmenities?.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (mergedAmenities.includes(item.id)) {
                        setMergedAmenities(
                          mergedAmenities.filter((id) => id !== item.id)
                        );
                      } else {
                        setMergedAmenities([...mergedAmenities, item.id]);
                      }
                    }}
                    key={item.id}
                  >
                    <View style={styles.listItem}>
                      <View style={{ flexDirection: "row" }}>
                        <FastImage
                          style={{ width: 20, height: 20 }}
                          source={{ uri: item.uri }}
                        />

                        <Text style={{ textAlign: "left", paddingLeft: 30 }}>
                          {item.name}
                        </Text>
                      </View>
                      {/* <CheckBox
                        value={item.matched}
                        style={{ width: 24, height: 24, left: 30 }}
                        onCheckColor={colors.primary}
                        onTintColor={colors.primary}
                        onValueChange={() => {
                          handleCheckboxToggle(item);
                        }}
                      /> */}
                      <SvgXml
                        height={mergedAmenities.includes(item.id) ? 28 : 25}
                        width={mergedAmenities.includes(item.id) ? 28 : 25}
                        xml={
                          mergedAmenities.includes(item.id)
                            ? images.TickIcon(colors.primary)
                            : images.BlankCircleIcon(colors.primary)
                        }
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </EmptyCard>
            <Seperator />
            <EmptyCard>
              <View style={{ paddingTop: 20 }}>
                <View style={{ marginLeft: 20 }}>
                  <Typography.T3 textAlign={"left"}>
                    Additional Amenities
                  </Typography.T3>
                </View>
                {masterData?.masterAdditionalAmenities?.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (mergedAdditionalAmenities.includes(item.id)) {
                        setMergedAdditionalAmenities(
                          mergedAdditionalAmenities.filter(
                            (id) => id !== item.id
                          )
                        );
                      } else {
                        setMergedAdditionalAmenities([
                          ...mergedAdditionalAmenities,
                          item.id,
                        ]);
                      }
                    }}
                    key={item.id}
                  >
                    <View style={styles.listItem}>
                      <View style={{ flexDirection: "row" }}>
                        <FastImage
                          style={{ width: 20, height: 20 }}
                          source={{ uri: item.uri }}
                        />

                        <Text style={{ textAlign: "left", paddingLeft: 30 }}>
                          {item.name}
                        </Text>
                      </View>
                      <SvgXml
                        height={
                          mergedAdditionalAmenities.includes(item.id) ? 28 : 25
                        }
                        width={
                          mergedAdditionalAmenities.includes(item.id) ? 28 : 25
                        }
                        xml={
                          mergedAdditionalAmenities.includes(item.id)
                            ? images.TickIcon(colors.primary)
                            : images.BlankCircleIcon(colors.primary)
                        }
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </EmptyCard>
            <Seperator />
            <EmptyCard>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("InfoforGuest")}
              >
                <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
                  <CircularBtnIcon
                    onPress={() => navigation.navigate("InfoforGuest")}
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
            <Seperator />
            <EmptyCard
              children={
                <View style={styles.bottomCardContainer}>
                  <SwitchWithText
                    header={"Instant booking"}
                    descriptiom={
                      "When this is on, bookings are accepted automatically."
                    }
                    switchColor={colors.primary}
                    switchIsOn={instantBooking}
                    switchOnToggle={(e) => {
                      setInstantBooking(true);
                      setManualBooking(false);
                    }}
                  />
                </View>
              }
            />
            <Seperator />
            <EmptyCard
              children={
                <View style={styles.bottomCardContainer}>
                  <SwitchWithText
                    header={"Manual booking"}
                    descriptiom={"I want to accept or decline booking requests"}
                    switchColor={colors.primary}
                    switchIsOn={manualBooking}
                    switchOnToggle={(e) => {
                      setInstantBooking(false);
                      setManualBooking(true);
                    }}
                  />
                </View>
              }
            />
          </>
        )}
        {btnPressed == 2 && (
          <>
            <EmptyCard
              children={
                <View style={styles.emptyCardContainer}>
                  <Typography.HH>Title</Typography.HH>
                  <Inputfield
                    valueChange={propertyTitle}
                    placeHolder={""}
                    changeTextHanlder={setPropertyTitle}
                  />
                  <Typography.HH>Description</Typography.HH>
                  <Inputfield
                    multiline
                    valueChange={propertyDesc}
                    placeHolder={""}
                    changeTextHanlder={setPropertyDesc}
                  />
                  {/* <Typography.HH>Highlights</Typography.HH> */}

                  {/* {mergeHighLights.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                    >
                      <View style={styles.listItem}>
                        <Image style={{ width: 20, height: 20 }} source={{ uri: item.uri }} />

                        <Text style={{ textAlign: 'left', paddingLeft: 20 }}>{item.name}</Text>
                        <View style={{ marginLeft: 30 }} >
                          <CheckBox
                            value={item.matched}
                            style={{ width: 24, height: 24, }}
                            onCheckColor={colors.primary}
                            onTintColor={colors.primary}
                            onValueChange={() => { handleCheckboxHighlights(item) }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))} */}
                  {/* <Inputfield
                    // scrollEnabled={edit}
                    multiline
                    // editable={edit}
                    // changeTextHanlder={setBio}
                    valueChange={JSON.stringify(highLights)}
                    placeHolder={""}
                    icon2Status
                    icon2={images.Edit(colors.black)}
                  /> */}
                </View>
              }
            />
            {image.length === 0 ? (
              <View style={styles.cardView}>
                <View style={{ paddingRight: 20 }}>
                  <Typography.HH>
                    You'll need 5 photos to get started. Please take high
                    quality photos to show how beautiful your place is and bring
                    it to life
                  </Typography.HH>
                </View>
                <View style={styles.btnView}>
                  <View style={styles.addPhoto}>
                    <BtnContain
                      label="Add Photo"
                      color={colors.darkBlue}
                      labelcolor="white"
                      onPress={() => chooseFile("photo")}
                    />
                  </View>
                  <View style={styles.takePhoto}>
                    <BtnContain
                      label="Take new photo"
                      color={colors.darkBlue}
                      labelcolor="white"
                      onPress={() => captureImage("photo")}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.dragToReorderView}>
                  <Typography.P color={colors.paragraphColor}>
                    Photos
                  </Typography.P>
                </View>
                <View style={styles.flatListView}>
                  <DraggableFlatListPlace
                    profileData={image}
                    onCrossClick={(item) => {
                      onCrossClick(item), setImageChange(true);
                    }}
                    newOrder={(res) => {
                      setImage(res), setImageChange(true);
                    }}
                    firstImage={firstImage}
                    firstItem={(res) => {
                      setFirstImage(res), setImageChange(true);
                    }}
                  />
                  {image.length < 19 && (
                    <TouchableOpacity
                      onPress={() => chooseFile("photo")}
                      style={{
                        width: 103,
                        height: 103,
                        borderWidth: 2,
                        borderColor: colors.primary,
                        borderRadius: 18,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 20,
                        marginTop: 10,
                      }}
                    >
                      <SvgXml xml={images.PlusIcon(colors.primary)} />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </>
        )}
        {/* <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <CalendarView minDate={new Date()} onChangePeriod={setPeriod} />

            <Button title="Close" onPress={toggleModal} />
          </View>
        </Modal> */}
        {btnPressed == 3 && (
          <>
            <EmptyCard>
              <View style={styles.emptyCardContainer}>
                <Typography.HH>Availability</Typography.HH>
                {/* <Inputfield
                  // scrollEnabled={edit}
                  multiline
                  // editable={false}
                  // changeTextHanlder={setBio}
                  valueChange={availableDates}
                  placeHolder={""}
                  icon2Status
                  icon2={images.Edit(colors.black)}
                  onPressIcon2={() => toggleModal()}
                /> */}
                <TouchableOpacity
                  onPress={() => toggleModal()}
                  style={{
                    // backgroundColor: "red",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ maxWidth: 320 }}>{availableDates}</Text>
                    <SvgXml
                      height={25}
                      width={25}
                      style={{}}
                      xml={images.Edit(colors.black)}
                    />
                  </View>
                  <Seperator />
                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.horizontalLineColor,
                      width: "100%",
                    }}
                  />
                </TouchableOpacity>
                {modalVisible && (
                  <CalendarView
                    rangeSelection
                    onChangeRanges={setRanges}
                    ranges={data.availabilityDateRanges}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <Typography.HH>Price</Typography.HH>
                  <CountrySelectorButton
                    currencyValue={currency}
                    onChangeCountry={currencySelect}
                  />
                </View>
                <Inputfield
                  keyboardType="numeric"
                  changeTextHanlder={setPlacePrice}
                  valueChange={placePrice.toString()}
                  placeHolder={""}
                  icon2Status
                  icon2={images.Edit(colors.black)}
                  // editable={editPrice}
                  onPressIcon2={() => setEditPrice(!editPrice)}
                />
              </View>
            </EmptyCard>
            <Seperator />
            <EmptyCard>
              <View style={styles.emptyCardContainer}>
                <View style={{ paddingHorizontal: 20 }}>
                  <Typography.T3 textAlign={"left"}>
                    Pricing Guidelines
                  </Typography.T3>
                  <Seperator />
                  <Text style={{ lineHeight: 22 }}>
                    Price per night should be what you pay for rent per night.
                    You can add up to 10% to account for wear and tear,
                    utilities, consumables, etc.
                  </Text>
                  <Seperator />
                  <Text style={{ lineHeight: 22 }}>
                    Cercles community will see your price inclusive of a small
                    fee to cover payment processing and other costs needed to
                    sustain the platform.
                  </Text>
                  <Seperator seperate={10} />
                </View>
              </View>
            </EmptyCard>
            <Seperator />
            <EmptyCard>
              <View style={styles.emptyCardContainer}>
                <View
                  style={{
                    marginHorizontal: 20,
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  <SvgXml xml={images.HeartIcon(colors.primary)} />
                  <Typography.T3 textAlign={"left"}>
                    {"You are a gracious host,\nthanks for your kind pricing"}
                  </Typography.T3>
                </View>
                <Typography.HH lineHeight={22}>
                  Cercles is built so we can share our homes with our truest,
                  member-only community, and help make travel more accessible
                  and affordable.
                </Typography.HH>
                <Seperator seperate={10} />
              </View>
            </EmptyCard>

            <Seperator />
            {/* <EmptyCard>
              <View style={styles.emptyCardContainer}>
                <View style={{ marginHorizontal: 20 }}>
                  <Typography.T3 textAlign={"left"}>Please Note</Typography.T3>
                </View>
                <Typography.HH>
                  Prices will be closely monitored so we can achieve this goal
                  together
                </Typography.HH>
                <Seperator seperate={10} />
              </View>
            </EmptyCard> */}
          </>
        )}
        <Seperator seperate={10} />
        <ConfirmCancelBtn
          position={"relative"}
          width={"100%"}
          onPressConfirm={() => editListingData()}
          onPressCancel={() => navigation.goBack()}
          confirmTitle={"Save"}
          cancelTitle={"Back"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
        />
        <Seperator />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCardContainer: {
    paddingTop: 20,
  },
  weeksView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 25,
  },
  horizontalLine: {
    width: "90%",
    alignSelf: "center",
    height: 1,
    backgroundColor: colors.horizontalLineColor,
  },
  map: {
    height: 200,
    width: "90%",
    alignSelf: "center",
  },
  bottomCardContainer: {
    width: "100%",
    paddingTop: 20,
    paddingRight: 15,
    paddingLeft: 5,
    paddingBottom: 20,
    gap: 10,
  },
  BackButton: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: "3%",
  },
  addPhoto: {
    width: "45%",
  },
  saparator: {},
  cardView: {
    marginTop: 20,
  },
  takePhoto: {
    width: "45%",
  },
  btnView: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  flatListView: {
    marginTop: 20,
  },
  dragToReorderView: {
    marginTop: 20,
    marginLeft: 20,
  },
  currencySelector: {
    alignSelf: "flex-end",
    position: "absolute",
    right: "5%",
    top: "50%",
  },
});

export default EditListings;
