import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import images from "../../../assets";
import * as Button from "../../../components/Button";
import BackButton from "../../../components/backButton";
import EmptyCard from "../../../components/forms/emptyCard";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import Seperator from "../../../components/Seperator";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";
import { useDispatch } from "react-redux";
const StepTwoListings = ({ navigation }) => {
  const dispatch = useDispatch();
  const onPressConfirm = () => {
    navigation.navigate("PlaceOffers");
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const onPressCancel = () => {
    navigation.goBack();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <BackButton
          onPress={() => navigation.goBack()}
          Text={"New home"}
          onPressButton={() =>
            saveAndExitListing("StepTwoListings", navigation)
          }
          buttonStatus
          buttonText={"Save & Exit"}
        />
        <View style={styles.iconView}>
          <SvgXml xml={images.StepTwoListings()} />
        </View>

        <View style={{ marginTop: "20%" }} />

        <EmptyCard>
          <View style={styles.headerText}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={12}
              fontweight={500}
            >
              Step 2
            </Typography.ChileLine>
            <View style={styles.saparator} />

            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={700}
            >
              Make your home stand out
            </Typography.ChileLine>
            <View style={styles.saparator} />
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              List the amenities in the accommodation and add at least 5 photos,
              then enter a title and description
            </Typography.ChileLine>
          </View>
          <View style={styles.saparator} />
        </EmptyCard>
        <Seperator seperate={10} />
        <View style={styles.btmBtn}>
          <Button.ConfirmCancelBtn
            onPressConfirm={() => onPressConfirm()}
            onPressCancel={() => onPressCancel()}
            confirmTitle={"Next"}
            cancelTitle={"Back"}
            cancelButtonColor={colors.white}
            cancelTextColor={colors.darkBlue}
          />
        </View>
      </View>
    </ScrollView>
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
    marginTop: 30,
  },
  headerText: {
    // marginLeft: 30,
    // marginTop: 20,
    maxWidth: 300,
    padding: 20,
  },
  saparator: {
    marginTop: 10,
  },
  btmBtn: {
    position: "absolute",
    width: "100%",
    bottom: "3%",
  },
});

export default StepTwoListings;
