import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import tw from "twrnc";
import GradientSphere from "../../components/common/GradientSphere";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }: any) => {
  const radius = useSharedValue(width * 0.5);
  const topOff = useSharedValue(-width);
  const bottomOff = useSharedValue(-width);
  const rightOff = useSharedValue(width / 2 - width * 0.5 * 1.5);
  const leftOff = useSharedValue(width / 2 - width * 0.5 * 1.5);
  const textOpacity = useSharedValue(0);

  const topGradientStyle = useAnimatedStyle(() => {
    return {
      width: radius.value,
      height: radius.value,
      borderRadius: radius.value / 2,
      top: topOff.value,
      right: rightOff.value,
    };
  });

  const bottomGradientStyle = useAnimatedStyle(() => {
    return {
      width: radius.value,
      height: radius.value,
      borderRadius: radius.value / 2,
      bottom: bottomOff.value,
      left: leftOff.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  useEffect(() => {
    radius.value = withTiming(width * 1.5, { duration: 3000 });
    textOpacity.value = withTiming(1, { duration: 3000 });

    // Animate the offsets to their target positions
    // topOff.value = withTiming(0, { duration: 3000 });
    // rightOff.value = withTiming(0, { duration: 3000 });
    // bottomOff.value = withTiming(0, { duration: 3000 });
    // leftOff.value = withTiming(0, { duration: 3000 });
  }, []);

  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <View style={tw`z-1 justify-center items-center`}>
        <Animated.Text
          style={[
            tw`text-6xl font-extrabold text-white mb-2`,
            animatedTextStyle,
            styles.shadow,
          ]}
        >
          Welcome
        </Animated.Text>
        <Animated.Text
          onPress={() => navigation.navigate("Login")}
          style={[tw`text-gray-400 text-2xl px-6 py-1`, animatedTextStyle]}
        >
          Login
        </Animated.Text>
        <Animated.Text
          onPress={() => navigation.navigate("Register")}
          style={[tw`text-gray-400 text-2xl px-6 py-1`, animatedTextStyle]}
        >
          Register
        </Animated.Text>
      </View>
      <GradientSphere animatedStyle={topGradientStyle} color="#522d83" />
      <GradientSphere animatedStyle={bottomGradientStyle} color="#0f84a7" />
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    textShadowColor: "#9c9c9c",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },
});

export default WelcomeScreen;
