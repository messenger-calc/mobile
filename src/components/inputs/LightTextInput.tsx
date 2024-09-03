import React from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";
import tw from "twrnc";

interface CustomTextInputProps extends TextInputProps {
  additionalStyles?: any;
  additionalInputStyles?: any;
  placeholder?: string;
  inputValue?: any;
  setInputValue?: any;
}

const LightTextInput: React.FC<CustomTextInputProps> = ({
  additionalStyles,
  additionalInputStyles,
  placeholder,
  inputValue,
  setInputValue,
  ...props
}) => {
  const handleInputChange = (text: string) => {
    setInputValue(text);
  };
  return (
    <View style={[tw`w-full`, additionalStyles]}>
      <TextInput
        style={[
          tw`border text-black rounded-md py-2 px-2 text-base`,
          styles.input,
          additionalInputStyles,
        ]}
        value={inputValue}
        onChangeText={handleInputChange}
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
    backgroundColor: "white",
  },
});

export default LightTextInput;
