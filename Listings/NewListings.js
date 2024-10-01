import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import images from "../../assets";
import * as Button from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
const NewListings = ({ navigation }) => {
  const onPressConfirm = () => {
    navigation.navigate("DescribePlace");
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} Text={"New home"} />
      <View style={styles.iconView}>
        <SvgXml xml={images.NewListingsIcon()} />
      </View>
      <EmptyCard>
        <View style={styles.headerText}>
          <Typography.ChileLine
            color={colors.darkBlue}
            size={12}
            fontweight={500}
          >
            Step 1
          </Typography.ChileLine>
          <View style={styles.saparator} />

          <Typography.ChileLine
            color={colors.darkBlue}
            size={16}
            fontweight={700}
          >
            Tell us about your home
          </Typography.ChileLine>
          <View style={styles.saparator} />
          <Typography.ChileLine
            color={colors.grayText}
            size={14}
            fontweight={500}
          >
            In this step, we’ll ask you which type of property you have and if
            guests will book the entire place or just a room. Then let us know
            the location and how many guests can stay
          </Typography.ChileLine>
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
    width: "90%",
    height: "50%",
  },
  headerText: {
    padding: 20,
  },
  saparator: {
    marginTop: 10,
  },
});

export default NewListings;
