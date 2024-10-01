import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import * as Button from "../../../components/Button";
import { CircularBtnIcon } from "../../../components/Button";
import currencyList from "../../../../Currencies.json";
import BackButton from "../../../components/backButton";
import EmptyCard from "../../../components/forms/emptyCard";
import ProgressBar from "../../../components/progressBar";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import { placePrice } from "../../../redux/Actions/userListingAction";
import Seperator from "../../../components/Seperator";
import CountrySelectorButton from "../../../components/CountrySelectorButton";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import Inputfield from "../../../components/forms/inputField";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";
import { SvgXml } from "react-native-svg";
import images from "../../../assets/index";

const DescribeYourPriceSelect = ({ navigation }) => {
  const [priceChange, setPriceChange] = useState("");
  const [data, setData] = useState(currencyList);
  const [currencyCode, setCurrencyCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const placeHolderText = "0";
  const dispatch = useDispatch();
  const [placeholder, setPlaceholder] = useState(placeHolderText || "");
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);
  const inputRef = useRef();

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const focus = (e) => {
    setPlaceholder("");
  };
  const blur = (e) => {
    let text = e.nativeEvent.text;
    if (text === "") {
      setPlaceholder(placeHolderText);
      return;
    }
  };

  const onPressConfirm = () => {
    if (priceChange === 0 || priceChange === "") {
      Alert.alert("Please set your price per night");
      return false;
    }
    const objectToAdd = {
      price: priceChange,
      currency: currencyCode.currencyCode,
    };
    draftData.price = priceChange;
    draftData.currency = currencyCode.currencyCode;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
    dispatch(placePrice(objectToAdd));
    navigation.navigate("DescribePlaceDateSelect");
  };
  const onPressCancel = () => {
    navigation.goBack();
  };

  const numIncrementHandler = () => {
    setPriceChange(priceChange + 1);
  };

  const numDecrementHandler = () => {
    setPriceChange(priceChange - 1);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const currencySelect = (item) => {
    setCurrencyCode(item);
    setModalVisible(false);
  };

  useMemo(async () => {
    setCurrencyCode({
      countryCode: "US",
      currencyCode: "USD",
      name: "United States Dollar",
      sign: "$",
      symbol: "$",
    });
  }, []);

  const handleInputChange = (text) => {
    // const numericValue = parseFloat(text.replace(/[^0-9.]/g, ""));
    // if (!isNaN(numericValue)) {
    //   setPriceChange(numericValue);
    // } else {
    //   setPriceChange("0");
    // }
    setPriceChange(text);
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"How would you \ndescribe your home?"}
        onPressButton={() =>
          saveAndExitListing("DescribeYourPriceSelect", navigation)
        }
        buttonStatus
        buttonText={"Save & Exit"}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <EmptyCard>
          <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
            <View>
              <Seperator seperate={10} />
              <CountrySelectorButton
                style={styles.currencySelector}
                onChangeCountry={currencySelect}
              />
              <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Seperator seperate={20} />
                {/* <Text style={{ fontSize: 16 }}>
                  {currencyCode === "" ? "$" : currencyCode.symbol}
                </Text> */}
                <TextInput
                  ref={inputRef}
                  keyboardType="numeric"
                  textAlign="center"
                  onChangeText={handleInputChange}
                  value={
                    priceChange.length !== 0
                      ? priceChange.toLocaleString("en-US").toString()
                      : priceChange
                  }
                  returnKeyType="done"
                  placeholder={placeholder}
                  placeholderTextColor={colors.gray}
                  onFocus={focus}
                  onBlur={blur}
                  style={{ fontSize: 16 }}
                />
              </View>
              {/* <TouchableOpacity
              disabled={priceChange === 0 ? true : false}
              style={styles.operatorStyle}
              onPress={() => numDecrementHandler()}
            >
              <Text style={styles.operatorText}>-</Text>
            </TouchableOpacity> */}
              <View style={styles.horizontalLine} />
              {/* <TouchableOpacity
              style={styles.operatorStyle}
              onPress={() => numIncrementHandler()}
            >
              <Text style={styles.operatorText}>+</Text>
            </TouchableOpacity> */}
              <Seperator />
              <View style={{ alignSelf: "center" }}>
                <Typography.ChileLine
                  color={colors.grayText}
                  size={12}
                  fontweight={500}
                >
                  per night
                </Typography.ChileLine>
                <Seperator seperate={10} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </EmptyCard>
        <Seperator seperate={10} />
        <EmptyCard>
          <View style={styles.TypographyView}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={700}
            >
              Pricing Guidelines
            </Typography.ChileLine>
            <View style={styles.saparator} />
            <Typography.ChileLine
              color={colors.darkBlue}
              size={14}
              fontweight={500}
            >
              Price per night should be what you pay for rent per night. You can
              add up to 10% to account for wear and tear, utilities,
              consumables, etc.
            </Typography.ChileLine>
            <View style={styles.saparator} />

            <Typography.ChileLine
              color={colors.darkBlue}
              size={14}
              fontweight={500}
            >
              Cercles community will see your price inclusive of a small fee to
              cover payment processing and other costs needed to sustain the
              platform
            </Typography.ChileLine>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.TypographyView}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <SvgXml xml={images.HeartIcon(colors.primary)} />
              <Typography.ChileLine
                color={colors.darkBlue}
                size={16}
                fontweight={700}
              >
                {"You are a gracious host, thanks for your\n kind pricing"}
              </Typography.ChileLine>
            </View>
            <View style={styles.saparator} />
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              Cercles is built so we can share our homes with our truest,
              member-only community, and help make travel more accessible and
              affordable.
            </Typography.ChileLine>
          </View>
          <View style={styles.saparator} />
        </EmptyCard>
        {/* <EmptyCard>
          <View style={styles.TypographyView}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={700}
            >
              Please Note
            </Typography.ChileLine>
            <View style={styles.saparator} />
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              Prices will be closely monitored so we can achieve this goal
              together
            </Typography.ChileLine>
          </View>
          <View style={styles.saparator} />
        </EmptyCard> */}
        <View style={styles.bottomSaparator} />
        <ProgressBar progress={0.95} percentage={95} />
        <Button.BtnConfirmCancel
          onPressConfirm={() => onPressConfirm()}
          onPressCancel={() => onPressCancel()}
          confirmTitle={"Next"}
          cancelTitle={"Back"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
        />
      </ScrollView>
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
    maxWidth: 300,
  },
  saparator: {
    marginTop: 10,
  },
  horizontalLine: {
    height: 1,
    width: "50%",
    backgroundColor: colors.horizontalLineColor,
    alignSelf: "center",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  TypographyView: {
    padding: 20,
  },
  operatorStyle: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    borderColor: colors.horizontalLineColor,
    borderWidth: 1,
    justifyContent: "center",
  },
  operatorText: {
    textAlign: "center",
  },
  bottomSaparator: {
    marginTop: 180,
    bottom: 20,
  },
  currencySelector: {
    alignSelf: "flex-end",
    position: "absolute",
    right: "5%",
    top: "10%",
  },
});

export default DescribeYourPriceSelect;
