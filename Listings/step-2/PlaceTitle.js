import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
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
import { placeTitle } from "../../../redux/Actions/userListingAction";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";
const PlaceTitle = ({ navigation }) => {
  const [bioInput, setBioInput] = useState("");
  const [bioInputLength, setBioInputLength] = useState(0);
  const [loader, setLoader] = useState(false);
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);

  const dispatch = useDispatch();
  const onPressCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);
  const bioInputHandler = (text) => {
    if (text.length <= 64) {
      setBioInput(text);
      setBioInputLength(text.length);
    }
  };

  const onPressConfirm = () => {
    if (bioInput === "") {
      Alert.alert("Please give your place a title");
      return false;
    }

    const objectToAdd = { title: bioInput };
    draftData.title = bioInput;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
    dispatch(placeTitle(objectToAdd));
    navigation.navigate("DescribePlaceSecond");
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton
          onPress={() => navigation.goBack()}
          Text={"Now, give your home \na title"}
          onPressButton={() => saveAndExitListing("PlaceTitle", navigation)}
          buttonStatus
          buttonText={"Save & Exit"}
        />
        <Saparator />
        <SpinnerOverlay loaderState={loader} />

        <EmptyCard>
          <Saparator />
          <Typography.HH>Short titles work best</Typography.HH>

          <View style={{ marginLeft: 20, marginTop: 20 }}>
            <Typography.ChileLine
              color={colors.grayText}
              size={12}
              fontweight={700}
            >
              Apartment name
            </Typography.ChileLine>
            <View
              style={{ alignItems: "flex-end", marginRight: 20, bottom: 15 }}
            >
              <Typography.ChileLine
                color={colors.grayText}
                size={12}
                fontweight={400}
              >
                {bioInputLength}/64
              </Typography.ChileLine>
            </View>
          </View>
          <Inputfield
            changeTextHanlder={(e) => bioInputHandler(e)}
            valueChange={bioInput}
            placeHolder={"Spacious, 1-bed walk-up in the hear of Williamsburg"}
            maxLength={500}
          />
        </EmptyCard>

        <SaparatorBottom />
        <ProgressBar progress={0.7} percentage={70} />
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

export default PlaceTitle;

const styles = StyleSheet.create({
  skipLaterText: {
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
