import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import BackButton from "../../components/backButton";
import CheckBoxComp from "../../components/checkbox";
import EmptyCard from "../../components/forms/emptyCard";
import ProgressBar from "../../components/progressBar";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { guestPlaceType } from "../../redux/Actions/userListingAction";
import { storage } from "../../components/asyncStorageToken";

const PlaceType = ({ navigation }) => {
  const dispatch = useDispatch();
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const [draftList, setDraftList] = useState("");
  const [checkboxes, setCheckboxes] = useState([
    {
      id: 1,
      label: "An entire place",
      description: "Guests have the whole place to themselves",
      icon: images.HouseIcon(),
      checked: false,
    },
    {
      id: 2,
      label: "A private room",
      description:
        "Guests sleep in a private room but some areas may be shared with you or others",
      icon: images.SaparateRoomIcon(),
      checked: false,
    },
    {
      id: 3,
      label: "A shared room",
      description:
        "Guests sleep in a room or common area that may be shared with you or others",
      icon: images.SharedRoomIcon(),
      checked: false,
    },
    // Add more items as needed
  ]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCheckboxChange = (check) => {
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      if (checkbox.id === check.id) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
      return checkbox;
    });
    setCheckboxes(updatedCheckboxes);
    if (check.id === 1) {
      setSelectedItem("Entire");
      draftData.selection = "Entire";
      setDraftList(draftData);
    }
    if (check.id === 2) {
      setSelectedItem("Private");
      draftData.selection = "Private";
      setDraftList(draftData);
    }
    if (check.id === 3) {
      setSelectedItem("Shared");
      draftData.selection = "Shared";
      setDraftList(draftData);
    }
  };

  const onPressConfirm = () => {
    if (selectedItem === null) {
      Alert.alert("Please select place type");
      return false;
    }
    const objectToAdd = { selection: selectedItem };
    dispatch(guestPlaceType(objectToAdd));
    navigation.navigate("PlaceLocation");
    storage.set("drafted_Listing", JSON.stringify(draftList));
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"What type of home will guests have?"}
      />
      <EmptyCard>
        {checkboxes.map((checkbox) => (
          <TouchableOpacity
            onPress={() => handleCheckboxChange(checkbox)}
            style={styles.textIconView}
          >
            <View style={{ flexDirection: "row" }}>
              <SvgXml width={23} height={29} xml={checkbox.icon} />
              <View style={styles.textView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={600}
                >
                  {checkbox.label}
                </Typography.ChileLine>

                <View style={styles.smallTextView}>
                  <Typography.ChileLine
                    color={colors.grayText}
                    size={12}
                    fontweight={500}
                  >
                    {checkbox.description}
                  </Typography.ChileLine>
                </View>
              </View>
            </View>
            <SvgXml
              onPress={() => handleCheckboxChange(checkbox)}
              height={checkbox.checked ? 28 : 25}
              width={checkbox.checked ? 28 : 25}
              xml={
                checkbox.checked
                  ? images.TickIcon(colors.primary)
                  : images.BlankCircleIcon(colors.primary)
              }
            />
          </TouchableOpacity>
        ))}
      </EmptyCard>
      <Button.BtnConfirmCancel
        onPressConfirm={() => onPressConfirm()}
        onPressCancel={() => onPressCancel()}
        confirmTitle={"Next"}
        cancelTitle={"Back"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      />

      <ProgressBar progress={0.1} percentage={10} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  textIconView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 15,
    alignItems: "center",
    paddingLeft: 20,
  },
  textView: {
    marginLeft: 10,
  },
  pointsSpacingView: {
    flexDirection: "row",
    marginLeft: 20,
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
  bottomStyle: {
    marginTop: 30,
  },
});

export default PlaceType;
