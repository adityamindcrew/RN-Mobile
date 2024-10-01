import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import BackButton from "../../components/backButton";
import CardIconText from "../../components/cardIconText";
import ProgressBar from "../../components/progressBar";
import colors from "../../config/colors";
import { placeType } from "../../redux/Actions/userListingAction";
import { storage } from "../../components/asyncStorageToken";
const DescribePlace = ({ navigation }) => {
  const [houseStatus, setHouseStatus] = useState(false);
  const [apartmentStatus, setApartmentStatus] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const { profileData } = useSelector((state) => state.AccountReducer);
  const dispatch = useDispatch();

  const onPressConfirm = () => {
    if (statusValue === "") {
      Alert.alert("Please select place type");
      return false;
    }
    navigation.navigate("PlaceType");
  };
  const onPressCancel = () => {
    navigation.goBack();
  };
  const typeSelectionHandler = (type) => {
    setStatusValue(type);
    setHouseStatus(true);
    setApartmentStatus(false);
    storage.set(
      "drafted_Listing",
      JSON.stringify({
        type: "House",
        selection: "",
        continent: "",
        country: "",
        city: "",
        streetAddress: "",
        apartment: "",
        zipCode: "",
        latitude: 0,
        longitude: 0,
        guests: 0,
        bedrooms: 0,
        beds: 0,
        bathrooms: 0,
        title: "",
        description: "",
        price: 0,
        currency: "",
        availabilityDateRanges: [],
        instantBookingAllowed: false,
        manualBookingAllowed: true,
        isActive: true,
        amenities: [],
        additionalAmenities: [],
        images: [],
        userId: profileData?.id,
        visibilityStatus: false,
        lastScreen: "",
      })
    );
    const placeTypeObj = { placeType: "House" };
    dispatch(placeType(placeTypeObj));
  };

  const typeSelectionHandlerApartment = (type) => {
    setStatusValue(type);
    setApartmentStatus(true);
    setHouseStatus(false);
    storage.set(
      "drafted_Listing",
      JSON.stringify({
        type: "Apartment",
        selection: "",
        continent: "",
        country: "",
        city: "",
        streetAddress: "",
        apartment: "",
        zipCode: "",
        latitude: 0,
        longitude: 0,
        guests: 0,
        bedrooms: 0,
        beds: 0,
        bathrooms: 0,
        title: "",
        description: "",
        price: 0,
        currency: "",
        availabilityDateRanges: [],
        instantBookingAllowed: false,
        manualBookingAllowed: true,
        houseManual: "",
        isActive: true,
        amenities: [],
        additionalAmenities: [],
        images: [],
      })
    );
    const placeTypeObj = { placeType: "Apartment" };
    dispatch(placeType(placeTypeObj));
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"What best describes your home?"}
      />
      <Button.BtnConfirmCancel
        onPressConfirm={() => onPressConfirm()}
        onPressCancel={() => onPressCancel()}
        confirmTitle={"Next"}
        cancelTitle={"Back"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      />
      <View style={styles.cardView}>
        <CardIconText
          width={"50%"}
          status={houseStatus}
          iconPress={() => typeSelectionHandler("House")}
          icon={images.HouseIcon()}
          title={"House"}
        />
        <CardIconText
          width={"50%"}
          status={apartmentStatus}
          iconPress={() => typeSelectionHandlerApartment("Apartment")}
          icon={images.ApartmentIcon()}
          title={"Apartment"}
        />
      </View>
      <ProgressBar progress={0} percentage={0} />
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
  cardView: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingHorizontal: 15,
    gap: 10,
  },
});

export default DescribePlace;
