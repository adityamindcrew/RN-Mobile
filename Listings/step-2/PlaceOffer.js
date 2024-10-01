import React, { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Button from "../../../components/Button";
import BackButton from "../../../components/backButton";
import CardIconText from "../../../components/cardIconText";
import ProgressBar from "../../../components/progressBar";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import { addAmenties } from "../../../redux/Actions/userListingAction";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";
const PlaceOffers = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsAdditional, setSelectedItemsAdditional] = useState([]);

  const [item, setItem] = useState([]);
  const { masterData } = useSelector((state) => state.userListingReducer);
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);
  const onPressConfirm = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Please select at least one Amenities");
      return false;
    }

    const obj = {
      selectedItems,
      selectedItemsAdditional,
    };
    draftData.amenities = selectedItems;
    draftData.additionalAmenities = selectedItemsAdditional;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
    dispatch(addAmenties(obj));
    navigation.navigate("AddPlacePhoto");
  };
  const onPressCancel = () => {
    navigation.goBack();
  };

  const renderItem = (item) => {
    const isSelected = selectedItems.includes(item.item.id);
    const handleItemPress = () => {
      if (isSelected) {
        setSelectedItems(selectedItems.filter((key) => key !== item.item.id));
      } else {
        setSelectedItems([
          ...selectedItems,
          item.item.id,
          { id: item.item.id, name: item.item.name, uri: item.item.uri },
        ]);
      }
    };
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 3,
          paddingHorizontal: 5,
        }}
      >
        <CardIconText
          status={isSelected}
          iconPress={() => handleItemPress()}
          image={item.item.uri}
          title={item.item.name}
        />
      </View>
    );
  };

  const renderItemAdditional = (item) => {
    const isSelected = selectedItemsAdditional.includes(item.item.id);
    const handleItemPress = () => {
      if (isSelected) {
        setSelectedItemsAdditional(
          selectedItemsAdditional.filter((key) => key !== item.item.id)
        );
      } else {
        setSelectedItemsAdditional([
          ...selectedItemsAdditional,
          item.item.id,
          { id: item.item.id, name: item.item.name, url: item.item.uri },
        ]);
      }
    };
    return (
      <View
        style={{
          margin: 5,
          alignItems: "center",
          flex: 1,
        }}
      >
        <CardIconText
          status={isSelected}
          iconPress={() => handleItemPress()}
          image={item.item.uri}
          title={item.item.name}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Tell guests what your home has to offer"}
        onPressButton={() => saveAndExitListing("PlaceOffers", navigation)}
        buttonStatus
        buttonText={"Save & Exit"}
      />

      <View style={styles.headingText}>
        <Typography.ChileLine
          color={colors.grayText}
          size={16}
          fontweight={500}
        >
          Tell guests what your home has to offer
        </Typography.ChileLine>
      </View>
      <View style={styles.saparator} />
      <ScrollView>
        <FlatList
          data={masterData?.masterAmenities}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          extraData={selectedItems}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
        <View style={styles.BottomText}>
          <Typography.ChileLine
            color={colors.darkBlue}
            size={17}
            fontweight={700}
          >
            Tell guests what your home has to offer
          </Typography.ChileLine>
        </View>
        <View style={styles.saparator} />

        <FlatList
          data={masterData?.masterAdditionalAmenities}
          renderItem={renderItemAdditional}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
        <View style={styles.bottomSaparator}>
          <ProgressBar progress={0.5} percentage={50} />
        </View>
        <View style={styles.bottomSaparator}>
          <Button.BtnConfirmCancel
            onPressConfirm={() => onPressConfirm()}
            onPressCancel={() => onPressCancel()}
            confirmTitle={"Next"}
            cancelTitle={"Back"}
            cancelButtonColor={colors.white}
            cancelTextColor={colors.darkBlue}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  saparator: {
    marginTop: 20,
  },
  headingText: {
    marginLeft: 20,
  },
  BottomText: {
    marginLeft: 20,
    marginTop: 20,
  },
  bottomSaparator: {
    marginTop: 90,
    bottom: 20,
  },
});

export default PlaceOffers;
