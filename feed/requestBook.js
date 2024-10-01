import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import { CircularBtnIcon } from "../../components/Button";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";

const RequestBook = ({ navigation }) => {
  const [bottomPopUpStatus, setBottomPopUpStatus] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);
  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => navigation.goBack()}
        Text={"Request to Book"}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.cardContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/download1.jpeg")}
            resizeMode="cover"
          />
          <View style={styles.contentContainer}>
            <Typography.ChileLine
              color={colors.grayText}
              size={12}
              fontweight={700}
            >
              Private room in home
            </Typography.ChileLine>
            <View style={styles.saparator} />

            <Typography.ChileLine
              color={colors.darkBlue}
              size={14}
              fontweight={700}
            >
              Private room in Brooklyn, NY, close to bus/train station
            </Typography.ChileLine>
          </View>
        </View>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.contentSet}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={500}
            >
              Dates
            </Typography.ChileLine>
            <View style={styles.saparator} />

            <Typography.ChileLine
              color={colors.grayText}
              size={16}
              fontweight={500}
            >
              Feb 13 -14, 2023
            </Typography.ChileLine>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />
        <EmptyCard>
          <View style={styles.contentSet}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={18}
              fontweight={700}
            >
              Price details
            </Typography.ChileLine>
            <View style={styles.priceContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={500}
              >
                $32.00 x 1 night
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  $32.00
                </Typography.ChileLine>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={500}
              >
                Insurance fee
                <TouchableOpacity>
                  <SvgXml
                    style={styles.insuranceIconView}
                    height={12}
                    width={12}
                    xml={images.InformationIcon()}
                  />
                </TouchableOpacity>
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={500}
                >
                  $1.26
                </Typography.ChileLine>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={700}
              >
                Total (USD)
              </Typography.ChileLine>
              <View style={styles.priceView}>
                <Typography.ChileLine
                  color={colors.darkBlue}
                  size={14}
                  fontweight={700}
                >
                  $49.19
                </Typography.ChileLine>
              </View>
            </View>
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.wantToPayView}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={700}
            >
              How do you want to pay?
            </Typography.ChileLine>
          </View>
          <View style={styles.addPaymentView}>
            <Button.BtnContain
              label="Add payment method"
              color={colors.darkBlue}
              labelcolor="white"
              onPress={() => setBottomPopUpStatus(true)}
            />
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.imgHostView}>
            <Image
              style={styles.userImg}
              source={{ uri: "https://www.w3schools.com/howto/img_avatar.png" }}
            />
            <View style={styles.hostNameView}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={16}
                fontweight={700}
              >
                Hosted by Craig
              </Typography.ChileLine>
            </View>
          </View>
          <View style={styles.hostMszView}>
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              Let the Host know why you’re traveling and when you’ll check in
            </Typography.ChileLine>
          </View>
          <View style={styles.ContactHostBtn}>
            <Button.BtnContain
              label="Contact Host"
              color={colors.darkBlue}
              labelcolor="white"
            />
          </View>
        </EmptyCard>
        <View style={styles.saparator} />

        <EmptyCard>
          <View style={styles.groundRules}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={16}
              fontweight={700}
            >
              Ground rules
            </Typography.ChileLine>
          </View>
          <View style={styles.guestText}>
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              We ask every guest to remember a few simple things about what
              makes a great guest
            </Typography.ChileLine>
          </View>
          <View style={styles.houseRulesView}>
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              {"\u2022"} Follow the house rules
            </Typography.ChileLine>
          </View>
          <View style={styles.TreatHomeView}>
            <Typography.ChileLine
              color={colors.grayText}
              size={14}
              fontweight={500}
            >
              {"\u2022"} Treat your Host’s home like your own
            </Typography.ChileLine>
          </View>
          <View style={styles.warningView}>
            <SvgXml height={19} width={18} xml={images.InformationIcon()} />
            <View style={styles.warningText}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={12}
                fontweight={700}
              >
                Your reservation won’t be confirmed until the host accepts your
                request.
              </Typography.ChileLine>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={12}
                fontweight={500}
              >
                You won’t be charged until then.
              </Typography.ChileLine>
            </View>
          </View>
        </EmptyCard>
        <View style={styles.addPaymentBtn}>
          <Button.BtnContain
            label="Request to Book"
            color={colors.primary}
            labelcolor="white"
          />
        </View>
      </ScrollView>

      {bottomPopUpStatus ? (
        <View style={styles.bottomCard}>
          <View style={styles.addPaymentText}>
            <Typography.ChileLine
              color={colors.darkBlue}
              size={18}
              fontweight={700}
            >
              Add payment method
            </Typography.ChileLine>
          </View>
          <CircularBtnIcon
            iconHeight={40}
            iconWidth={40}
            onPress={() => FormVisibilty(true, dispatch)}
            iconStatus
            icon={images.CreditCardIcon(colors.primary)}
            label={"Bank Account"}
            rightArrowIconStatus
          />
          <View style={styles.horizontalLine} />
          <CircularBtnIcon
            iconHeight={40}
            iconWidth={40}
            onPress={() => FormVisibilty(true, dispatch)}
            iconStatus
            icon={images.PaypalIcon(colors.primary)}
            label={"Bank Account"}
            rightArrowIconStatus
          />
          <View style={styles.horizontalLine} />
          <CircularBtnIcon
            iconHeight={40}
            iconWidth={40}
            onPress={() => FormVisibilty(true, dispatch)}
            iconStatus
            icon={images.AppleIcon(colors.primary)}
            label={"Apple Pay"}
            rightArrowIconStatus
          />
          <View style={styles.confirmBtnView}>
            <Button.BtnContain
              label="Back"
              color={colors.darkBlue}
              labelcolor="white"
              onPress={() => setBottomPopUpStatus(false)}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgHostView: {
    flexDirection: "row",
    marginTop: 10,
  },
  warningView: {
    flexDirection: "row",
    marginLeft: 30,
    marginTop: 30,
    bottom: 20,
  },
  hostNameView: {
    alignSelf: "center",
    marginLeft: 20,
  },
  warningText: {
    marginLeft: 10,
    alignSelf: "center",
  },
  groundRules: {
    marginLeft: 20,
    marginTop: 10,
  },
  guestText: {
    marginLeft: 20,
    marginTop: 10,
  },
  houseRulesView: {
    marginLeft: 40,
    marginTop: 10,
  },
  TreatHomeView: {
    marginLeft: 40,
    marginTop: 10,
  },
  hostMszView: {
    marginTop: 10,
    marginLeft: 20,
  },
  addPaymentBtn: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  addPaymentView: {
    marginTop: 40,
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  bottomCardContainer: {
    flex: 1,
    alignItems: "center",
  },
  confirmBtnView: {
    width: "90%",
    alignSelf: "center",
    marginTop: 50,
    bottom: 30,
  },
  addPaymentText: {
    alignSelf: "center",
    marginTop: 30,
    bottom: 10,
  },
  userImg: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
    marginLeft: 20,
  },
  bottomCard: {
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.2,
    borderColor: colors.grayText,
  },
  wantToPayView: {
    marginLeft: 20,
    marginTop: 10,
  },
  cardContainer: {
    flexDirection: "row",
    borderColor: "gray",
    borderRadius: 12,
    backgroundColor: colors.white,
    width: "90%",
    height: "15%",
    alignSelf: "center",
  },
  horizontalLine: {
    width: "95%",
    height: 2,
    backgroundColor: colors.horizontalLineColor,
    marginTop: 5,
    alignSelf: "center",
  },
  ContactHostBtn: {
    marginTop: 40,
    bottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  insuranceIconView: {
    left: 5,
    alignSelf: "center",
    bottom: 2,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  priceView: {
    marginRight: 20,
  },
  contentSet: {
    marginLeft: 20,
    marginTop: 40,
    bottom: 20,
  },
  description: {
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 80,
    alignSelf: "center",
    marginLeft: 20,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  saparator: {
    marginTop: 10,
  },
});

export default RequestBook;
