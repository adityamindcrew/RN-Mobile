import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { BottomButton, CircularBtnIcon } from "../../components/Button";
import BackButton from "../../components/backButton";
import Countries from "../../../Countries.json";
import { useDispatch } from "react-redux";
import { COUNTRY_NAME } from "../../redux/Type";
import { FormVisibilty } from "../../redux/Actions/AccountActions";
import OptimizedFlatlist from "../../components/OptimizedFlatlist";

const CountryList = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState(Countries || []);

  const ChooseCountry = (country) => {
    dispatch({
      type: COUNTRY_NAME,
      payload: country,
    });
    dispatch(FormVisibilty(true));
    navigation.goBack();
  };

  const renderList = ({ item }) => {
    return (
      <CircularBtnIcon
        onPress={() => ChooseCountry(item)}
        label={item.value}
        // isoCode={item.code}
        rightArrowIconStatus
      />
    );
  };
  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => {
          navigation.goBack(), dispatch(FormVisibilty(true));
        }}
        Text={"Countries"}
      />
      <View style={{ height: "80%" }}>
        <OptimizedFlatlist
          contentContainerStyle={styles.contentContainerStyle}
          data={data}
          renderItem={renderList}
        />
      </View>
      <View style={styles.BackButton}>
        <BottomButton
          onPress={() => {
            navigation.goBack(), dispatch(FormVisibilty(true));
          }}
          label={"Back"}
        />
      </View>
    </View>
  );
};

// define your styles
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

//make this component available to the app
export default CountryList;
