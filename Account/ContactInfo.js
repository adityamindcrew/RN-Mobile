import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BackButton from "../../components/backButton";
import EmptyCard from "../../components/forms/emptyCard";
import Inputfield from "../../components/forms/inputField";
import * as Typography from "../../config/Typography";
import { BottomButton, BtnCircleGrey } from "../../components/Button";
import colors from "../../config/colors";
import images from "../../assets/index";
import Seperator from "../../components/Seperator";
import { useDispatch, useSelector } from "react-redux";
import { EditProfile, GetProfile } from "../../redux/Actions/AccountActions";
import queryString from "query-string";
import { SvgXml } from "react-native-svg";
import PopOverModal from "../../components/PopOverModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RemoveSpecialSymbol from "../../utils/RemoveSpecialSymbol";
import isValidUrl from "../../utils/isValidUrl";

const ContactInfo = ({ navigation }) => {
  const { profileData } = useSelector((state) => state.AccountReducer);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [instgram, setInstagram] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [showPop, setShowPop] = useState(false);
  const touchable = useRef();
  const [educationItems, setEducationItems] = useState([]);
  const [languageItems, setLanguageItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const education = profileData.educations.map(
      (response) => response.education
    );
    const languages = profileData.languages.map(
      (response) => response.language
    );

    setLanguageItems(languages);
    setEducationItems(education);
    setFirstName(profileData.firstName);
    setLastName(profileData.lastName);
    setPhoneNo(profileData.phoneNo);
    setEmail(profileData.email);
    if (profileData.instagram) {
      const urlValues = queryString.parseUrl(profileData.instagram);
      if (!isValidUrl(urlValues.url)) {
        setInstagram("");
        return;
      }
      let text = urlValues.url.split("/");
      setInstagram("@" + text[3]);
    }
    setLinkedIn(profileData.linkedin);
  }, [profileData]);

  const saveProfile = () => {
    let instaLink = instgram;

    if (instgram.includes("@")) {
      const formatText = RemoveSpecialSymbol(instgram);
      if (!formatText) {
        Alert.alert("Please enter valid instagram handle");
        return;
      }
      instaLink = `https://www.instagram.com/${formatText}/?hl=en`;
    }
    let formdata = {
      instagram: instaLink,
      linkedin: linkedIn,
      educations: educationItems,
      languages: languageItems,
    };
    dispatch(EditProfile(formdata));
    setTimeout(() => {
      dispatch(GetProfile());
    }, 2000);
    navigation.goBack();
  };

  const help = () => {
    setShowPop(!showPop);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <BackButton
          onPress={() => navigation.goBack()}
          Text={"My contact info"}
        />
        <EmptyCard
          children={
            <View style={styles.cardContainer}>
              <View style={styles.formContainer}>
                <Typography.HH>First Name</Typography.HH>
                <Inputfield
                  changeTextHanlder={setFirstName}
                  valueChange={firstName}
                  editable={false}
                  placeHolder={"Enter your first name"}
                />
                <Typography.HH>Last Name</Typography.HH>
                <Inputfield
                  changeTextHanlder={setLastName}
                  valueChange={lastName}
                  editable={false}
                  placeHolder={"Enter your last name"}
                />
                <Typography.HH>Phone Number</Typography.HH>
                <Inputfield
                  changeTextHanlder={setPhoneNo}
                  valueChange={phoneNo}
                  editable={false}
                  placeHolder={"Enter your phone number"}
                />
                <Typography.HH>Email</Typography.HH>
                <Inputfield
                  changeTextHanlder={setEmail}
                  valueChange={email}
                  editable={false}
                  placeHolder={"Email"}
                />

                <View style={{ flexDirection: "row", paddingLeft: 15 }}>
                  <SvgXml
                    style={{ position: "absolute", left: 10 }}
                    xml={images.InstagramIcon(colors.grayText)}
                  />
                  <Typography.HH>Instagram Handle</Typography.HH>
                </View>
                <Inputfield
                  changeTextHanlder={setInstagram}
                  valueChange={instgram}
                  editable={
                    !profileData.instagram || profileData.instagram.length === 0
                  }
                  placeHolder={"Instagram"}
                />
                <View
                  style={{
                    flexDirection: "row",
                    paddingLeft: 15,
                    alignItems: "center",
                  }}
                >
                  <SvgXml
                    style={{ position: "absolute", left: 10 }}
                    xml={images.LinkdInIcon(colors.grayText)}
                  />
                  <PopOverModal
                    text={
                      "Go to profile, three dotted circle on the right, Share via -> Copy"
                    }
                    isVisible={showPop}
                    ref={touchable}
                    onRequestClose={() => setShowPop(!showPop)}
                  />
                  <Typography.HH>LinkedIn Profile link</Typography.HH>
                  <TouchableOpacity
                    ref={touchable}
                    onPress={help}
                    style={styles.questionMark}
                  >
                    <Text style={{ color: "red" }}>?</Text>
                  </TouchableOpacity>
                </View>
                <Inputfield
                  changeTextHanlder={setLinkedIn}
                  valueChange={linkedIn}
                  // editable={profileData.linkedin.length === 0}
                  placeHolder={"LinkedIn"}
                />
              </View>
            </View>
          }
        />
        <View style={styles.BackButton}>
          <BottomButton
            buttonColor={colors.primary}
            color={colors.white}
            onPress={saveProfile}
            label={"Save"}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  BackButton: {
    alignItems: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  formContainer: {
    width: "100%",
  },
  socialContainer: {
    gap: 10,
    paddingHorizontal: 15,
  },
  seperator: {
    marginVertical: 10,
  },
  BackButton: {
    alignItems: "center",
    marginTop: 10,
    position: "absolute",
    bottom: "2%",
    width: "100%",
  },
  questionMark: {
    borderRadius: 30,
    borderColor: "red",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginLeft: 5,
  },
});

export default ContactInfo;
