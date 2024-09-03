import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import tw from "twrnc";

import RootStackNavigator from "./src/navigation/RootStackNavigator";

export default function App() {
  return (
    <>
      <RootStackNavigator />
      <StatusBar style="auto" />
    </>
  );
}
