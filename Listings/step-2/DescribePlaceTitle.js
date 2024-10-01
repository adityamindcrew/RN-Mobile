import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as Button from "../../../components/Button";
import BackButton from "../../../components/backButton";
import ProgressBar from "../../../components/progressBar";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import { addAmentiesHightLights } from "../../../redux/Actions/userListingAction";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";

const DescribePlaceTitle = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { masterData } = useSelector((state) => state.userListingReducer);
  const dispatch = useDispatch();
  const onPressCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const onPressConfirm = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Please select at least one item");
      return false;
    }
    const obj = { selectedItems };
    dispatch(addAmentiesHightLights(obj));
    navigation.navigate("DescribePlaceSecond");
  };

  const renderItem = (item) => {
    const isSelected = selectedItems.includes(item.item.id);
    const toggleItemSelection = () => {
      if (isSelected) {
        setSelectedItems(selectedItems.filter((key) => key !== item.item.id));
      } else {
        setSelectedItems([
          ...selectedItems,
          item.item.id,
          { id: item.item.id, name: item.item.name },
        ]);
      }
    };
    return (
      <TouchableOpacity
        style={isSelected ? styles.selectedParentView : styles.parentView}
        onPress={() => toggleItemSelection()}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: 24, height: 24 }}
            source={{ uri: item.item.uri }}
          />
          <Text style={{ marginLeft: 10, fontSize: 14, fontweight: "500" }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"How would you describe your home?"}
        onPressButton={() =>
          saveAndExitListing("DescribePlaceTitle", navigation)
        }
        buttonStatus
        buttonText={"Save & Exit"}
      />
      <Saparator />
      <View style={styles.TypographyView}>
        <Typography.ChileLine
          color={colors.grayText}
          size={16}
          fontweight={500}
        >
          Choose up to 2 highlights
        </Typography.ChileLine>
      </View>
      <Saparator />
      <View style={{ marginLeft: 20 }}>
        <FlatList
          data={masterData.masterPlaceHighlights}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          extraData={selectedItems}
        />
      </View>

      <SaparatorBottom />
      <ProgressBar progress={0.8} percentage={80} />
      <Button.BtnConfirmCancel
        onPressConfirm={() => onPressConfirm()}
        onPressCancel={() => onPressCancel()}
        confirmTitle={"Next"}
        cancelTitle={"Back"}
        cancelButtonColor={colors.white}
        cancelTextColor={colors.darkBlue}
      />
    </Container>
  );
};

export default DescribePlaceTitle;

const styles = StyleSheet.create({
  skipLaterText: {
    marginLeft: 20,
  },
  TypographyView: {
    marginLeft: 20,
  },
  parentView: {
    height: 43,
    width: "auto",
    backgroundColor: colors.white,
    margin: 5,
    justifyContent: "center",
    padding: 20,
    borderRadius: 23,
  },
  selectedParentView: {
    height: 43,
    width: "auto",
    backgroundColor: colors.white,
    margin: 5,
    borderColor: colors.darkBlue,
    borderWidth: 1,
    justifyContent: "center",
    padding: 20,
    borderRadius: 23,
  },
});

const Container = styled.View`
  flex: 1;
`;
const Saparator = styled.View`
  margin-top: 20px;
`;

const SaparatorBottom = styled.View`
  margin-top: 20px;
`;
