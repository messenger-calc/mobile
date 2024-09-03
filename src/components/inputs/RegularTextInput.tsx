import React from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";
import tw from "twrnc";

interface CustomTextInputProps extends TextInputProps {
  additionalStyles?: any;
  placeholder?: string;
}

const RegularTextInput: React.FC<CustomTextInputProps> = ({
  additionalStyles,
  placeholder,
  ...props
}) => {
  return (
    <View style={tw`w-full`}>
      <TextInput
        style={[
          tw`border rounded-2xl py-2 px-2 text-base`,
          styles.input,
          additionalStyles,
        ]}
        placeholderTextColor={"gray"}
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#5D5D5D",
    borderWidth: 1,
    backgroundColor: "#333333",
    color: "white",
  },
});

export default RegularTextInput;
