import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
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
const StepThreeListings = ({ navigation }) => {
  const dispatch = useDispatch();
  const onPressConfirm = () => {
    navigation.navigate("DescribeYourPriceSelect");
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const onPressCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Finish and publish \nyour home"}
        onPressButton={() =>
          saveAndExitListing("StepThreeListings", navigation)
        }
        buttonStatus
        buttonText={"Save & Exit"}
      />
      <View style={styles.iconView}>
        <SvgXml xml={images.StepThreeListings()} />
      </View>

      <View style={{ marginTop: "20%" }} />

      <EmptyCard>
        <View style={styles.headerText}>
          <Typography.ChileLine
            color={colors.darkBlue}
            size={12}
            fontweight={500}
          >
            Step 3
          </Typography.ChileLine>
          <View style={styles.saparator} />

          <Typography.ChileLine
            color={colors.darkBlue}
            size={16}
            fontweight={700}
          >
            Finish and publish your home
          </Typography.ChileLine>
          <View style={styles.saparator} />
          <Typography.ChileLine
            color={colors.grayText}
            size={14}
            fontweight={500}
          >
            Finally, you'll add your home's rent, and your home's availability.
          </Typography.ChileLine>
          <Seperator />
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
    maxWidth: 320,
  },
  saparator: {
    marginTop: 10,
  },
});

export default StepThreeListings;
