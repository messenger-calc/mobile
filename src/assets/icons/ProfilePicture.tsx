import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface MyIconProps {
  width?: number;
  height?: number;
}

const ProfilePIctureIcon: React.FC<MyIconProps> = ({
  width = 80,
  height = 80,
}) => (
  <Svg width={width} height={height} viewBox="0 0 80 80" fill="none">
    <Defs>
      <LinearGradient
        id="paint0_linear_104_235"
        x1="-9.5"
        y1="-20.5"
        x2="83.5"
        y2="106"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0%" stopColor="white" />
        <Stop offset="100%" stopColor="#999999" stopOpacity={0.4} />
      </LinearGradient>
    </Defs>
    <Path
      d="M40 0C17.92 0 0 17.92 0 40C0 62.08 17.92 80 40 80C62.08 80 80 62.08 80 40C80 17.92 62.08 0 40 0ZM40 16C47.72 16 54 22.28 54 30C54 37.72 47.72 44 40 44C32.28 44 26 37.72 26 30C26 22.28 32.28 16 40 16ZM40 72C31.88 72 22.28 68.72 15.44 60.48C22.2 55.2 30.72 52 40 52C49.28 52 57.8 55.2 64.56 60.48C57.72 68.72 48.12 72 40 72Z"
      fill="url(#paint0_linear_104_235)"
      fillOpacity={0.4}
    />
  </Svg>
);

export default ProfilePIctureIcon;
