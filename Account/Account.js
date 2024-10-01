import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import colors from "../../config/colors";
import { SvgXml } from "react-native-svg";
import images from "../../assets/index";
import {
  BottomButton,
  BtnCircleChips,
  BtnCircleGrey,
  BtnCirclePrimary,
} from "../../components/Button";
import EmptyCard from "../../components/forms/emptyCard";
import * as Typography from "../../config/Typography";
import Inputfield from "../../components/forms/inputField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ACCOUNT_STACK,
  EDIT_PHOTOS,
  REFER_FRIENDS,
  SETTINGS,
} from "../../navigation/RouteNames";
import Seperator from "../../components/Seperator";
import { useDispatch, useSelector } from "react-redux";
import SpinnerOverlay from "../../components/spinner";
import HorizontalFlatlist from "../../components/horizontalFlatList";
import {
  EditProfile,
  GetProfile,
  SelectCurrency,
  TabBarVisibility,
} from "../../redux/Actions/AccountActions";
import EmptyScreenMessage from "../../components/EmptyScreenMessage";
import CustomAutoCompletePlaces from "../../components/CustomAutoCompletePlaces";
import { FloatingBtn } from "../../components/floatingButton";
import Slider from "../../components/ImageCarousel/Slider";
import isValidUrl from "../../utils/isValidUrl";

const Account = ({ navigation }) => {
  const [edit, setEdit] = useState(false);
  const [owner, setOwner] = useState(true);
  const [loader, setLoader] = useState(false);
  const [inputEducationFieldStatus, setInputEducationFieldStatus] =
    useState(false);
  const [inputFieldLanguageStatus, setInputFieldLanguageStatus] =
    useState(false);

  const [addEducationInput, SetAddEducationInput] = useState("");
  const [addLanguageInput, SetAddLanguageInput] = useState("");
  const [educationItems, setEducationItems] = useState([]);
  const [languageItems, setLanguageItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [profileImages, setProfileImages] = useState([]);
  const [bio, setBio] = useState("");
  const [locationFrom, setLocationFrom] = useState("");
  const [locationLivesIn, setLocationLivesIn] = useState("");
  const [works, setWorks] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isLinkedinConnected, setLinkedInConnected] = useState(false);
  const [isInstaConnected, setIsInstaConnected] = useState(false);
  const [newLocationFrom, setNewLocationFrom] = useState("");
  const [newLocationLivesIn, setNewLocationLivesIn] = useState("");
  const { profileData, profileDataFailed } = useSelector(
    (state) => state.AccountReducer
  );

  const { unreadMessageCount } = useSelector((state) => state.FeedReducer);

  const dispatch = useDispatch();

  const writeBio = (text) => {
    if (text.length <= 500) {
      setBio(text);
      return;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(TabBarVisibility("flex"));
    });

    return unsubscribe;
  }, [navigation]);

  useMemo(() => {
    try {
      const fetchData = async () => {
        dispatch(SelectCurrency(profileData.currency));

        const education = profileData.educations.map(
          (response) => response.education
        );
        const languages = profileData.languages.map(
          (response) => response.language
        );

        setLanguageItems(languages);
        setEducationItems(education);
        setFullName(profileData.firstName);
        let photos = profileData.personalImgs.sort(
          (a, b) => a.position - b.position
        );
        setProfileImages(photos);
        setBio(profileData.bio);
        setLocationFrom(profileData.actualLocation);
        setNewLocationFrom(profileData.actualLocation);
        setLocationLivesIn(profileData.currentLocation);
        setNewLocationLivesIn(profileData.currentLocation);
        setWorks(profileData.companyName);
        setJobTitle(profileData.jobTitle);
        setLinkedInConnected(profileData.isLinkedinConnected);
        setIsInstaConnected(profileData.isInstaConnected);
      };

      fetchData();
    } catch (error) {
      console.log(error);
    }

    return [
      profileData.currency,
      profileData.educations,
      profileData.languages,
      profileData.firstName,
      profileData.lastName,
      profileData.personalImgs,
      profileData.bio,
      profileData.actualLocation,
      profileData.currentLocation,
      profileData.companyName,
      profileData.jobTitle,
      profileData.isLinkedinConnected,
      profileData.isInstaConnected,
      dispatch,
      setLanguageItems,
      setEducationItems,
      setFullName,
      setProfileImages,
      setBio,
      setLocationFrom,
      setLocationLivesIn,
      setWorks,
      setJobTitle,
      setLinkedInConnected,
      setIsInstaConnected,
    ];
  }, [
    profileData.currency,
    profileData.educations,
    profileData.languages,
    profileData.firstName,
    profileData.lastName,
    profileData.personalImgs,
    profileData.bio,
    profileData.actualLocation,
    profileData.currentLocation,
    profileData.companyName,
    profileData.jobTitle,
    profileData.isLinkedinConnected,
    profileData.isInstaConnected,
    dispatch,
    setLanguageItems,
    setEducationItems,
    setFullName,
    setProfileImages,
    setBio,
    setLocationFrom,
    setLocationLivesIn,
    setWorks,
    setJobTitle,
    setLinkedInConnected,
    setIsInstaConnected,
  ]);

  const editProfile = async () => {
    setEdit(!edit);
    setInputEducationFieldStatus(false);
    setInputFieldLanguageStatus(false);
  };

  const Retry = () => {
    dispatch(GetProfile());
  };

  const referFriends = () => {
    navigation.navigate(REFER_FRIENDS);
  };

  const settings = () => {
    navigation.navigate(SETTINGS);
  };

  const onAddHandler = () => {
    if (addEducationInput === "") {
      Alert.alert("Please enter your education");
      return false;
    }
    setEducationItems((prevItems) => [...prevItems, addEducationInput]);
    SetAddEducationInput("");
    setInputEducationFieldStatus(false);
  };

  const onAddLanguageHandler = () => {
    if (addLanguageInput === "") {
      Alert.alert("Please enter a language");
      return false;
    }
    setLanguageItems((prevItems) => [...prevItems, addLanguageInput]);
    SetAddLanguageInput("");
    setInputFieldLanguageStatus(false);
  };

  const handleRemoveItem = (index) => {
    setEducationItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleRemoveLanguageItem = (index) => {
    setLanguageItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handleRemoveItem(index)}
        style={styles.item}
      >
        <Text style={[styles.title, { marginRight: edit ? 5 : 0 }]}>
          {item}
        </Text>
        {edit && (
          <SvgXml
            hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
            style={{ alignSelf: "center" }}
            xml={images.cross(colors.grayText)}
            onPress={() => handleRemoveItem(index)}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderLanguageItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handleRemoveLanguageItem(index)}
        style={styles.item}
      >
        <Text style={[styles.title, { marginRight: edit ? 5 : 0 }]}>
          {item}
        </Text>
        {edit && (
          <SvgXml
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            style={{ alignSelf: "center" }}
            xml={images.cross(colors.grayText)}
            onPress={() => handleRemoveLanguageItem(index)}
          />
        )}
      </TouchableOpacity>
    );
  };

  const addSchoolHandler = () => {
    setInputEducationFieldStatus(!inputEducationFieldStatus);
  };

  const addLanguageHandler = () => {
    setInputFieldLanguageStatus(!inputFieldLanguageStatus);
  };

  const saveProfile = () => {
    setInputEducationFieldStatus(false);
    setInputFieldLanguageStatus(false);
    let formdata = {
      currentLocation: locationLivesIn,
      actualLocation: locationFrom,
      companyName: works,
      jobTitle: jobTitle,
      educations: educationItems,
      languages: languageItems,
      bio: bio,
    };
    dispatch(EditProfile(formdata));
    setTimeout(() => {
      dispatch(GetProfile());
    }, 2000);
    setEdit(false);
  };

  const openLink = (link) => {
    try {
      let url = new URL(link);
      url = String(url);
      if (!url.includes("https://")) {
        url = "https://" + url;
      }
      console.log(url);
      Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlur = (e, type) => {
    if (e.nativeEvent.text === "") {
      if (type === "from") {
        setNewLocationFrom(locationFrom);
      } else {
        setNewLocationLivesIn(locationLivesIn);
      }
    }
  };

  return (
    <>
      <KeyboardAwareScrollView>
        <SpinnerOverlay loaderState={loader} />
        {profileDataFailed && (
          <View style={styles.mainContainer}>
            <EmptyScreenMessage
              headingText={"Something went wrong!"}
              buttonText={"Retry"}
              onPressButton={Retry}
              icon1Status
              icon1={images.InfoIcon(colors.primary)}
            />
          </View>
        )}
        {profileData.length !== 0 && (
          <ScrollView>
            <View style={styles.container}>
              <View>
                {/* <ImageSlider
                disableOnPress
                sliderBoxHeight={554}
                images={profileImages}
              /> */}
                <Slider
                  // onPress={() => navigation.navigate(EDIT_PHOTOS)}
                  height={554}
                  images={profileImages}
                />
                {!edit && (
                  <>
                    <TouchableOpacity
                      onPress={settings}
                      style={styles.settingsIcon}
                    >
                      <SvgXml xml={images.GearIcon()} />
                    </TouchableOpacity>
                    {isValidUrl(profileData.instagram) && (
                      <TouchableOpacity
                        onPress={() => openLink(profileData.instagram)}
                        style={styles.InstagramIcon}
                      >
                        <SvgXml xml={images.InstagramIcon(colors.white)} />
                      </TouchableOpacity>
                    )}
                    {isValidUrl(profileData.linkedin) && (
                      <TouchableOpacity
                        style={styles.LinkdInIcon}
                        onPress={() => openLink(profileData.linkedin)}
                      >
                        <SvgXml xml={images.LinkdInIcon(colors.white)} />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
              {edit && (
                <TouchableOpacity onPress={editProfile} style={styles.backIcon}>
                  <SvgXml xml={images.backArrow()} />
                </TouchableOpacity>
              )}
              <Seperator seperate={8} />
              {!edit &&
                (owner ? (
                  <View style={styles.editProfile}>
                    <BtnCircleGrey
                      label={"Edit Profile"}
                      iconStatus
                      icon={images.Edit(colors.white)}
                      onPress={editProfile}
                      color={colors.white}
                    />
                    <BtnCircleGrey
                      label={"Refer Friends"}
                      iconStatus
                      onPress={() => referFriends()}
                      icon={images.InviteIcon(colors.white)}
                      color={colors.white}
                    />
                  </View>
                ) : (
                  <View style={styles.primaryButton}>
                    <BtnCirclePrimary
                      label={"Message"}
                      iconStatus
                      icon={images.MessageIcon()}
                      color={colors.white}
                    />
                  </View>
                ))}
              {edit && (
                <View style={styles.primaryButton}>
                  <BtnCirclePrimary
                    label={"Edit Photos"}
                    color={colors.white}
                    onPress={() => navigation.navigate(EDIT_PHOTOS)}
                  />
                </View>
              )}
              <Seperator seperate={8} />
              <EmptyCard
                children={
                  <View style={styles.cardContainer}>
                    <View style={edit && styles.headerText}>
                      {edit && (
                        <SvgXml
                          xml={images.accountIcon(false, colors.primary)}
                        />
                      )}
                      <Text
                        style={
                          edit ? styles.userCardHeading : styles.cardHeading
                        }
                      >
                        {edit ? (
                          <>
                            <Text>About Me</Text>
                          </>
                        ) : (
                          fullName
                        )}
                      </Text>
                    </View>
                    {edit && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingRight: 10,
                        }}
                      >
                        <Typography.HH>Bio</Typography.HH>
                        <Typography.HH>{`${
                          bio ? bio.length : 0
                        }/500`}</Typography.HH>
                      </View>
                    )}

                    {(bio || edit) && (
                      <Inputfield
                        maxLength={500}
                        scrollEnabled={edit}
                        multiline
                        editable={edit}
                        changeTextHanlder={writeBio}
                        valueChange={bio}
                        placeHolder={""}
                        bottomLineColor={
                          !edit ? colors.white : colors.horizontalLineColor
                        }
                      />
                    )}
                  </View>
                }
              />
              <Seperator seperate={8} />
              <EmptyCard
                children={
                  <View style={styles.cardContainer}>
                    <View style={styles.headerText}>
                      <SvgXml xml={images.LocationIcon(colors.primary)} />
                      <Text style={styles.userCardHeading}>Location</Text>
                    </View>
                    <Seperator />
                    <Typography.HH>From</Typography.HH>
                    {/* <Inputfield
                    scrollEnabled={edit}
                    multiline
                    editable={edit}
                    changeTextHanlder={setLocationFrom}
                    valueChange={locationFrom}
                    placeHolder={"From"}
                  /> */}
                    <CustomAutoCompletePlaces
                      editable={edit}
                      onFocus={() => setNewLocationFrom("")}
                      onBlur={(e) => handleBlur(e, "from")}
                      onPressResult={(location) => {
                        setLocationFrom(location.location);
                      }}
                      placeHolder={newLocationFrom}
                      onError={(err) => console.log("aDsfghjklhghfdf", err)}
                      placeholderTextColor={colors.black}
                    />
                    <Typography.HH>Lives in</Typography.HH>
                    <CustomAutoCompletePlaces
                      editable={edit}
                      onBlur={(e) => handleBlur(e, "lives")}
                      onPressResult={(location) => {
                        setLocationLivesIn(location.location);
                      }}
                      placeHolder={newLocationLivesIn}
                      onFocus={() => setNewLocationLivesIn("")}
                      onError={(err) => console.log("aDsfghjklhghfdf", err)}
                      placeholderTextColor={colors.black}
                    />
                  </View>
                }
              />
              <Seperator seperate={8} />
              <EmptyCard
                children={
                  <View style={styles.cardContainer}>
                    <View style={styles.headerText}>
                      <SvgXml xml={images.ProfessionIcon(colors.primary)} />
                      <Text style={styles.userCardHeading}>Professional</Text>
                    </View>
                    <Seperator />
                    <Typography.HH>Works</Typography.HH>
                    <Inputfield
                      scrollEnabled={edit}
                      editable={edit}
                      changeTextHanlder={setWorks}
                      valueChange={works}
                      placeHolder={"Works"}
                    />
                    <Typography.HH>Job Title</Typography.HH>
                    <Inputfield
                      scrollEnabled={edit}
                      editable={edit}
                      changeTextHanlder={setJobTitle}
                      valueChange={jobTitle}
                      placeHolder={"Job Title"}
                    />
                    <Typography.HH>Education</Typography.HH>
                    {edit && (
                      <View style={styles.btnContainer}>
                        <BtnCircleChips
                          label="Add Education"
                          color={colors.white}
                          labelcolor="white"
                          size={12}
                          onPress={() => addSchoolHandler()}
                          icon={images.addIcon()}
                          iconStatus
                        />
                      </View>
                    )}
                    {inputEducationFieldStatus ? (
                      <View style={styles.addSchoolContainer}>
                        <View style={styles.inputFieldView}>
                          <Inputfield
                            changeTextHanlder={(e) => SetAddEducationInput(e)}
                            valueChange={addEducationInput}
                            placeHolder={"Enter Educations"}
                            autoFocus
                            onEndEditing={onAddHandler}
                          />
                        </View>
                        <View style={styles.addBtnContainer}>
                          <BtnCircleChips
                            label="Add"
                            color={colors.white}
                            labelcolor="white"
                            size={12}
                            onPress={onAddHandler}
                          />
                        </View>
                      </View>
                    ) : null}
                    <HorizontalFlatlist
                      numOfColumns={3}
                      renderItem={renderItem}
                      itemData={educationItems}
                    />
                    <Typography.HH>Languages</Typography.HH>
                    {edit && (
                      <View style={styles.btnContainerLanguages}>
                        <BtnCircleChips
                          label="Add Languages"
                          color={colors.white}
                          labelcolor="white"
                          size={12}
                          onPress={() => addLanguageHandler()}
                          icon={images.addIcon()}
                          iconStatus
                        />
                      </View>
                    )}
                    {inputFieldLanguageStatus ? (
                      <View style={styles.addSchoolContainer}>
                        <View style={styles.inputFieldView}>
                          <Inputfield
                            changeTextHanlder={(e) => SetAddLanguageInput(e)}
                            valueChange={addLanguageInput}
                            placeHolder={"Enter Languages"}
                            autoFocus
                            onEndEditing={onAddLanguageHandler}
                          />
                        </View>
                        <View style={styles.addBtnContainer}>
                          <BtnCircleChips
                            label="Add"
                            color={colors.white}
                            labelcolor="white"
                            size={12}
                            onPress={() => onAddLanguageHandler()}
                          />
                        </View>
                      </View>
                    ) : null}
                    <HorizontalFlatlist
                      numOfColumns={3}
                      renderItem={renderLanguageItem}
                      itemData={languageItems}
                    />
                  </View>
                }
              />
              {edit && (
                <View style={styles.BackButton}>
                  <BottomButton
                    buttonColor={colors.primary}
                    color={colors.white}
                    onPress={saveProfile}
                    label={"Save"}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </KeyboardAwareScrollView>
      {!edit && (
        <View style={styles.chatButton}>
          <FloatingBtn
            unread={unreadMessageCount}
            unreadCount={unreadMessageCount}
            FloatingBtnHandler={() =>
              navigation.navigate("ChatStack", {
                screen: "Inbox",
                params: {
                  lastScreen: ACCOUNT_STACK,
                },
              })
            }
            text={"Chat"}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: { position: "absolute", right: "3%", top: "2%", zIndex: 50 },
  ListingIcon: { position: "absolute", right: "3%", bottom: "3%" },
  LinkdInIcon: { position: "absolute", left: "12%", bottom: "3%" },
  InstagramIcon: {
    position: "absolute",
    left: "3%",
    bottom: "3%",
  },
  chatButton: {
    position: "absolute",
    bottom: "3%",
    right: "5%",
  },
  backIcon: {
    position: "absolute",
    left: "3%",
    top: "1%",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 13,
  },
  editProfile: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  seperator: {
    marginVertical: 8,
  },
  primaryButton: {
    paddingHorizontal: 16,
  },
  cardHeading: {
    fontSize: 24,
    color: colors.darkBlue,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 20,
  },
  userCardHeading: {
    fontSize: 16,
    color: colors.darkBlue,
    fontWeight: "700",
  },
  cardContainer: {
    paddingRight: 10,
    paddingBottom: 10,
  },
  headerText: {
    marginTop: 20,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addSchoolContainer: {
    width: "100%",
    flexDirection: "row",
  },
  inputFieldView: { width: "70%", marginLeft: 10 },
  addBtnContainer: { width: "25%", marginTop: 10 },
  item: {
    height: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: colors.grayText,
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    maxWidth: 100,
  },
  title: {
    fontSize: 12,
    alignSelf: "center",
  },
  btnContainer: { marginLeft: 20, marginTop: 10, width: 120 },
  btnContainerLanguages: {
    marginLeft: 20,
    marginTop: 10,
    bottom: 0,
    width: 130,
  },
  BackButton: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default Account;
