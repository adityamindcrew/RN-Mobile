import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import * as Button from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import IncreDecreCompo from "../../components/increDecreComponent";
import ProgressBar from "../../components/progressBar";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { placeInfo } from "../../redux/Actions/userListingAction";
import saveAndExitListing from "../../utils/saveAndExitListing";
import { storage } from "../../components/asyncStorageToken";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
const PrimaryInformation = ({ navigation }) => {
  const [guestIncrement, setGuestIncrement] = useState(0);
  const [bedroomsIncrement, setBedroomsIncrement] = useState(0);
  const [bedsIncrement, setBedsIncrement] = useState(0);
  const [bathroomIncrement, setBathroomIncrement] = useState(0);
  const dispatch = useDispatch();
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

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

  const onPressConfirm = () => {
    if (guestIncrement === 0) {
      Alert.alert("Please select number of guests");
      return false;
    }
    if (bedroomsIncrement === 0) {
      Alert.alert("Please select number of bedrooms");
      return false;
    }
    if (bedsIncrement === 0) {
      Alert.alert("Please select number of beds");
      return false;
    }
    if (bathroomIncrement === 0) {
      Alert.alert("Please select number of bathrooms");
      return false;
    }

    const infoArr = [];
    infoArr.push({ name: guestIncrement + " " + "guests" });
    infoArr.push({ name: bedroomsIncrement + " " + "bedrooms" });
    infoArr.push({ name: bathroomIncrement + " " + "bathrooms" });
    infoArr.push({ name: bedsIncrement + " " + "beds" });

    const objectToAdd = {
      infoArr,
      guestIncrement,
      bedroomsIncrement,
      bathroomIncrement,
      bedsIncrement,
    };
    dispatch(placeInfo(objectToAdd));
    navigation.navigate("StepTwoListings");
    draftData.guests = guestIncrement;
    draftData.bedrooms = bedroomsIncrement;
    draftData.beds = bedsIncrement;
    draftData.bathrooms = bathroomIncrement;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Primary information about your home"}
        onPressButton={() =>
          saveAndExitListing("PrimaryInformation", navigation)
        }
        buttonStatus
        buttonText={"Save & Exit"}
      />
      <View style={styles.headingText}>
        <Typography.ChileLine
          color={colors.grayText}
          size={16}
          fontweight={500}
        >
          Share some basics about your place
        </Typography.ChileLine>
      </View>
      <View style={styles.saparator} />

      <EmptyCard>
        <View style={styles.cardContent}>
          <Typography.ChileLine
            color={colors.grayText}
            size={12}
            fontweight={700}
          >
            How many
          </Typography.ChileLine>
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
          <View style={styles.saparator} />

          <Typography.ChileLine
            color={colors.grayText}
            size={12}
            fontweight={700}
          >
            How many
          </Typography.ChileLine>
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
          <View style={styles.saparator} />
          <Typography.ChileLine
            color={colors.grayText}
            size={12}
            fontweight={700}
          >
            How many
          </Typography.ChileLine>
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
          <View style={styles.saparator} />

          <Typography.ChileLine
            color={colors.grayText}
            size={12}
            fontweight={700}
          >
            How many
          </Typography.ChileLine>
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
          <View style={styles.horizontalLine} />
        </View>
        <View style={styles.saparator} />
      </EmptyCard>

      <Button.BtnConfirmCancel
        onPressConfirm={() => onPressConfirm()}
        onPressCancel={() => onPressCancel()}
        confirmTitle={"Next"}
        cancelTitle={"Back"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      />

      <ProgressBar progress={0.4} percentage={40} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saparator: {
    marginTop: 20,
  },
  headingText: {
    marginLeft: 20,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 20,
  },
  weeksView: {
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 10,
    marginTop: 30,
  },
  horizontalLine: {
    width: "96%",
    // alignSelf: "center",
    height: 1,
    backgroundColor: colors.horizontalLineColor,
  },
});

export default PrimaryInformation;
