import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import Inputfield from "../../components/forms/inputField";
import EmptyCard from "../../components/forms/emptyCard";
import {
  BtnConfirmCancel,
  BtnTxtUnderline,
  CircularSelectionBtnIcon,
  ConfirmCancelBtn,
} from "../../components/Button";
import colors from "../../config/colors";
import Seperator from "../../components/Seperator";
import {
  COMPLETE_PAYOUT_PROCESS,
  SETUP_PAYOUTS,
} from "../../navigation/RouteNames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const HEIGHT = Dimensions.get("window").height;

const ReviewInfo = ({ navigation, route }) => {
  const [data, setData] = useState(route.params.data || {});
  const [selectCard, setSelectCard] = useState(true);
  const [selectPaypal, setSelectPaypal] = useState(false);
  const [addAddressCard, setAddAddressCard] = useState(false);
  const addressComponents = [];

  if (data.lineTwo) {
    addressComponents.push(data.lineTwo);
  }

  if (data.lineOne) {
    addressComponents.push(data.lineOne);
  }

  if (data.city) {
    addressComponents.push(data.city);
  }

  if (data.state) {
    addressComponents.push(data.state);
  }

  if (data.country) {
    addressComponents.push(data.country);
  }

  if (data.zipCode) {
    addressComponents.push(data.zipCode);
  }

  const address = addressComponents.join(", ");

  // const [payoutMethod, setPayoutMethod] = useState('');
  // const [bankAccountType, setBankAccountType] = useState('')
  // const [accountHolderName, setAccountHolderName] = useState('')
  // const [routingNumber, setRoutingNumber] = useState('')
  // const [accountNumber, setAccountNumber] = useState('')
  // const [address, setAddress] = useState('')

  const selectionCard = () => {
    setSelectCard(true);
    setSelectPaypal(false);
  };
  const selectionPaypal = () => {
    setSelectCard(false);
    setSelectPaypal(true);
  };
  const onPressConfirm = () => {
    navigation.navigate(COMPLETE_PAYOUT_PROCESS, { data });
  };
  const onPressCancel = () => {
    navigation.goBack();
  };
  const cardVisible = () => {
    setAddAddressCard(!addAddressCard);
  };
  return (
    <KeyboardAwareScrollView style={{ height: HEIGHT }}>
      <View style={styles.container}>
        <BackButton
          Text={"Set up payouts"}
          onPress={() => navigation.goBack()}
        />
        <View>
          <EmptyCard
            children={
              <View style={styles.bottomCardContainer}>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                  <Typography.BoldHeading>
                    Let’s review your info
                  </Typography.BoldHeading>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Typography.HH>
                    Almost done! Just double-check that everything looks good
                    before you submit.
                  </Typography.HH>
                </View>
                <Typography.HH>Payout method</Typography.HH>
                <Inputfield
                  editable={false}
                  changeTextHanlder={""}
                  placeHolder={"Enter your street address"}
                  valueChange={`Bank account in ${data.country}`}
                />
                <Typography.HH>Bank account type</Typography.HH>
                <Inputfield
                  editable={false}
                  changeTextHanlder={""}
                  placeHolder={"Enter your apartment number"}
                  valueChange={data.accountType}
                />
                <Typography.HH>Account holder name</Typography.HH>
                <Inputfield
                  editable={false}
                  changeTextHanlder={""}
                  placeHolder={"Enter your city"}
                  valueChange={data.accountHolderName}
                />
                <Typography.HH>Account number</Typography.HH>
                <Inputfield
                  editable={false}
                  changeTextHanlder={""}
                  placeHolder={"Enter your Zip code"}
                  valueChange={data.accountNumber}
                />
                <Typography.HH>Routing number</Typography.HH>
                <Inputfield
                  editable={false}
                  changeTextHanlder={""}
                  placeHolder={"Enter your state"}
                  valueChange={data.accountRoutingNumber}
                />
                <Typography.HH>Address</Typography.HH>
                <Inputfield
                  editable={false}
                  changeTextHanlder={""}
                  placeHolder={"USA"}
                  valueChange={address}
                />
              </View>
            }
          />
          <Seperator seperate={10} />
        </View>
        <ConfirmCancelBtn
          position={"relative"}
          width={"100%"}
          onPressConfirm={() => onPressConfirm()}
          onPressCancel={() => onPressCancel()}
          confirmTitle={"Next"}
          cancelTitle={"Back"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
        />
        <Seperator seperate={10} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  formContainer: {
    width: "100%",
    paddingTop: 20,
    gap: 14,
  },
  fieldHeadingText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  inputHeader: {
    marginLeft: -10,
  },
  bottomCardContainer: {
    width: "100%",
    paddingTop: 20,
    paddingRight: 10,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  horizontalLine: {
    width: "91%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    alignSelf: "center",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
});

export default ReviewInfo;
