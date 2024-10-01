import CheckBox from "@react-native-community/checkbox";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets";
import * as Button from "../../components/Button";
import Seperator from "../../components/Seperator";
import BackButton from "../../components/backButton";
import CheckBoxComp from "../../components/checkbox";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import CustomSlider from "../../components/CustomSlider";
import NumberSelector from "../../components/NumberSelector";
import { getFilteredList } from "../../redux/Actions/FeedActions";
import { SvgXml } from "react-native-svg";
import { PLAIN_FILTER, SLIDER_VALUE } from "../../redux/Type";

const items = [
  { id: 1, name: "Pets Allowed" },
  { id: 2, name: "High Speed Wifi" },
  { id: 3, name: "Wifi" },
  // Add more items as needed
];
const DATA = [
  {
    key: 1,
    value: "Any",
  },
  {
    key: 2,
    value: "1",
  },
  {
    key: 3,
    value: "2",
  },
  {
    key: 4,
    value: "3",
  },
  {
    key: 5,
    value: "4",
  },
  {
    key: 6,
    value: "5",
  },
];
const Filters = ({ navigation }) => {
  const [itemSelectedRooms, setItemSelectedRooms] = useState(0);
  const [itemSelectedBeds, setItemSelectedBeds] = useState(0);
  const [itemSelectedBaths, setItemSelectedBaths] = useState(0);
  const [selectedAmenitiesItems, setSelectedAmenitiesItems] = useState([]);
  const [
    selectedAdditionalAmenitiesItems,
    setSelectedAdditionalAmenitiesItems,
  ] = useState([]);
  const dispatch = useDispatch();

  const minPrice = 0;
  const maxPrice = 545;
  const [sliderValue, setSliderValue] = useState([minPrice, maxPrice]);
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
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  const { masterData } = useSelector((state) => state.userListingReducer);
  const { plainFilterObj } = useSelector((state) => state.FeedReducer);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  useEffect(() => {
    dispatch({
      type: SLIDER_VALUE,
      payload: [plainFilterObj.minPrice, plainFilterObj.maxPrice],
    });
  }, []);

  useEffect(() => {
    if (plainFilterObj.selectionId) {
      handleCheckboxChange(plainFilterObj.selectionId);
    }
  }, []);

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
      dispatch({
        type: PLAIN_FILTER,
        payload: {
          ...plainFilterObj,
          selection: "Entire",
          selectionId: { id: 1 },
        },
      });
    }
    if (check.id === 2) {
      setSelectedItem("Private");
      dispatch({
        type: PLAIN_FILTER,
        payload: {
          ...plainFilterObj,
          selection: "Private",
          selectionId: { id: 2 },
        },
      });
    }
    if (check.id === 3) {
      setSelectedItem("Shared");
      dispatch({
        type: PLAIN_FILTER,
        payload: {
          ...plainFilterObj,
          selection: "Shared",
          selectionId: { id: 3 },
        },
      });
    }
  };

  const handlerApplyFilter = () => {
    let formdata = {
      ...plainFilterObj,
      bathrooms: plainFilterObj.bathrooms || "any",
      bedrooms: plainFilterObj.bedrooms || "any",
      beds: plainFilterObj.beds || "any",
      minPrice: Number(plainFilterObj.minPrice),
      maxPrice: Number(plainFilterObj.maxPrice),
    };
    console.log(formdata);
    dispatch(getFilteredList(formdata));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <BackButton onPress={() => navigation.goBack()} Text={"Filters"} />
        <View style={styles.TypographyView}>
          <Typography.H color={colors.darkBlue} fontsize={18}>
            What's your budget?
          </Typography.H>
        </View>
        <Seperator />
        <CustomSlider
          fields
          selectedPrice={(res) => {
            dispatch({
              type: PLAIN_FILTER,
              payload: {
                ...plainFilterObj,
                minPrice: res[0],
                maxPrice: res[1],
              },
            });
          }}
        />
        <View style={styles.TypographyViewPlace}>
          <Typography.H color={colors.darkBlue} fontsize={18}>
            What type of place are you looking for?
          </Typography.H>
        </View>
        <View style={{ marginTop: 10 }} />
        <EmptyCard>
          <View style={styles.TypographyViewRange}>
            <Typography.H color={colors.darkBlue} fontSize={16}>
              Bedrooms & Beds
            </Typography.H>
          </View>
          <NumberSelector
            title={"Bedrooms"}
            selected={plainFilterObj.bedrooms}
            setSelected={(res) =>
              dispatch({
                type: PLAIN_FILTER,
                payload: {
                  ...plainFilterObj,
                  bedrooms: res,
                },
              })
            }
          />

          <NumberSelector
            title={"Beds"}
            selected={plainFilterObj.beds}
            setSelected={(res) =>
              dispatch({
                type: PLAIN_FILTER,
                payload: {
                  ...plainFilterObj,
                  beds: res,
                },
              })
            }
          />

          <NumberSelector
            title={"Bathrooms"}
            selected={plainFilterObj.bathrooms}
            setSelected={(res) =>
              dispatch({
                type: PLAIN_FILTER,
                payload: {
                  ...plainFilterObj,
                  bathrooms: res,
                },
              })
            }
          />
          <View style={styles.BottomSaparator} />
        </EmptyCard>
        <Seperator />

        <EmptyCard>
          <View style={styles.TypographyViewGuestPlace}>
            <Typography.H color={colors.darkBlue} fontsize={16}>
              What type of place will guests have at their disposal?{" "}
            </Typography.H>
            <Seperator />

            {checkboxes.map((checkbox) => (
              <TouchableOpacity
                onPress={() => handleCheckboxChange(checkbox)}
                style={styles.textIconView}
              >
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
                <SvgXml
                  key={checkbox.id}
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
          </View>
        </EmptyCard>
        <Seperator />

        <EmptyCard>
          <View style={{ paddingVertical: 10 }}>
            <View style={styles.amenitiesView}>
              <Typography.H color={colors.darkBlue} fontsize={16}>
                Amenities
              </Typography.H>
            </View>
            <View>
              {masterData?.masterAmenities?.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (plainFilterObj.amenities.includes(item.id)) {
                      let arr = plainFilterObj.amenities.filter(
                        (id) => id !== item.id
                      );
                      dispatch({
                        type: PLAIN_FILTER,
                        payload: {
                          ...plainFilterObj,
                          amenities: arr,
                          // additionalAmenities: [],
                        },
                      });
                    } else {
                      let arr = [...plainFilterObj.amenities, item.id];
                      dispatch({
                        type: PLAIN_FILTER,
                        payload: {
                          ...plainFilterObj,
                          amenities: arr,
                          // additionalAmenities: [],
                        },
                      });
                    }
                  }}
                >
                  <View style={styles.listItem}>
                    <Text>{item.name}</Text>

                    <SvgXml
                      key={item.id}
                      height={
                        plainFilterObj.amenities.includes(item.id) ? 28 : 25
                      }
                      width={
                        plainFilterObj.amenities.includes(item.id) ? 28 : 25
                      }
                      xml={
                        plainFilterObj.amenities.includes(item.id)
                          ? images.TickIcon(colors.primary)
                          : images.BlankCircleIcon(colors.primary)
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </EmptyCard>
        <Seperator />

        <EmptyCard>
          <View style={{ paddingVertical: 10 }}>
            <View style={styles.amenitiesView}>
              <Typography.H color={colors.darkBlue} fontsize={16}>
                Additional amenities
              </Typography.H>
            </View>
            <View>
              {masterData?.masterAdditionalAmenities?.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (plainFilterObj.additionalAmenities.includes(item.id)) {
                      let arr = plainFilterObj.additionalAmenities.filter(
                        (id) => id !== item.id
                      );
                      dispatch({
                        type: PLAIN_FILTER,
                        payload: {
                          ...plainFilterObj,
                          additionalAmenities: arr,
                        },
                      });
                    } else {
                      let arr = [
                        ...plainFilterObj.additionalAmenities,
                        item.id,
                      ];
                      dispatch({
                        type: PLAIN_FILTER,
                        payload: {
                          ...plainFilterObj,
                          additionalAmenities: arr,
                        },
                      });
                    }
                  }}
                >
                  <View style={styles.listItem}>
                    <Text>{item.name}</Text>
                    <SvgXml
                      key={item.id}
                      height={
                        plainFilterObj.additionalAmenities.includes(item.id)
                          ? 28
                          : 25
                      }
                      width={
                        plainFilterObj.additionalAmenities.includes(item.id)
                          ? 28
                          : 25
                      }
                      xml={
                        plainFilterObj.additionalAmenities.includes(item.id)
                          ? images.TickIcon(colors.primary)
                          : images.BlankCircleIcon(colors.primary)
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </EmptyCard>
        <View style={styles.bottomViewStyle}>
          <Button.BtnConfirmCancel
            onPressConfirm={() => handlerApplyFilter()}
            onPressCancel={() => navigation.goBack()}
            confirmTitle={"Search"}
            cancelTitle={"Cancel"}
            cancelButtonColor={colors.white}
            cancelTextColor={colors.darkBlue}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TypographyView: {
    marginLeft: 20,
  },
  FirstItem: {
    backgroundColor: colors.darkBlue,
    height: 32,
    width: 54,
    borderRadius: 24,
    justifyContent: "center",
  },
  FirstItemNotSelected: {
    backgroundColor: colors.white,
    height: 32,
    width: 54,
    borderRadius: 24,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.grayText,
  },
  bottomViewStyle: {
    marginTop: "20%",
    marginBottom: "5%",
  },
  TypographyViewRange: {
    marginTop: 10,
    marginLeft: 12,
  },
  textIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  BottomSaparator: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  TypographyViewPlace: {
    marginTop: 20,
    marginLeft: 20,
  },
  TypographyViewGuestPlace: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  Saparator: {
    marginTop: 10,
  },
  BedRoomView: {
    marginLeft: 10,
    marginTop: 10,
  },
  amenitiesView: {
    marginLeft: 18,
  },
  ItemText: {
    fontWeight: "500",
    lineHeight: 15,
    fontSize: 12,
    color: colors.white,
    textAlign: "center",
  },
  FirstItemText: {
    fontWeight: "500",
    lineHeight: 15,
    fontSize: 12,
    color: colors.white,
    textAlign: "center",
  },
  FirstItemTextNotSelected: {
    fontWeight: "500",
    lineHeight: 15,
    fontSize: 12,
    color: colors.darkBlue,
    textAlign: "center",
  },
  ItemTextSelected: {
    fontWeight: "500",
    lineHeight: 15,
    fontSize: 12,
    color: colors.darkBlue,
    textAlign: "center",
  },
  bgItem: {
    backgroundColor: colors.darkBlue,
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
  },
  selectedBgItem: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayText,
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
  },
  textView: {
    marginLeft: 0,
  },
  smallTextView: {
    maxWidth: 250,
  },
});

export default Filters;
