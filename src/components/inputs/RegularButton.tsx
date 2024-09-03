import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import tw from "twrnc";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
}

const RegularButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[tw`bg-white px-5 py-3 rounded-2xl`, style]}
    >
      <Text style={tw`text-black text-center text-xl font-bold`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RegularButton;
