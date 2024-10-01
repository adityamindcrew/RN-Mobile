import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  View
} from "react-native";
import PostAPIs from "../../api/post_api";
import images from "../../assets/index";
import { BottomButton, BtnWhiteOption } from "../../components/Button";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import Seperator from "../../components/Seperator";
import BackButton from "../../components/backButton";
import * as Typography from "../../config/Typography";
import colors from "../../config/colors";

const Contacts = ({ navigation, route }) => {
  const [bottomCard, setBottomCard] = useState(false);
  const [contacts, setContacts] = useState(route.params.data || []);

  const referFriend = async (item, index) => {
    let data = await contacts.map((contact, contactIndex) =>
      contactIndex === index ? { ...contact, referred: true } : contact
    );
    setContacts(data);
    if (!item.referred) {
      let formData = {
        type: "social",
        phoneNo: item.phoneNumbers[0]?.number,
        phoneCode: "+91",
        phoneName: `${item.givenName} ${item.familyName}`,
      };
      PostAPIs.ReferFriends(formData, (response) => {
        if (!response.status) {
          // setLoader(false);
          // setRefferedFriends([]);
          // Alert.alert("Cercles", "Something went wrong");
        } else if (response.status) {
          let data = response.data;
          // setLoader(false);
          // setRefferedFriends(data);
          // Alert.alert("Cercles", "Success");
        } else {
          // setLoader(false);
          // Alert.alert("Cercles", "Something went wrong");
          // setRefferedFriends([]);
        }
      });
    }
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
      <BackButton
        icon1Status
        icon2Status={contacts.length > 0}
        icon1={images.InviteIcon(colors.primary)}
        icon2={images.NewMessage(colors.primary)}
        onPress={() => navigation.goBack()}
        Text={"Contacts"}
      />
      {contacts.length == 0 ? (
        <View style={styles.mainContainer}>
          <EmptyScreenMessage
            headingText={"No Contacts Found"}
            icon1Status
            icon1={images.FriendsIcon()}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            height: "80%",
          }}
        >
          <View style={{ paddingRight: 20 }}>
            <Typography.HH>
              Refer friends to join, so we fast track them for review
            </Typography.HH>
          </View>
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
          />
        </View>
      )}
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

export default Contacts;
