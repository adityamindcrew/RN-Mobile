import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import * as Button from "../../../components/Button";
import BackButton from "../../../components/backButton";
import DraggableFlatList from "../../../components/draggableFlatlist";
import EmptyCard from "../../../components/forms/emptyCard";
import ProgressBar from "../../../components/progressBar";
import SpinnerOverlay from "../../../components/spinner";
import * as Typography from "../../../config/Typography";
import colors from "../../../config/colors";
import images from "../../../assets";
import { placePhoto } from "../../../redux/Actions/userListingAction";
import { SvgXml } from "react-native-svg";
import DraggableFlatListViewOnboarding from "../../../components/draggableFlatlistOnboarding";
import DraggableFlatListPlace from "../../../components/DraggableFlatlistPlace";
import Tile from "../../../components/SortableListComponents/Tile";
import SortableList from "../../../components/SortableListComponents/SortableList";
import Seperator from "../../../components/Seperator";
import saveAndExitListing from "../../../utils/saveAndExitListing";
import { storage } from "../../../components/asyncStorageToken";
import { TabBarVisibility } from "../../../redux/Actions/AccountActions";
const AddPlacePhoto = ({ navigation }) => {
  const [image, setImage] = useState([]);
  const [firstItem, setFirstItem] = useState([]);
  const [allowedLength, setAllowedLength] = useState(0);
  const dispatch = useDispatch();
  let draftData = storage.getString("drafted_Listing") || null;
  draftData = JSON.parse(draftData);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
  }, [navigation]);

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type, otherPhotos) => {
    let options = {
      mediaType: type,
      quality: 1,
      saveToPhotos: true,
      selectionLimit: 20 - allowedLength,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          alert("User cancelled camera picker");
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }

        setImage(response.assets);
        if (otherPhotos) {
          setImage([...image, ...response.assets]);
          setAllowedLength(allowedLength + response.assets.length);
          return;
        }
        setFirstItem(response.assets.slice(0, 1));
        setImage([...image, ...response.assets.slice(1)]);
        setAllowedLength(allowedLength + response.assets.length);
      });
    }
  };

  const ChoosePhoto = () => {
    Alert.alert("Cercles", "Choose photo from", [
      {
        text: "Camera",
        onPress: () => captureImage("photo", "first"),
      },
      {
        text: "Photos",
        onPress: () => chooseFile("photo", "first"),
      },
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  };

  const chooseFile = (type, otherPhotos) => {
    let options = {
      mediaType: type,
      quality: 1,
      selectionLimit: 20 - allowedLength,
      maxWidth: 900,
      maxHeight: 900,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      if (otherPhotos) {
        setImage([...image, ...response.assets]);
        setAllowedLength(allowedLength + response.assets.length);
        return;
      }
      setFirstItem(response.assets.slice(0, 1));
      setImage([...image, ...response.assets.slice(1)]);
      setAllowedLength(allowedLength + response.assets.length);
    });
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  const onPressConfirm = () => {
    const arr = [...firstItem, ...image];
    if (arr.length === 0) {
      Alert.alert("Please select images");
      return;
    }
    if (arr.length < 5) {
      Alert.alert("Please add at least 5 pics to showcase your beautiful home");
      return;
    }
    draftData.images = arr;
    const data = draftData;
    storage.set("drafted_Listing", JSON.stringify(data));
    const objectToAdd = { image: arr };
    dispatch(placePhoto(objectToAdd));
    navigation.navigate("PlaceTitle");
  };

  const onCrossClick = (item) => {
    if (item === firstItem[0]) {
      let filteredArray = image.filter((i) => i.fileName !== item.fileName);
      setFirstItem(filteredArray);
      return;
    }
    setAllowedLength(allowedLength - 1);
    let filteredArray = image.filter((i) => i.fileName !== item.fileName);
    setImage(filteredArray);
  };

  return (
    <Container>
      <ScrollView>
        <BackButton
          onPress={() => navigation.goBack()}
          Text={
            image.length === 0
              ? "Add some photos of your home"
              : "Ready! Is everything\nok?"
          }
          onPressButton={() => saveAndExitListing("AddPlacePhoto", navigation)}
          buttonStatus
          buttonText={"Save & Exit"}
        />

        {allowedLength === 0 ? (
          <View style={styles.cardView}>
            <EmptyCard>
              <View style={styles.saparator}></View>
              <Typography.HH>
                You'll need 5 photos to get started. Please take high quality
                photos to show how beautiful your place is and bring it to life
              </Typography.HH>
              <View style={styles.btnView}>
                <View style={styles.addPhoto}>
                  <Button.BtnContain
                    label="Add Photos"
                    color={colors.darkBlue}
                    labelcolor="white"
                    onPress={() => chooseFile("photo")}
                  />
                </View>
                <View style={styles.takePhoto}>
                  <Button.BtnContain
                    label="Take new photos"
                    color={colors.darkBlue}
                    labelcolor="white"
                    onPress={() => captureImage("photo")}
                  />
                </View>
              </View>
            </EmptyCard>
          </View>
        ) : (
          <>
            <View style={styles.dragToReorderView}>
              <Typography.P color={colors.paragraphColor}>
                Drag to re-order
              </Typography.P>
            </View>
            <View style={styles.flatListView}>
              <DraggableFlatListPlace
                profileData={image}
                onCrossClick={(item) => onCrossClick(item)}
                newOrder={setImage}
                firstItem={setFirstItem}
                firstImage={firstItem}
                setNewLength={setAllowedLength}
              />
            </View>
            {allowedLength < 20 && (
              <TouchableOpacity
                onPress={() => ChoosePhoto()}
                style={styles.addPhotoStyle}
              >
                <SvgXml xml={images.PlusIcon(colors.primary)} />
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
      <ProgressBar style={styles.progress} progress={0.6} percentage={60} />
      <View style={styles.bottomButton}>
        <Button.CircularSmallButton
          backgroundColor={colors.white}
          title={"Back"}
          textColor={colors.black}
          onPress={onPressCancel}
        />
        <Button.CircularSmallButton
          backgroundColor={colors.primary}
          title={"Next"}
          textColor={colors.white}
          onPress={onPressConfirm}
        />
      </View>
      <Seperator seperate={10} />
    </Container>
  );
};

export default AddPlacePhoto;

const styles = StyleSheet.create({
  addPhoto: {
    width: "45%",
  },
  saparator: {
    marginTop: 20,
  },
  cardView: {
    marginTop: 20,
  },
  takePhoto: {
    width: "45%",
  },
  btnView: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  flatListView: {
    marginTop: 20,
  },
  dragToReorderView: {
    marginTop: 10,
    marginLeft: 20,
  },
  bottomButton: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  progress: { flexDirection: "row", width: "85%", alignSelf: "center" },
  addPhotoStyle: {
    width: 98,
    height: 98,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 18,
  },
});

const Container = styled.View`
  flex: 1;
`;
