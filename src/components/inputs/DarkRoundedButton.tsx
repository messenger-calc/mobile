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
  color: string;
}

const DarkRoundedButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  style,
  color,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[tw`bg-zinc-800 px-5 py-1.5 rounded-3xl`, style]}
    >
      <Text
        style={[tw`text-white text-center text-xl font-bold`, { color: color }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default DarkRoundedButton;
