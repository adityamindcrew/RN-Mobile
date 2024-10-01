import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomButton } from "../../components/Button";
import Seperator from "../../components/Seperator";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import Inputfield from "../../components/forms/inputField";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { INFO_FOR_GUESTS } from "../../redux/Type";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";

export default function InfoforGuest({ navigation, route }) {
  const dispatch = useDispatch();
  const editable = route?.params?.editable;
  const { infoForGuest } = useSelector((state) => state.userListingReducer);

  const goBackHandler = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(TabBarVisibility("none"));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <BackButton
            onPress={() => goBackHandler()}
            Text={"Info for guests"}
          />
          <EmptyCard>
            <View style={styles.emptyCardContainer}>
              <View style={{ marginLeft: 20 }}>
                <Typography.T3 textAlign={"left"}>Wifi Info</Typography.T3>
              </View>
              <Seperator seperate={10} />
              <Typography.HH>Wifi network name</Typography.HH>
              <Inputfield
                editable={editable}
                changeTextHanlder={(text) =>
                  dispatch({
                    type: INFO_FOR_GUESTS,
                    payload: {
                      ...infoForGuest,
                      wifiName: text,
                    },
                  })
                }
                valueChange={infoForGuest.wifiName || ""}
                placeHolder={"Wifi network name"}
              />
              <Typography.HH>Wifi Password</Typography.HH>
              <Inputfield
                editable={editable}
                changeTextHanlder={(text) =>
                  dispatch({
                    type: INFO_FOR_GUESTS,
                    payload: {
                      ...infoForGuest,
                      wifiPassword: text,
                    },
                  })
                }
                valueChange={infoForGuest.wifiPassword}
                placeHolder={"Wifi password"}
              />
            </View>
          </EmptyCard>
          <Seperator seperate={10} />
          <EmptyCard>
            <View style={styles.emptyCardContainer}>
              <View>
                <View style={{ marginLeft: 20 }}>
                  <Typography.T3 textAlign={"left"}>
                    Check in instructions
                  </Typography.T3>
                </View>
                <Seperator />
                <Inputfield
                  editable={editable}
                  changeTextHanlder={(text) =>
                    dispatch({
                      type: INFO_FOR_GUESTS,
                      payload: {
                        ...infoForGuest,
                        checkinInfo: text,
                      },
                    })
                  }
                  valueChange={infoForGuest.checkinInfo}
                  placeHolder={"Enter check-in instructions"}
                  multiline
                />
              </View>
            </View>
          </EmptyCard>
          <Seperator seperate={10} />
          <EmptyCard>
            <View style={styles.emptyCardContainer}>
              <View>
                <View style={{ marginLeft: 20 }}>
                  <Typography.T3 textAlign={"left"}>House rules</Typography.T3>
                </View>
                <Seperator />
                <Inputfield
                  editable={editable}
                  changeTextHanlder={(text) =>
                    dispatch({
                      type: INFO_FOR_GUESTS,
                      payload: {
                        ...infoForGuest,
                        houseRules: text,
                      },
                    })
                  }
                  valueChange={infoForGuest.houseRules}
                  placeHolder={"Enter House Rules"}
                  multiline
                />
              </View>
            </View>
          </EmptyCard>
          <Seperator seperate={10} />
          <EmptyCard>
            <View style={styles.emptyCardContainer}>
              <View>
                <View style={{ marginLeft: 20 }}>
                  <Typography.T3 textAlign={"left"}>House manual</Typography.T3>
                </View>
                <Seperator />
                <Inputfield
                  editable={editable}
                  changeTextHanlder={(text) =>
                    dispatch({
                      type: INFO_FOR_GUESTS,
                      payload: {
                        ...infoForGuest,
                        houseManual: text,
                      },
                    })
                  }
                  valueChange={infoForGuest.houseManual}
                  placeHolder={"Enter house manual"}
                  multiline
                />
              </View>
            </View>
          </EmptyCard>
          <Seperator seperate={10} />
          <View style={styles.BackButton}>
            <BottomButton
              buttonColor={colors.white}
              color={colors.black}
              onPress={() => navigation.goBack()}
              label={"Back"}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCardContainer: {
    paddingTop: 20,
    paddingRight: 10,
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
});
