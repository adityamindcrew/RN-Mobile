import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import Share from "react-native-share";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import images from "../../../assets";
import * as Button from "../../../components/Button";
import EmptyCard from "../../../components/forms/emptyCard";
import HorizontalFlatlist from "../../../components/horizontalFlatList";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import Seperator from "../../../components/Seperator";
import { LISTINGS } from "../../../navigation/RouteNames";
import { getUserListing } from "../../../redux/Actions/userListingAction";
import featuresText from "../../../utils/featuresText";
import moment from "moment";
import { TouchableWithoutFeedback } from "react-native";
import ProfilePhotoName from "../../../components/ProfilePhotoName";
import formatDate from "../../../utils/formatDate";
import getCurrencyCode from "../../../helpers/getCurrencyCode";
import ViewShot from "react-native-view-shot";
import RNFS from "react-native-fs";

const ShareListings = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState([]);
  const [currencyCode, setCurrencyCode] = useState("");
  const dispatch = useDispatch();
  const {
    PlaceType,
    PlaceLocation,
    PlaceInfo,
    PlacePhoto,
    PlacePrice,
    PlaceDate,
    placeAmenities,
    PlaceTitle,
    PlaceDesc,
    guestPlaceType,
  } = useSelector((state) => state.userListingReducer);

  const mergedArray = [...PlaceInfo.infoArr];
  const customOrder = ["guests", "bedrooms", "beds", "bathrooms"];
  const screenShotRef = useRef();

  useMemo(async () => {
    try {
      const myCurrency = await getCurrencyCode(PlacePrice.currency);
      setCurrencyCode(myCurrency);
    } catch (error) {
      console.log(error);
    }
  }, [PlacePrice.currency]);

  let arr = mergedArray.sort((a, b) => {
    const indexA = customOrder.indexOf(a.name.split(" ")[1]);
    const indexB = customOrder.indexOf(b.name.split(" ")[1]);

    if (indexA < indexB) {
      return -1;
    }
    if (indexA > indexB) {
      return 1;
    }
    return 0;
  });

  const filteredItems = arr.map((item) => item.name);
  const address = PlaceLocation.city + " " + PlaceLocation.country;
  const keys = Object.keys(PlaceDate.period);

  const firstKey = keys[0];
  const firstDate = new Date(firstKey);
  const finalFirstDate = moment(PlaceDate.period[0].start).format(
    "DD-MMMM-YYYY"
  );

  const onPressCancel = () => {
    dispatch(getUserListing());
    navigation.navigate(LISTINGS);
  };

  useEffect(() => {
    let imagess = PlacePhoto.image.map((image) => {
      return {
        fileName: image.id,
        fileSize: null,
        height: null,
        type: "image/png",
        uri: image.uri,
        width: null,
      };
    });
    setImage(imagess);
  }, []);

  const onPressConfirm = async () => {
    try {
      const screenShot = await screenShotRef.current.capture();
      const base64 = await RNFS.readFile(screenShot, "base64");
      let options =
        Platform.OS === "ios"
          ? {
              url: "file://" + screenShot,
              // url: `data:image/png;base64,${base64}`,
              type: "image/png",
              // title: "I'm subletting my....",
              // message: `I'm subletting my ${PlaceType.placeType.toLowerCase()} in ${address}, from ${finalFirstDate}. You can now reserve it through Cercles`,
              filename: "Hotel Image",
            }
          : {
              url: "file://" + screenShot,
              type: "image/png",
              title: "I'm subletting my....",
              message: `I'm subletting my ${PlaceType.placeType.toLowerCase()} in ${address}, from ${finalFirstDate}. You can now reserve it through Cercles`,
              filename: "Hotel Image",
            };
      await Share.open(options);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.flatListContainer}>
        <Text style={styles.flatListItemView}>{item.name}</Text>
        <View style={styles.horizontalFlatListBar} />
      </View>
    );
  };

  const dateObjects = PlaceDate.period.map((item) => ({
    start: new Date(item.start),
    end: new Date(item.end),
  }));

  const formattedDates = dateObjects.map((dateObj) => {
    const startMonth = moment(dateObj.start).format("MMM");
    const endMonth = moment(dateObj.end).format("MMM");
    const startDay = moment(dateObj.start).format("DD");
    const endDay = moment(dateObj.end).format("DD");

    return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
  });

  const privateSharedType = `${guestPlaceType.selection.toLowerCase()} room`;

  const placeTypes =
    guestPlaceType.selection === "Entire"
      ? `${
          PlaceInfo.bedroomsIncrement
        } bedroom ${PlaceType.placeType.toLowerCase()}`
      : privateSharedType;

  const sublettingDesc = `I'm subletting my ${placeTypes}`;

  return (
    <>
      <ViewShot
        style={styles.container}
        ref={screenShotRef}
        options={{ format: "png", quality: 0.9 }}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={[styles.container, { marginBottom: "20%" }]}
          >
            <View style={styles.logoView}>
              <SvgXml xml={images.AppIcon()} />
            </View>

            <Image
              style={styles.userImg}
              source={{ uri: PlacePhoto.image[0].uri }}
            />

            <View style={styles.saparator} />
            {/* <EmptyCard>
          <Seperator />
          <View style={styles.userDesCard}>
            <View style={styles.textStyle}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={16}
                fontweight={700}
              >
                I'm subletting my {PlaceType.placeType.toLowerCase()} in{" "}
                {address}, from {finalFirstDate}. You can now reserve it through
                Cercles
              </Typography.ChileLine>
            </View>
          </View>

          <View style={{ paddingVertical: 10 }}>
            {featuresText(filteredItems)}
          </View>
          <View style={{ flexDirection: "row", marginLeft: 20, bottom: 10 }}>
            <View style={{ alignSelf: "center" }}>
              <Typography.ChileLine
                color={colors.darkBlue}
                size={14}
                fontweight={500}
              >
                Per night
              </Typography.ChileLine>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Typography.ChileLine
                color={colors.primary}
                size={22}
                fontweight={700}
              >
                {"$" + "" + PlacePrice.price}
              </Typography.ChileLine>
            </View>
          </View>
          <Seperator />
        </EmptyCard> */}
            <Seperator />
            <EmptyCard
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 10,
              }}
              children={
                <>
                  <TouchableWithoutFeedback
                  // disabled={optionButtonStatus}
                  // onPress={
                  //   () =>
                  //     profileData.id !== userId.id
                  //       ? navigation.navigate(OTHER_USER_PROFILE, { userId })
                  //       : setOptionButtonStatus(true)

                  //   // navigation.navigate(ACCOUNT_STACK)
                  // }
                  >
                    <View style={styles.cardContainer}>
                      <Seperator />
                      <View style={styles.cardHeadingTextContainer}>
                        <SvgXml xml={images.PlanListIcon(colors.primary)} />
                        <Typography.BoldHeading
                          fontWeight={"bold"}
                          fontSize={18}
                        >
                          {sublettingDesc}
                        </Typography.BoldHeading>
                      </View>
                      <Seperator seperate={10} />
                      <Typography.TypeDescription
                        type1={"Location: "}
                        description={
                          PlaceLocation.city + ", " + PlaceLocation.country
                        }
                      />
                      <Seperator />
                      <Typography.TypeDescription
                        type1={"Date:"}
                        description={formattedDates.join(", ").toString()}
                      />
                      <Seperator />
                      <Typography.TypeDescription
                        type1={"Price: "}
                        description={`${currencyCode}${PlacePrice.price} per night`}
                      />
                      <Seperator />
                    </View>
                  </TouchableWithoutFeedback>
                  {featuresText(filteredItems)}
                  {/* <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <View style={{ alignSelf: "center" }}>
                      <Typography.ChileLine
                        color={colors.darkBlue}
                        size={14}
                        fontweight={500}
                      >
                        Per night
                      </Typography.ChileLine>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Typography.ChileLine
                        color={colors.primary}
                        size={22}
                        fontweight={700}
                      >
                        {"$" + "" + PlacePrice.price}
                      </Typography.ChileLine>
                    </View>
                  </View> */}
                  <Seperator seperate={10} />
                </>
              }
            />
          </ScrollView>
        </View>
      </ViewShot>
      <View style={{ backgroundColor: colors.white }}>
        <Button.ConfirmCancelBtn
          position={"relative"}
          width={"100%"}
          onPressConfirm={() => onPressConfirm()}
          onPressCancel={() => onPressCancel()}
          confirmTitle={"Share"}
          cancelTitle={"View home"}
          cancelButtonColor={colors.white}
          cancelTextColor={colors.darkBlue}
          cancelButtonStyle={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
          }}
        />
        <Seperator seperate={10} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardHeadingTextContainerDes: {
    fontSize: 14,
    fontWeight: 500,
  },
  cardHeadingTextContainer: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 40,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoView: {
    marginLeft: 20,
    marginTop: 20,
  },
  userImg: {
    width: "90%",
    height: "50%",
    alignSelf: "center",
    borderRadius: 18,
    marginTop: "5%",
  },
  rightIconView: {
    backgroundColor: colors.white,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: "center",
    marginTop: "10%",
    justifyContent: "center",
  },
  saparator: {
    marginTop: 10,
  },
  requestSentView: {
    marginTop: "5%",
    alignSelf: "center",
  },
  flatListContainer: {
    margin: 5,
    alignSelf: "center",
    flexDirection: "row",
    bottom: 10,
  },
  flatListItemView: {
    color: colors.grayText,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  reservationText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
    maxWidth: 300,
  },
  userDesCard: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
  },
  horizontalFlatListBar: {
    height: 20,
    width: 1,
    backgroundColor: colors.grayText,
    alignSelf: "center",
    marginLeft: 10,
    bottom: 5,
  },
});

export default ShareListings;
