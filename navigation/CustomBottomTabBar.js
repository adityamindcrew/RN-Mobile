// import { useEffect } from "react";
// import { useNavigation } from "@react-navigation/native";

// const useCurrentScreenName = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const unsubscribe = navigation.addListener("state", () => {
//       const currentScreen = navigation.setOptions();
//       console.log("Current screen:", currentScreen);
//     });

//     return unsubscribe;
//   }, [navigation]);

//   return null;
// };

// export default useCurrentScreenName;
