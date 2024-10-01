import _isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import * as Button from "../../../components/Button";
import SwitchWithText from "../../../components/SwitchWithText";
import BackButton from "../../../components/backButton";
import CalendarView from "../../../components/calendarView";
import EmptyCard from "../../../components/forms/emptyCard";
import ProgressBar from "../../../components/progressBar";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import { placeDate } from "../../../redux/Actions/userListingAction";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";

const DescribePlaceDateSelect = ({ navigation }) => {
  const dispatch = useDispatch();
  const [instantBooking, setInstantBooking] = useState(false);
  const [manualBooking, setManualBooking] = useState(true);
  const [period, setPeriod] = useState({});
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const instantBook = () => {
    setInstantBooking(true);
    setManualBooking(false);
  };
  const manualBook = () => {
    setInstantBooking(false);
    setManualBooking(true);
  };

  const onPressConfirm = () => {
    const dateObj = {
      period: period,
      instant: instantBooking,
      manual: manualBooking,
    };
    draftData.availabilityDateRanges = period;
    draftData.instantBookingAllowed = instantBooking;
    draftData.manualBookingAllowed = manualBooking;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
    dispatch(placeDate(dateObj));
    navigation.navigate("Summary");
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"When is your \nhome available?"}
        onPressButton={() =>
          saveAndExitListing("DescribePlaceDateSelect", navigation)
        }
        buttonStatus
        buttonText={"Save & Exit"}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.TypographyView}>
          <Typography.ChileLine
            color={colors.grayText}
            size={16}
            fontweight={500}
          >
            You can always change that later
          </Typography.ChileLine>
        </View>
        <View style={styles.saparator} />
        <View style={styles.calendarStyle}>
          <CalendarView
            minDate={new Date()}
            rangeSelection
            onChangeRanges={setPeriod}
          />
        </View>
        <View style={styles.skipLaterText}>
          <Button.BtnTxtUnderline
            color={colors.darkBlue}
            label="Set up later"
            // onPress={() => navigation.navigate("Summary")}
          />
        </View>
        <View style={styles.TypographyGuestView}>
          <Typography.ChileLine
            color={colors.darkBlue}
            size={18}
            fontweight={700}
          >
            How Guests can book?
          </Typography.ChileLine>
        </View>
        <View style={styles.saparator} />
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
                switchOnToggle={instantBook}
              />
            </View>
          }
        />
        <View style={styles.saparator} />

        <EmptyCard
          children={
            <View style={styles.bottomCardContainer}>
              <SwitchWithText
                header={"Manual booking"}
                descriptiom={"I want to accept or decline booking \n requests"}
                switchColor={colors.primary}
                switchIsOn={manualBooking}
                switchOnToggle={manualBook}
              />
            </View>
          }
        />
        <View style={{ marginTop: "60%" }} />
        <ProgressBar progress={0.99} percentage={99} />
        <Button.BtnConfirmCancel
          onPressConfirm={() => onPressConfirm()}
          onPressCancel={() => onPressCancel()}
          confirmTitle={"Next"}
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
  iconView: {
    alignSelf: "center",
    width: 272,
    height: 247,
  },
  headerText: {
    marginLeft: 30,
    marginTop: 20,
    maxWidth: 300,
  },
  saparator: {
    marginTop: 10,
  },
  TypographyGuestView: {
    marginTop: 20,
    marginLeft: 20,
  },
  horizontalLine: {
    height: 1,
    width: "50%",
    backgroundColor: colors.horizontalLineColor,
    alignSelf: "center",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 20,
    marginTop: 20,
  },
  TypographyView: {
    marginLeft: 20,
  },
  operatorStyle: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    borderColor: colors.horizontalLineColor,
    borderWidth: 1,
    justifyContent: "center",
  },
  operatorText: {
    textAlign: "center",
  },
  calendarStyle: {
    width: "90%",
    alignSelf: "center",
  },
  skipLaterText: {
    marginLeft: 20,
    marginTop: 10,
  },
  bottomCardContainer: {
    width: "100%",
    paddingTop: 20,
    paddingRight: 15,
    paddingLeft: 5,
    paddingBottom: 20,
    gap: 10,
  },
});

export default DescribePlaceDateSelect;
