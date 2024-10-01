import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Linking } from "react-native";
import BackButton from "../../components/backButton";
import colors from "../../config/colors";
import images from "../../assets/index";
import { BottomButton, CircularBtnIcon } from "../../components/Button";
import {
  CANCELLATION_POLICY,
  CONTACT_INFO,
  CONTACT_US,
  DELETE_ACCOUNT,
  MY_IDENTITY,
  NOTIFICATIONS_SETTINGS,
  PAYMENTS_PAYOUTS,
  VERIFY_IDENTITY,
  WELCOME,
} from "../../navigation/RouteNames";
import { TabBarVisibility } from "../../redux/Actions/AccountActions";
import { useDispatch } from "react-redux";
import { storage } from "../../components/asyncStorageToken";
import GetAPIs from "../../api/get_api";
import BottomCard from "../../components/bottomCard";
import EmptyScreen from "../../components/EmptyScreenMessage";
import SeperatorLine from "../../components/SeperatorLine";

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const optionsArray = [
    { icon: images.InfoIcon(colors.primary), name: "My contact info" },
    { icon: images.CoinsIcon(colors.primary), name: "Payments & Payouts" },
    {
      icon: images.accountIcon(false, colors.primary),
      name: "Verify identity",
    },
    { icon: images.BellIcon(colors.primary), name: "Notifications settings" },
    { icon: images.ContactUsIcon(colors.primary), name: "Contact us" },
    { icon: images.InfoIcon(colors.primary), name: "Cancellation policy" },
    { icon: images.LogoutIcon(colors.primary), name: "Logout" },
    { icon: images.DeleteIcon(colors.primary), name: "Delete account" },
  ];

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  const logout = () => {
    Alert.alert("Cercles", "Are you sure you want to log out?", [
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await GetAPIs.logoutUser();
            storage.delete("user_token");
            storage.delete("user_onboarding_completed");
            storage.delete("photosUploaded");
            navigation.reset({
              routes: [{ name: WELCOME }],
            });
          } catch (error) {
            console.log(error);
            storage.delete("user_token");
            storage.delete("user_onboarding_completed");
            storage.delete("photosUploaded");
            navigation.reset({
              routes: [{ name: WELCOME }],
            });
          }
        },
      },
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert(
      "Cercles",
      "Are you sure you want to delete your account?(this process is irreversible)",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            GetAPIs.deleteProfileData((res) => {
              if (res.status) {
                storage.delete("user_token");
                storage.delete("user_onboarding_completed");
                storage.delete("photosUploaded");
                navigation.reset({
                  routes: [{ name: WELCOME }],
                });
              } else if (!res.status) {
                Alert.alert(res.message[0]);
              } else {
                Alert.alert(res.message[0]);
              }
            });
          },
        },
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
      ]
    );
  };

  const navigateToOptions = (type) => {
    switch (type.name) {
      case "My contact info":
        navigation.navigate(CONTACT_INFO);
        break;
      case "Payments & Payouts":
        navigation.navigate(PAYMENTS_PAYOUTS);
        break;
      case "Verify identity":
        navigation.navigate(MY_IDENTITY);
        break;
      case "Notifications settings":
        navigation.navigate(NOTIFICATIONS_SETTINGS);
        break;
      case "Contact us":
        // navigation.navigate(CONTACT_US);
        setVisible(true);
        break;
      case "Cancellation policy":
        navigation.navigate(CANCELLATION_POLICY);
        break;
      case "Logout":
        logout();
        break;
      case "Delete account":
        deleteAccount();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} Text={"Settings"} />
      <View style={styles.optionContainer}>
        {optionsArray.map((item, index) => (
          <CircularBtnIcon
            onPress={() => navigateToOptions(item)}
            iconStatus
            icon={item.icon}
            label={item.name}
            rightArrowIconStatus
          />
        ))}
      </View>
      <BottomCard
        singleButtonColor={colors.darkBlue}
        singleButtonTextColor={colors.white}
        singleButtonOnPress={() => setVisible(!visible)}
        singleButtonLabel={"Back"}
        buttonType={"single"}
        visibleStatus={visible}
      >
        <EmptyScreen
          backgroundColor={colors.darkgray}
          icon1Status
          icon1={images.ContactUsIcon(colors.primary)}
          icon1Height={28}
          icon1Width={28}
          headingText={"Contact Us"}
          description={"How you want to contact us?"}
        />
        <CircularBtnIcon
          rightArrowIconStatus
          iconHeight={40}
          iconWidth={40}
          onPress={() => Linking.openURL("mailto:support@example.com")}
          iconStatus
          icon={images.MailIcon(colors.primary)}
          label={"Email"}
        />
        <SeperatorLine />
        <CircularBtnIcon
          rightArrowIconStatus
          iconHeight={40}
          iconWidth={40}
          onPress={() =>
            Linking.openURL("whatsapp://send?text=hello&phone=+16507720615")
          }
          iconStatus
          icon={images.WhatsappIcon(colors.primary)}
          label={"WhatsApp"}
        />
        <SeperatorLine />
      </BottomCard>
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
  optionContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
});

export default Settings;
