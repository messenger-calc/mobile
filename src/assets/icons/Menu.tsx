import React from "react";
import Svg, { Path } from "react-native-svg";

const MenuIcon = (props: any) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill="white"
    {...props}
  >
    <Path
      d="M8.25 15.5H23.25V13H8.25V15.5ZM0.75 0.5V3H23.25V0.5H0.75ZM8.25 9.25H23.25V6.75H8.25V9.25Z"
      fill="white"
    />
  </Svg>
);

export default MenuIcon;
