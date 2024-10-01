import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import BackButton from "../../components/backButton";
import images from "../../assets/index";
import colors from "../../config/colors";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import { BottomButton, BtnWhiteOption } from "../../components/Button";
import BottomCard from "../../components/bottomCard";
import { GetContactsAndroid, GetContactsIOS } from "../../helpers/Permissions";
import Seperator from "../../components/Seperator";
import SpinnerOverlay from "../../components/spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  ReferFriendsAPI,
  TabBarVisibility,
} from "../../redux/Actions/AccountActions";
import CustomSearchBar from "../../components/CustomSearchBar";
import Share from "react-native-share";
import { storage } from "../../components/asyncStorageToken";

const ReferFriends = ({ navigation }) => {
  const [bottomCard, setBottomCard] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { referredFriends } = useSelector((state) => state.AccountReducer);
  const dispatch = useDispatch();

  const bottomCardVisibility = () => {
    contacts.length == 0 && setBottomCard(!bottomCard);
  };

  const showAlert = () => {
    Alert.alert(
      "Cercles",
      "Contacts access Permission denied, Please allow the permission from settings",
      [
        {
          text: "Settings",
          onPress: () => Linking.openSettings(),
        },
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
      ]
    );
  };

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  const url = "https://www.my-cercles.com/";
  const title = "I invite you to join Cercles";
  const message = `Hey [Name] I sent you a referral to Cercles, the exclusive global community for home rental. This will give your application a priority review. I added you using xx, so make sure to use that number when you apply. You can apply here: [Appstore link]`;

  const ShareApp = async (name, number) => {
    const options = {
      url,
      title,
      message: `Hey ${name} I sent you a referral to Cercles, the exclusive global community for home rental. This will give your application a priority review. I added you using ${number}, so make sure to use that number when you apply.\n\nYou can apply here: ${url}`,
    };
    try {
      await Share.open(options);
    } catch (error) {
      error && console.log(error);
    }
  };

  const referFriend = async (item, index) => {
    const phoneNumber = item.phoneNumbers[0]?.number;
    ShareApp(item.givenName, phoneNumber);
    let data = contacts.map((contact, contactIndex) =>
      contactIndex === index ? { ...contact, referred: true } : contact
    );
    setContacts(data);
    if (!item.referred) {
      let formData = {
        type: "social",
        phoneNo: phoneNumber,
        phoneCode: "+91",
        phoneName: `${item.givenName} ${item.familyName}`,
      };

      dispatch(ReferFriendsAPI(formData));
    }
  };

  const getContacts = async () => {
    storage.set("FirstTime", true);

    Platform.OS == "ios"
      ? await GetContactsIOS()
          .then(async (data) => {
            if (Array.isArray(data)) {
              const referredPhoneNumbers = new Set(
                referredFriends.map((res) => res.phoneNo)
              );

              const updatedData = data.map((contact) => {
                if (referredPhoneNumbers.has(contact.phoneNumbers[0]?.number)) {
                  return { ...contact, referred: true };
                }
                return contact;
              });

              setContacts(updatedData);
              setContactData(updatedData);
            } else {
              showAlert();
            }
          })
          .catch((err) => setContacts([]))
      : await GetContactsAndroid()
          .then((data) => {
            if (Array.isArray(data)) {
              const referredPhoneNumbers = new Set(
                referredFriends.map((res) => res.phoneNo)
              );

              const updatedData = data.map((contact) => {
                if (referredPhoneNumbers.has(contact.phoneNumbers[0]?.number)) {
                  return { ...contact, referred: true };
                }
                return contact;
              });

              setContacts(updatedData);
              setContactData(updatedData);
            } else {
              showAlert();
            }
          })
          .catch((err) => setContacts([]));
    setBottomCard(false);
  };

  useMemo(() => {
    if (storage.getBoolean("FirstTime")) {
      getContacts();
    }
  }, []);

  const searchContacts = (text) => {
    if (text) {
      const data = contactData.filter((res) => {
        const fullName = `${res.givenName} ${res.familyName}`.toLowerCase();
        const searchText = text.toLowerCase();

        return fullName.includes(searchText);
      });
      if (data.length > 0) {
        setContacts(data);
        return;
      }
    }
    setContacts(contactData);
  };

  const renderContacts = ({ item, index }) => {
    const {
      givenName,
      familyName,
      phoneNumbers,
      thumbnailPath,
      referred = false,
    } = item;

    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <BtnWhiteOption
          heading={`${givenName} ${familyName}`}
          description={phoneNumbers[0]?.number}
          thumbnailPath={thumbnailPath}
          iconStatus2
          onPress={() => referFriend(item, index)}
          icon2={
            referred
              ? images.TickIcon(colors.primary)
              : images.PlusIcon(colors.black)
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SpinnerOverlay loaderState={loader} />
      <BackButton
        onPressIcon2={bottomCardVisibility}
        onPress={() => navigation.goBack()}
        Text={"Refer friends"}
      />
      {contacts.length == 0 ? (
        <View style={styles.mainContainer}>
          <EmptyScreenMessage
            headingText={"No Friends yet!"}
            description={
              "Please refer friends whom you think would be a great addition to our curated community. Referrals will be fast tracked for review."
            }
            buttonText={"Refer Friends"}
            onPressButton={bottomCardVisibility}
            icon1Status
            icon2Status
            icon1={images.FriendsIcon()}
            icon2={images.InviteIcon(colors.white)}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            height: "80%",
          }}
        >
          <CustomSearchBar
            style={{ alignSelf: "center" }}
            listData={contacts}
            onChangeText={searchContacts}
          />
          <Seperator seperate={10} />
          <FlatList
            contentContainerStyle={{
              justifyContent: "center",
              gap: 10,
            }}
            style={{ width: "100%", paddingHorizontal: 15 }}
            data={contacts}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={renderContacts}
            enableEmptySections={true}
            maxToRenderPerBatch={20}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
      <View style={styles.BackButton}>
        <BottomButton onPress={() => navigation.goBack()} label={"Back"} />
      </View>
      <BottomCard
        buttonType={"options"}
        visibleStatus={bottomCard}
        headingText1={"Cercles in trying to"}
        headingText2={"access your contacts"}
        description={
          "Cercles would like to access your contacts so you can refer your friends"
        }
        navigation={getContacts}
        backNavigation={bottomCardVisibility}
        confirmTitle={"Confirm"}
        cancelTitle={"Cancel"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  BackButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
  },
  seperator: {
    marginVertical: 10,
  },
});

export default ReferFriends;
