import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import BackButton from "../../components/backButton";
import { BottomButton, CircularBtnIcon } from "../../components/Button";
import colors from "../../config/colors";
import images from "../../assets/index";
import { useDispatch, useSelector } from "react-redux";
import PostAPIs from "../../api/post_api";
import { GetProfile } from "../../redux/Actions/AccountActions";

const NotificationsSettings = ({ navigation }) => {
  const { profileData } = useSelector((state) => state.AccountReducer);
  const dispatch = useDispatch();
  const [optionsArray, setOptionsArray] = useState([
    {
      id: 1,
      icon: images.BookmarkIcon(colors.primary),
      name: "Booking and reservation activity",
      isOn: profileData.bookingAndReservationActivityNotification,
    },
    {
      id: 2,
      icon: images.MessageIcon(colors.primary),
      name: "Messages",
      isOn: profileData.messagesNotification,
    },
    {
      id: 3,
      icon: images.BellIcon(colors.primary),
      name: "Reminders",
      isOn: profileData.remindersNotification,
    },
    {
      id: 4,
      icon: images.AnnouncementsIcon(colors.primary),
      name: "Announcements",
      isOn: profileData.announcementsNotification,
    },
    {
      id: 5,
      icon: images.PlanListIcon(colors.primary),
      name: "Travel plans",
      isOn: profileData.travelPlansNotification,
    },
  ]);

  useMemo(async () => {
    let data = {
      bookingAndReservationActivityNotification: optionsArray[0].isOn,
      messagesNotification: optionsArray[1].isOn,
      remindersNotification: optionsArray[2].isOn,
      announcementsNotification: optionsArray[3].isOn,
      travelPlansNotification: optionsArray[4].isOn,
    };
    try {
      await PostAPIs.updateNotificationsSettings(data);
      dispatch(GetProfile());
    } catch (error) {
      console.log(error.response);
    }
  }, [optionsArray]);

  const toggleSwitchChange = (id, item) => {
    setOptionsArray((opt) =>
      opt.map((data) =>
        data.id === id ? { ...data, isOn: !data.isOn || false } : data
      )
    );
  };

  return (
    <View style={styles.container}>
      <BackButton
        Text={"Notification settings"}
        icon3={images.InviteIcon(colors.primary)}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.mainContainer}>
        {optionsArray.map((item) => (
          <CircularBtnIcon
            onPress={() => toggleSwitchChange(item.id, item)}
            iconStatus
            icon={item.icon}
            label={item.name}
            onSwitchToggle={() => toggleSwitchChange(item.id, item)}
            isSwitchOn={item.isOn}
            switchOnColor={colors.primary}
            switchVisibility
          />
        ))}
      </View>
      <View style={styles.BackButton}>
        <BottomButton
          buttonColor={colors.white}
          color={colors.black}
          onPress={() => navigation.goBack()}
          label={"Back"}
        />
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
    position: "absolute",
    bottom: "3%",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },
});

export default NotificationsSettings;
