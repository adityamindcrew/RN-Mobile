import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { BottomButton, CircularBtnIcon } from "../../components/Button";
import BackButton from "../../components/backButton";
import currencyList from "../../../Currencies.json";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectCurrency,
  UpdateCurrency,
} from "../../redux/Actions/AccountActions";
import { GetFeedList } from "../../redux/Actions/FeedActions";
import CustomSearchBar from "../../components/CustomSearchBar";
import Seperator from "../../components/Seperator";
import OptimizedFlatlist from "../../components/OptimizedFlatlist";
import CountryPicker from "react-native-country-picker-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Currency = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state) => state.AccountReducer);
  const [countryCode, setCountryCode] = useState("US");
  const [country, setCountry] = useState("United States");
  const [selectedCode, setSelectedCode] = useState(1);
  const [data, setData] = useState(currencyList);

  const currencyPicker = (item) => {
    let formdata = {
      currency: item.currencyCode,
    };
    dispatch(SelectCurrency(`${item.symbol} - ${item.currencyCode}`));
    dispatch(UpdateCurrency(formdata));
    setTimeout(() => {
      dispatch(GetFeedList());
    }, 3000);

    navigation.goBack();
  };

  const searchContacts = (text) => {
    if (text) {
      const data = currencyList.filter((res) => {
        const symbol = res.symbol.toLowerCase();
        const fullName = res.name.toLowerCase();
        const currencyCode = res.currencyCode.toLowerCase();
        const sign = res.sign.toLowerCase();
        const searchText = text.toLowerCase();

        return (
          symbol.includes(searchText) ||
          fullName.includes(searchText) ||
          currencyCode.includes(searchText) ||
          sign.includes(searchText)
        );
      });
      if (data.length > 0) {
        setData(data);
        return;
      }
    }
    setData(currencyList);
  };

  const renderList = ({ item }) => {
    return (
      <CircularBtnIcon
        onPress={() => currencyPicker(item)}
        label={`${item.name} (${item.symbol})`}
        rightArrowIconStatus
      />
    );
  };
  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} Text={"Currency"} />
      <View style={{ height: "80%" }}>
        <CustomSearchBar
          style={{ alignSelf: "center" }}
          onChangeText={searchContacts}
        />
        <Seperator seperate={10} />
        <OptimizedFlatlist
          data={data}
          renderItem={renderList}
          contentContainerStyle={styles.contentContainerStyle}
        />
        {/* <CountryPicker
          {...{
            countryCode,
            withFilter,
            withFlag,
            withCountryNameButton,
            withCallingCode,
            withEmoji,
            onSelect,
          }}
          visible={isVisible}
          onClose={() => setIsVisible(false)}
        /> */}
      </View>
      <View style={styles.BackButton}>
        <BottomButton onPress={() => navigation.goBack()} label={"Back"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  contentContainerStyle: {
    gap: 10,
    width: "100%",
    paddingHorizontal: 15,
  },
});

export default Currency;
