import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import BackButton from "../../components/backButton";
import Seperator from "../../components/Seperator";
import { SearchBar } from "../../components/searchBar";
import { useDispatch, useSelector } from "react-redux";
import * as Button from "../../components/Button";
import colors from "../../config/colors";
import { clearAllFilters } from "../../redux/Actions/FeedActions";

const SearchLocation = ({ navigation }) => {
  const [search, setSearchterm] = useState(false);
  const dispatch = useDispatch();
  const { filterObj } = useSelector((state) => state.FeedReducer);
  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} Text={"Search"} />
      <Seperator />
      <SearchBar
        placeHolder={"Where do you want to travel?"}
        changeTextHanlder={setSearchterm}
        valueChange={search}
        iconStatus={true}
        value={filterObj.city}
        filterHandler={() => navigation.navigate("Filters")}
      />
      <Button.BtnConfirmCancel
        onPressConfirm={() => navigation.goBack()}
        onPressCancel={() => {
          dispatch(clearAllFilters()), navigation.goBack();
        }}
        confirmTitle={"Search"}
        cancelTitle={"Clear all"}
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
});

export default SearchLocation;
