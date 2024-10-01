import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import images from "../../../assets";
import colors from "../../../config/colors";
const PublishListings = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState([]);
  const { PlacePhoto } = useSelector((state) => state.userListingReducer);
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("ShareListings");
    }, 1000);
  });
  useEffect(() => {
    let imagess = PlacePhoto.image.map((image) => {
      return {
        fileName: image.id,
        fileSize: null,
        height: null,
        type: "image/png",
        uri: image.uri,
        width: null,
      };
    });
    setImage(imagess);
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.userImg} source={{ uri: PlacePhoto.image[0].uri }} />
      <View style={styles.rightIconView}>
        <SvgXml
          style={{ alignSelf: "center" }}
          xml={images.RightColoredIcon()}
        />
      </View>
      <View style={styles.requestSentView}>
        <Text style={styles.reservationText}>
          Congratulations, your home has been published!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImg: {
    width: "90%",
    height: "50%",
    alignSelf: "center",
    borderRadius: 18,
    marginTop: "15%",
  },
  rightIconView: {
    backgroundColor: colors.white,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: "center",
    marginTop: "10%",
    justifyContent: "center",
  },
  requestSentView: {
    marginTop: "5%",
    alignSelf: "center",
  },
  reservationText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
    maxWidth: 300,
  },
});

export default PublishListings;
