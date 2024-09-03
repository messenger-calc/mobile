import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

interface GradientSphereProps {
  animatedStyle: Animated.AnimateStyle<any>;
  color: string;
}

const GradientSphere: React.FC<GradientSphereProps> = ({
  animatedStyle,
  color,
}) => {
  return (
    <Animated.View style={[styles.gradientContainer, animatedStyle]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width * 1.5} ${width * 1.5}`}
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor="#000000" />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
  },
});

export default GradientSphere;
