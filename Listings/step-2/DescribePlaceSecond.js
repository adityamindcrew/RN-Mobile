import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import * as Button from "../../../components/Button";
import BackButton from "../../../components/backButton";
import EmptyCard from "../../../components/forms/emptyCard";
import Inputfield from "../../../components/forms/inputField";
import ProgressBar from "../../../components/progressBar";
import SpinnerOverlay from "../../../components/spinner";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import { placeDesc } from "../../../redux/Actions/userListingAction";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";

const DescribePlaceSecond = ({ navigation }) => {
  const [bioInput, setBioInput] = useState("");
  const [bioInputLength, setBioInputLength] = useState(0);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const onPressCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const bioInputHandler = (e) => {
    if (e.length <= 500) {
      setBioInput(e);
      setBioInputLength(e.length);
    }
  };

  const onPressConfirm = () => {
    // if (bioInput === "") {
    //   Alert.alert("Please enter a description");
    //   return;
    // }
    const objectToAdd = { placdeDesc: bioInput };
    draftData.description = bioInput;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
    dispatch(placeDesc(objectToAdd));
    navigation.navigate("StepThreeListings");
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton
          onPress={() => navigation.goBack()}
          onPressButton={() =>
            saveAndExitListing("DescribePlaceSecond", navigation)
          }
          buttonStatus
          buttonText={"Save & Exit"}
          Text={"How would you \ndescribe your home?"}
        />
        <Saparator />
        <SpinnerOverlay loaderState={loader} />
        <View style={styles.TypographyView}>
          <Typography.ChileLine
            color={colors.grayText}
            size={16}
            fontweight={500}
          >
            Tell us what makes your apartment special
          </Typography.ChileLine>
        </View>
        <Saparator />

        <EmptyCard>
          <Saparator />

          <View style={{ marginLeft: 20, marginTop: 10 }}>
            <Typography.ChileLine
              color={colors.grayText}
              size={12}
              fontweight={700}
            >
              Apartment description
            </Typography.ChileLine>
            <View
              style={{ alignItems: "flex-end", marginRight: 20, bottom: 15 }}
            >
              <Typography.ChileLine
                color={colors.grayText}
                size={12}
                fontweight={400}
              >
                {bioInputLength}/500
              </Typography.ChileLine>
            </View>
          </View>
          <Inputfield
            changeTextHanlder={(e) => bioInputHandler(e)}
            valueChange={bioInput}
            multiline
            placeHolder={
              "My apt is located at a quite, tree filled street, with stunning views of the nearby Washington square park. The apartment is charming with high ceilings, exposed bricks, and tons of natural light. It’s super centrally located, few steps away to some of the best restaurants, coffee shops, cool bars, and boutique shops in the west village.\n\nI’m escaping the NYC winter and will be out all of December, so prefer a 1 month minimum rent."
            }
            maxLength={500}
          />
        </EmptyCard>
        <SaparatorBottom />
        {/* <Typography.HH>
          You can later fill up Info for Guests: Check-in instructions, Wifi,
          House rules, House Manual. You will find these under:{"  "} */}
        <Text
          onPress={onPressConfirm}
          style={{
            textDecorationLine: "underline",
            textDecorationColor: colors.black,
            color: colors.black,
            fontSize: 13,
            marginLeft: 30,
            fontWeight: "500",
          }}
        >
          Skip for later
        </Text>
        {/* </Typography.HH> */}
        <View style={styles.skipLaterText}></View>
        <ProgressBar progress={0.9} percentage={90} />
        <Button.BtnConfirmCancel
          onPressConfirm={() => onPressConfirm()}
          onPressCancel={() => onPressCancel()}
          confirmTitle={"Next"}
          cancelTitle={"Back"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
        />
      </ScrollView>
    </Container>
  );
};

export default DescribePlaceSecond;

const styles = StyleSheet.create({
  skipLaterText: {
    marginLeft: 20,
  },
  TypographyView: {
    marginLeft: 20,
  },
});

const Container = styled.View`
  flex: 1;
`;
const Saparator = styled.View`
  margin-top: 10px;
`;

const SaparatorBottom = styled.View`
  margin-top: 20px;
`;
