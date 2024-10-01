import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import styled from "styled-components";
import * as Typography from "../../config/Typography";
import EmptyCard from "../../components/forms/emptyCard";
import * as Button from "../../components/Button";
import images from "../../assets/index";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DraggableFlatList from "../../components/draggableFlatlist";
import BackButton from "../../components/backButton";
import colors from "../../config/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteProfilePhotos,
  EditProfilePhotos,
  GetProfile,
  TabBarVisibility,
} from "../../redux/Actions/AccountActions";
import { SvgXml } from "react-native-svg";
import SpinnerOverlay from "../../components/spinner";
import PostAPIs from "../../api/post_api";
const EditPhotos = ({ navigation }) => {
  const [filePath, setFilePath] = useState({});
  const [image, setImage] = useState([]);
  const [firstItem, setFirstItem] = useState([]);
  const [actualLength, setActualLength] = useState(0);
  const { profileData } = useSelector((state) => state.AccountReducer);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(TabBarVisibility("none"));
    return () => dispatch(TabBarVisibility("flex"));
  }, [navigation]);

  useMemo(() => {
    let imagess = profileData.personalImgs.map((image) => {
      return {
        fileName: image.id,
        fileSize: null,
        height: null,
        type: "image/png",
        uri: image.uri,
        width: null,
        position: image.position,
        id: image.id,
      };
    });
    imagess.sort((a, b) => a.position - b.position);
    setActualLength(imagess.length);
    setFirstItem(imagess.slice(0, 1));
    setImage(imagess.slice(1));
  }, [profileData]);

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
        // If CAMERA Permission is granted
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
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      quality: 1,
      selectionLimit: 4 - actualLength,
      maxWidth: 900,
      maxHeight: 900,
      quality: 0.4,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log("Response = ", response);

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

        setLoader(true);
        let arr = [...firstItem, ...image, ...response.assets];
        const photoData = new FormData();
        arr.forEach((item, i) => {
          photoData.append("personal", {
            uri: item.uri,
            type: "image/jpeg",
            name: item.fileName || `filename${i}.jpeg`,
          });
        });
        dispatch(EditProfilePhotos(photoData, navigation));
        setLoader(false);
      });
    }
  };

  const chooseFile = async (type) => {
    let options = {
      mediaType: type,
      quality: 1,
      selectionLimit: 4 - actualLength,
      maxWidth: 900,
      maxHeight: 900,
    };
    launchImageLibrary(options, async (response) => {
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
      setLoader(true);
      let arr = [...firstItem, ...image, ...response.assets];

      const photoData = new FormData();
      arr.forEach((item, i) => {
        photoData.append("personal", {
          uri: item.uri,
          type: "image/jpeg",
          name: item.fileName || `filename${i}.jpeg`,
          position: i + 1,
        });
      });
      // dispatch(EditProfilePhotos(photoData, navigation));
      await PostAPIs.editPhotos(photoData);
      dispatch(GetProfile(navigation));
      setLoader(false);
    });
  };

  const savePhotos = async () => {
    navigation.goBack();
    dispatch(GetProfile(navigation));
  };

  const onCrossClick = (item) => {
    if (item === firstItem[0]) {
      let deletePhoto = { deleted: [item.fileName] };
      dispatch(DeleteProfilePhotos(deletePhoto));
      return;
    }
    let deletePhoto = { deleted: [item.fileName] };
    dispatch(DeleteProfilePhotos(deletePhoto));
    let filteredArray = image.filter((i) => i.fileName !== item.fileName);
    setImage(filteredArray);
    setActualLength(actualLength - 1);
  };

  return (
    <Container>
      <BackButton
        onPress={() => {
          dispatch(GetProfile(navigation)), navigation.goBack();
        }}
        Text={"Edit Photos"}
      />
      <SpinnerOverlay
        loaderState={loader}
        textContent={"Uploading Images..."}
      />
      {actualLength === 0 ? (
        <View style={styles.cardView}>
          <EmptyCard>
            <View style={styles.saparator}></View>
            <Typography.HH>Upload 3-4 photos of yourself</Typography.HH>
            <View style={styles.btnView}>
              <View style={styles.addPhoto}>
                <Button.BtnContain
                  label="Add Photo"
                  color={colors.darkBlue}
                  labelcolor="white"
                  onPress={() => chooseFile("photo")}
                />
              </View>
              <View style={styles.takePhoto}>
                <Button.BtnContain
                  label="Take new photo"
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
            <DraggableFlatList
              profileData={image}
              onCrossClick={(item) => onCrossClick(item)}
              newOrder={setImage}
              firstItem={setFirstItem}
              firstImage={firstItem}
            />
            {actualLength < 4 && (
              <TouchableOpacity
                onPress={() => chooseFile("photo")}
                style={{
                  width: 103,
                  height: 103,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                  marginLeft: "4%",
                }}
              >
                <SvgXml xml={images.PlusIcon(colors.primary)} />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      <View style={styles.BackButton}>
        <Button.BottomButton
          buttonColor={colors.primary}
          onPress={savePhotos}
          label={"Save"}
          color={colors.white}
        />
      </View>
    </Container>
  );
};

export default EditPhotos;

const styles = StyleSheet.create({
  BackButton: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: "3%",
  },
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
});

const Container = styled.View`
  flex: 1;
`;
