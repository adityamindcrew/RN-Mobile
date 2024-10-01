import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
const LetsStart = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} Text={"Let’s start"} />
      <View style={styles.headerText}>
        <Typography.ChileLine
          color={colors.darkBlue}
          size={18}
          fontweight={700}
        >
          3 easy steps to begin your Cercles journey!
        </Typography.ChileLine>
      </View>

      <View style={styles.saparator} />

      <EmptyCard>
        <View style={styles.EmptyCardContainer}>
          <View style={styles.textIconView}>
            <SvgXml width={23} height={29} xml={images.AboutPlaceIcon()} />
            <View style={styles.textView}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={600}
              >
                1. Tell us about home
              </Typography.ChileLine>
              <View style={styles.smallTextView}>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={12}
                  fontweight={500}
                >
                  Share some basic info, such as where it is and how many guests
                  can stay.{" "}
                </Typography.ChileLine>
              </View>
            </View>
          </View>

          <View style={styles.pointsSpacingView}>
            <SvgXml width={23} height={29} xml={images.StandOutIcon()} />
            <View style={styles.textView}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={600}
              >
                2. Make it stand out
              </Typography.ChileLine>
              <View style={styles.smallTextView}>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={12}
                  fontweight={500}
                >
                  Add 5 or more photos plus a title and description - we’ll help
                  you out.
                </Typography.ChileLine>
              </View>
            </View>
          </View>

          <View style={styles.pointsSpacingView}>
            <SvgXml width={23} height={29} xml={images.FinishPublishicon()} />
            <View style={styles.textView}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={600}
              >
                3. Finish and publish your home
              </Typography.ChileLine>
              <View style={styles.smallTextView}>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={12}
                  fontweight={500}
                >
                  Finally, you'll set your nightly price and your home's
                  availability
                </Typography.ChileLine>
              </View>
            </View>
          </View>
        </View>
      </EmptyCard>

      <View style={styles.BottomBtn}>
        <Button.BtnContain
          label="Start!"
          color={colors.primary}
          labelcolor="white"
          onPress={() => navigation.navigate("NewListings")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    marginLeft: 30,
    maxWidth: 350,
    marginTop: 20,
  },
  textIconView: {
    flexDirection: "row",
    gap: 20,
  },
  textView: {},
  pointsSpacingView: {
    flexDirection: "row",
    gap: 20,
  },
  BottomBtn: {
    width: "90%",
    alignSelf: "center",
    bottom: 30,
    position: "absolute",
  },
  smallTextView: {
    maxWidth: 250,
  },
  saparator: {
    marginTop: 20,
  },
  EmptyCardContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    gap: 30,
  },
});

export default LetsStart;
