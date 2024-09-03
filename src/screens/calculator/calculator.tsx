import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import tw from "twrnc";
import Button from "./components/Button";
import Display from "./components/Display";
import GradientSphere from "../../components/common/GradientSphere";

const { width } = Dimensions.get("window");

let variableA: number;
let variableB: number;
let result: number;

const CalculatorScreen = ({ navigation }: any) => {
  const [display, setDisplay] = useState<number | string>(0);
  const [operation, setOperation] = useState<string>("");
  const [shouldConcatenateDigit, setShouldConcatenateDigit] =
    useState<boolean>(false);

  const concatenateDigit = (digit: string) => {
    if (shouldConcatenateDigit) {
      if (display.toString().replace(",", "").length >= 9) {
        // Do nothing if the display is at its maximum length
      } else if (display === "0" && digit === "0") {
        // Do nothing if the display is "0" and the digit is "0"
      } else {
        setDisplay(Number(display.toString() + digit));
      }
    } else {
      setDisplay(digit);
      setShouldConcatenateDigit(true);
    }
  };

  const activateOperation = (operation: string) => {
    variableA = Number(display);
    setShouldConcatenateDigit(false);
    setOperation(operation);
  };

  const generateResult = () => {
    const startChat = (res: number) => {
      if (res === 4000) {
        console.log("Start Chat!");
        navigation.navigate("Call");
      }
    };

    switch (operation) {
      case "division":
        variableB = Number(display);
        result = variableA / variableB;
        setDisplay(+result.toFixed(5));
        setOperation("");
        break;
      case "multiplication":
        variableB = Number(display);
        result = variableA * variableB;
        setDisplay(+result.toFixed(5));
        setOperation("");
        break;
      case "subtraction":
        variableB = Number(display);
        result = variableA - variableB;
        setDisplay(+result.toFixed(5));
        setOperation("");
        startChat(result);
        break;
      case "addition":
        variableB = Number(display);
        result = variableA + variableB;
        setDisplay(+result.toFixed(5));
        setOperation("");
        startChat(result);
        break;
      default:
        return null;
    }
  };

  const cancelButton = () => {
    if (!shouldConcatenateDigit && display === 0) {
      setOperation("");
    }
    setDisplay(0);
    setShouldConcatenateDigit(false);
  };

  const addDot = () => {
    if (Math.round(Number(display)) === Number(display)) {
      setDisplay(`${display}.`);
      setShouldConcatenateDigit(true);
    }
  };

  const percentage = () => {
    setDisplay(Number(display) / 100);
  };

  const invertSignal = () => {
    setDisplay(Number(display) * -1);
  };

  return (
    <View style={styles.container}>
      <Display display={Number(display)} />
      <View style={styles.row}>
        <Button
          backgroundColor="#A6A6A6"
          color="black"
          text={display ? "C" : "AC"}
          func={cancelButton}
        />
        <Button
          backgroundColor="#A6A6A6"
          color="black"
          text="+/-"
          func={invertSignal}
        />
        <Button
          backgroundColor="#A6A6A6"
          color="black"
          text="%"
          func={percentage}
        />
        <Button
          orange
          backgroundColor={operation === "division" ? "white" : "#FF9404"}
          color={operation === "division" ? "#FF9404" : "white"}
          text="÷"
          func={() => activateOperation("division")}
        />
      </View>
      <View style={styles.row}>
        <Button
          backgroundColor="#333333"
          color="white"
          text="7"
          func={() => concatenateDigit("7")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text="8"
          func={() => concatenateDigit("8")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text="9"
          func={() => concatenateDigit("9")}
        />
        <Button
          orange
          backgroundColor={operation === "multiplication" ? "white" : "#FF9404"}
          color={operation === "multiplication" ? "#FF9404" : "white"}
          text="×"
          func={() => activateOperation("multiplication")}
        />
      </View>
      <View style={styles.row}>
        <Button
          backgroundColor="#333333"
          color="white"
          text="4"
          func={() => concatenateDigit("4")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text="5"
          func={() => concatenateDigit("5")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text="6"
          func={() => concatenateDigit("6")}
        />
        <Button
          orange
          backgroundColor={operation === "subtraction" ? "white" : "#FF9404"}
          color={operation === "subtraction" ? "#FF9404" : "white"}
          text="−"
          func={() => activateOperation("subtraction")}
        />
      </View>
      <View style={styles.row}>
        <Button
          backgroundColor="#333333"
          color="white"
          text="1"
          func={() => concatenateDigit("1")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text="2"
          func={() => concatenateDigit("2")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text="3"
          func={() => concatenateDigit("3")}
        />
        <Button
          orange
          backgroundColor={operation === "addition" ? "white" : "#FF9404"}
          color={operation === "addition" ? "#FF9404" : "white"}
          text="+"
          func={() => activateOperation("addition")}
        />
      </View>
      <View style={styles.row}>
        <Button
          special
          backgroundColor="#333333"
          color="white"
          text="0"
          func={() => concatenateDigit("0")}
        />
        <Button
          backgroundColor="#333333"
          color="white"
          text=","
          func={addDot}
        />
        <Button
          orange
          backgroundColor="#FF9404"
          color="white"
          text="="
          func={generateResult}
        />
      </View>
    </View>
    // <View style={tw`flex-1 items-center justify-center bg-black`}>
    //   <GradientSphere animatedStyle={topGradientStyle} color="#522d83" />
    //   <GradientSphere animatedStyle={bottomGradientStyle} color="#0f84a7" />

    //   <View style={tw`w-full px-10 mb-4 rounded`}>
    //     <Text style={tw`text-4xl text-right text-white`}>{display}</Text>
    //   </View>
    //   <View style={tw`flex-row flex-wrap justify-center`}>
    //     {buttons.map((button) => (
    //       <TouchableOpacity
    //         key={button}
    //         style={tw`m-2 p-4 bg-gray-700 rounded-full w-[18%] h-16 items-center justify-center`}
    //         onPress={() => handlePress(button)}
    //       >
    //         <Text style={tw`text-white text-2xl`}>{button}</Text>
    //       </TouchableOpacity>
    //     ))}
    //   </View>
    // </View>
  );
};

export default CalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "black",
    padding: 8,
    paddingBottom: 70,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 7,
  },
  icon: {
    textAlign: "center",
  },
});
